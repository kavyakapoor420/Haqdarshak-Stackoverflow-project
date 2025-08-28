from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import os
import pytz
from datetime import datetime
from docling_core.types.doc import ImageRefMode

from utils import logger
from pdf_processing import pdf_processor, doc_converter
from database import markdown_collection
from config import UPLOAD_DIR, PARSED_DIR
from models import PDFProcessResponse

# Import routers
from endpoints.posts import router as posts_router
from endpoints.rag import router as rag_router
from endpoints.schemes import router as schemes_router
from endpoints.translate import router as translate_router
from endpoints.health import router as health_router

app = FastAPI(title="RAG Chatbot Backend", description="RAG-based chatbot with PDF processing and vector search")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(posts_router)
app.include_router(rag_router)
app.include_router(schemes_router)
app.include_router(translate_router)
app.include_router(health_router)

@app.post("/upload-pdf", response_model=PDFProcessResponse)
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    file_path = None
    try:
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        logger.info(f"Uploaded file saved: {file_path}")
        
        result = doc_converter.convert(str(file_path))
        raw_text = result.document.text if hasattr(result.document, 'text') else ""
        if raw_text:
            result.document.text = pdf_processor.clean_text(raw_text)
        
        doc_filename = Path(file.filename).stem
        md_filename = PARSED_DIR / f"{doc_filename}-parsed.md"
        result.document.save_as_markdown(md_filename, image_mode=ImageRefMode.REFERENCED)
        
        with open(md_filename, 'r', encoding='utf-8') as f:
            markdown_content = f.read()
        
        markdown_content = pdf_processor.remove_base64_images(markdown_content)
        markdown_content = pdf_processor.clean_text(markdown_content)
        
        with open(md_filename, 'w', encoding='utf-8') as f:
            f.write(markdown_content)
        logger.info(f"Cleaned markdown saved to: {md_filename}")
        
        text_chunks = pdf_processor.chunk_text_custom(markdown_content, max_length=400)
        logger.info(f"Generated {len(text_chunks)} chunks from document")
        
        scheme_name = pdf_processor.extract_scheme_name_multilingual(text_chunks)
        if not scheme_name:
            logger.warning("No scheme name found in the document")
            scheme_name = "Unknown Scheme"
        
        embeddings_data = pdf_processor.create_embeddings_multilingual(text_chunks)
        logger.info(f"Created {len(embeddings_data)} multilingual embeddings")
        
        current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y')
        document = {
            "pdf_filename": file.filename,
            "markdown_content": markdown_content,
            "scheme_name": scheme_name,
            "created_at": current_time,
            "updated_at": current_time,
            "chunks_count": len(text_chunks)
        }
        
        existing_doc = markdown_collection.find_one({"scheme_name": scheme_name})
        if existing_doc:
            document_id = str(existing_doc["_id"])
            markdown_collection.update_one(
                {"_id": existing_doc["_id"]},
                {"$set": {
                    "markdown_content": document["markdown_content"],
                    "pdf_filename": document["pdf_filename"],
                    "updated_at": current_time,
                    "chunks_count": len(text_chunks)
                }}
            )
            logger.info(f"Updated existing document with ID: {document_id}")
        else:
            result_id = markdown_collection.insert_one(document).inserted_id
            document_id = str(result_id)
            logger.info(f"Stored new document with ID: {document_id}")
        
        pdf_processor.store_embeddings_in_elasticsearch(embeddings_data, document_id, scheme_name)
        
        # Clean up uploaded file
        if file_path and file_path.exists():
            os.remove(file_path)
        
        return PDFProcessResponse(
            success=True,
            message="PDF processed successfully with multilingual support",
            scheme_name=scheme_name,
            document_id=document_id,
            chunks_processed=len(text_chunks)
        )
    except Exception as e:
        logger.error(f"Error processing PDF: {e}")
        if file_path and file_path.exists():
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
