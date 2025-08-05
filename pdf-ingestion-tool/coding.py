import logging
import os
import re
import base64
from pathlib import Path
from datetime import datetime
from typing import List, Optional, Dict, Any
import pytz
import numpy as np

# FastAPI imports
from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Document processing imports
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.base_models import InputFormat
from docling.datamodel.pipeline_options import PdfPipelineOptions, TesseractOcrOptions
from docling.chunking import HybridChunker
from docling_core.types.doc import ImageRefMode

# AI and embeddings
import google.generativeai as genai
from sentence_transformers import SentenceTransformer

# Database imports
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Constants and Configuration - Hardcoded
GEMINI_API_KEY = "AIzaSyDy780rpCWpDX7NKz9oInrjr59dxY0iymE"
MONGO_URI = "mongodb://127.0.0.1:27017/"
HUGGING_FACE_TOKEN = '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'
EMBEDDING_MODEL_NAME = 'intfloat/multilingual-e5-base'
UPLOAD_DIR = Path("./uploads")
PARSED_DIR = Path("./parsed_docs")

# Create directories
UPLOAD_DIR.mkdir(exist_ok=True)
PARSED_DIR.mkdir(exist_ok=True)

# Initialize FastAPI app
app = FastAPI(title="PDF Ingestion Tool", description="Complete PDF processing and scheme extraction system")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize clients and models
try:
    # MongoDB connection
    mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = mongo_client['pdf_ingestion_system']
    markdown_collection = db['markdown_files']
    posts_collection = db['posts']
    
    # Elasticsearch connection with hardcoded credentials
    es_client = Elasticsearch(
        "https://my-elasticsearch-project-c1043c.es.us-central1.gcp.elastic.cloud:443",
        api_key="NmhZSlI1Z0JVTTFkNkhWVWVTdnQ6YXFKcW54R3RVazdkeFBjXzk5RC1EUQ=="
    )
    
    # Gemini AI configuration
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-2.0-flash-001')
    
    # Sentence transformer for embeddings with auth token
    embedding_model = SentenceTransformer(
        EMBEDDING_MODEL_NAME,
        use_auth_token=HUGGING_FACE_TOKEN
    )
    
    logger.info("All clients initialized successfully")
    
except Exception as e:
    logger.error(f"Failed to initialize clients: {e}")
    raise

# Pydantic models
class PostRequest(BaseModel):
    title: str
    description: str
    scheme_name: str

class PostApproval(BaseModel):
    post_id: str
    status: str  # "approved" or "rejected"

class PDFProcessResponse(BaseModel):
    success: bool
    message: str
    scheme_name: Optional[str] = None
    document_id: Optional[str] = None
    chunks_processed: Optional[int] = None

# Document converter setup
pipeline_options = PdfPipelineOptions(
    do_table_structure=True,
    do_ocr=True,
    ocr_options=TesseractOcrOptions(lang=["eng", "hin"]),
    generate_page_images=False,  # Don't generate page images to avoid base64
    generate_picture_images=False,  # Don't generate picture images
    images_scale=1.0,
)

doc_converter = DocumentConverter(
    format_options={
        InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
    }
)

class PDFProcessor:
    def __init__(self):
        self.chunker = HybridChunker(max_chunk_size=1000, min_chunk_size=200)
    
    def clean_text(self, text: str) -> str:
        """Clean up Unicode escape sequences and glyph IDs from OCR output."""
        unicode_map = {
            'uni092F': 'य', 'uni093F': 'ि', 'uni092Fा': 'या', 'uni093F/g7021': '',
            'uni0927': 'ध',
        }
        
        # Remove glyph IDs
        text = re.sub(r'/g\d{4}', '', text)
        
        # Replace Unicode mappings
        for code, char in unicode_map.items():
            text = text.replace(f'/{code}', char)
        
        # Remove remaining Unicode sequences
        text = re.sub(r'/uni[0-9A-Fa-f]{4}', '', text)
        
        # Clean whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def remove_base64_images(self, markdown_content: str) -> str:
        """Remove base64 image data from markdown content."""
        # Pattern to match base64 images in markdown
        base64_pattern = r'!\[.*?\]\(data:image/[^;]+;base64,[^)]+\)'
        
        # Replace with placeholder or remove entirely
        cleaned_content = re.sub(base64_pattern, '[Image removed]', markdown_content)
        
        return cleaned_content
    
    def chunk_text_custom(self, text: str, max_length: int = 400) -> List[str]:
        """Custom text chunking similar to your reference code."""
        words = text.split()
        chunks = []
        current_chunk = []
        current_length = 0
        
        for word in words:
            current_length += len(word) + 1
            if current_length > max_length:
                if current_chunk:  # Only append if current_chunk is not empty
                    chunks.append(' '.join(current_chunk))
                current_chunk = [word]
                current_length = len(word) + 1
            else:
                current_chunk.append(word)
        
        if current_chunk:
            chunks.append(' '.join(current_chunk))
        
        return chunks
    
    def extract_scheme_name(self, chunks: List[str]) -> Optional[str]:
        """Extract scheme name from text chunks using Gemini model."""
        prompt_template = """
        You are given a chunk of text from a document that may contain text in English and Hindi. 
        Your task is to identify and extract the exact name of the scheme mentioned in the text. 
        The scheme name is likely to be a proper noun or a specific title, such as "Sukanya Samriddhi Account Scheme" 
        or its Hindi equivalent "सुकन्या समृद्धि खाता योजना" or "Pradhan Mantri Awas Yojana", etc.
        
        If no scheme name is found in the chunk, return "null". 
        Provide only the scheme name as a string, or "null" if not found.

        Chunk:
        {chunk}

        Output only the scheme name or null:
        """
        
        for chunk in chunks:
            chunk_text = self.clean_text(chunk)
            
            logger.debug(f"Processing chunk: {chunk_text[:200]}")
            prompt = prompt_template.format(chunk=chunk_text)
            
            try:
                response = gemini_model.generate_content(prompt)
                scheme_name = response.text.strip()
                
                if scheme_name and scheme_name.lower() != 'null':
                    logger.info(f"Found scheme name: {scheme_name}")
                    return scheme_name
                    
            except Exception as e:
                logger.error(f"Error processing chunk with Gemini API: {e}")
                continue
        
        return None
    
    def create_embeddings(self, chunks: List[str]) -> List[Dict]:
        """Create vector embeddings for chunks using multilingual-e5-base."""
        embeddings_data = []
        
        for i, chunk_text in enumerate(chunks):
            chunk_text = self.clean_text(chunk_text)
            
            if not chunk_text.strip():
                continue
            
            try:
                # Create embedding with passage prefix for multilingual-e5-base
                embedding = embedding_model.encode(
                    f"passage: {chunk_text}", 
                    normalize_embeddings=True
                ).tolist()
                
                # Detect language
                language = "english" if all(ord(c) < 128 for c in chunk_text) else "multilingual"
                
                embeddings_data.append({
                    'chunk_id': i,
                    'text': chunk_text,
                    'embedding': embedding,
                    'language': language
                })
                
            except Exception as e:
                logger.error(f"Error creating embedding for chunk {i}: {e}")
                continue
        
        return embeddings_data
    
    def ensure_elasticsearch_index(self):
        """Create Elasticsearch index with proper mapping."""
        index_name = "markdown_vectors"
        
        try:
            # Check if index exists
            if es_client.indices.exists(index=index_name):
                logger.info(f"Index {index_name} already exists")
                return
            
            # Create mapping for multilingual-e5-base (768 dimensions)
            mapping = {
                "mappings": {
                    "properties": {
                        "document_id": {"type": "keyword"},
                        "scheme_name": {"type": "text"},
                        "chunk_id": {"type": "integer"},
                        "text": {"type": "text"},
                        "embedding": {
                            "type": "dense_vector",
                            "dims": 768,  # multilingual-e5-base has 768 dimensions
                            "index": True,
                            "similarity": "cosine"
                        },
                        "language": {"type": "keyword"},
                        "created_at": {"type": "date"}
                    }
                }
            }
            
            # Create index
            es_client.indices.create(index=index_name, body=mapping)
            logger.info(f"Created Elasticsearch index: {index_name} with 768-dimensional dense_vector field")
            
        except Exception as e:
            logger.error(f"Error creating Elasticsearch index: {e}")
            raise
    
    def store_embeddings_in_elasticsearch(self, embeddings_data: List[Dict], document_id: str, scheme_name: str):
        """Store embeddings in Elasticsearch."""
        try:
            # Ensure index exists
            self.ensure_elasticsearch_index()
            
            index_name = "markdown_vectors"
            current_time = datetime.now(pytz.timezone('Asia/Kolkata'))
            
            # Prepare documents for bulk insertion
            actions = []
            
            for embedding_data in embeddings_data:
                doc = {
                    "_index": index_name,
                    "_id": f"{document_id}_{embedding_data['chunk_id']}",
                    "_source": {
                        "document_id": document_id,
                        "scheme_name": scheme_name,
                        "chunk_id": embedding_data['chunk_id'],
                        "text": embedding_data['text'],
                        "embedding": embedding_data['embedding'],
                        "language": embedding_data['language'],
                        "created_at": current_time
                    }
                }
                actions.append(doc)
            
            # Bulk insert
            if actions:
                bulk(es_client, actions)
                logger.info(f"Stored {len(actions)} embeddings in Elasticsearch index: {index_name}")
            
        except Exception as e:
            logger.error(f"Error storing embeddings in Elasticsearch: {e}")
            raise

pdf_processor = PDFProcessor()

@app.post("/upload-pdf", response_model=PDFProcessResponse)
async def upload_pdf(file: UploadFile = File(...)):
    """Upload and process PDF file."""
    
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    try:
        # Save uploaded file
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        logger.info(f"Uploaded file saved: {file_path}")
        
        # Convert PDF to document using Docling
        result = doc_converter.convert(str(file_path))
        
        # Extract and clean text
        raw_text = result.document.text if hasattr(result.document, 'text') else ""
        if raw_text:
            result.document.text = pdf_processor.clean_text(raw_text)
        
        # Save as markdown (without images)
        doc_filename = Path(file.filename).stem
        md_filename = PARSED_DIR / f"{doc_filename}-parsed.md"
        
        result.document.save_as_markdown(md_filename, image_mode=ImageRefMode.REFERENCED)
        
        # Read and clean markdown content
        with open(md_filename, 'r', encoding='utf-8') as f:
            markdown_content = f.read()
        
        # Remove base64 images and clean text
        markdown_content = pdf_processor.remove_base64_images(markdown_content)
        markdown_content = pdf_processor.clean_text(markdown_content)
        
        # Save cleaned markdown
        with open(md_filename, 'w', encoding='utf-8') as f:
            f.write(markdown_content)
        
        logger.info(f"Cleaned markdown saved to: {md_filename}")
        
        # Create custom chunks from markdown content
        text_chunks = pdf_processor.chunk_text_custom(markdown_content, max_length=400)
        logger.info(f"Generated {len(text_chunks)} chunks from document")
        
        # Extract scheme name using chunks
        scheme_name = pdf_processor.extract_scheme_name(text_chunks)
        
        if not scheme_name:
            logger.warning("No scheme name found in the document")
            scheme_name = "Unknown Scheme"
        
        # Create embeddings
        embeddings_data = pdf_processor.create_embeddings(text_chunks)
        logger.info(f"Created {len(embeddings_data)} embeddings")
        
        # Store in MongoDB
        current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y')
        
        document = {
            "pdf_filename": file.filename,
            "markdown_content": markdown_content,
            "scheme_name": scheme_name,
            "created_at": current_time,
            "updated_at": current_time,
            "chunks_count": len(text_chunks)
        }
        
        # Check for existing document and update or insert
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
        
        # Store embeddings in Elasticsearch
        pdf_processor.store_embeddings_in_elasticsearch(embeddings_data, document_id, scheme_name)
        
        # Clean up uploaded file
        os.remove(file_path)
        
        return PDFProcessResponse(
            success=True,
            message="PDF processed successfully",
            scheme_name=scheme_name,
            document_id=document_id,
            chunks_processed=len(text_chunks)
        )
        
    except Exception as e:
        logger.error(f"Error processing PDF: {e}")
        # Clean up files on error
        if file_path.exists():
            os.remove(file_path)
        
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@app.post("/submit-post")
async def submit_post(post: PostRequest):
    """Submit a new post for admin approval."""
    
    try:
        current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y %I:%M %p')
        
        post_document = {
            "title": post.title,
            "description": post.description,
            "schemeName": post.scheme_name,
            "status": "pending",  # pending, approved, rejected
            "created_at": current_time,
            "updated_at": current_time
        }
        
        result = posts_collection.insert_one(post_document)
        
        logger.info(f"Post submitted with ID: {result.inserted_id}")
        
        return {
            "success": True,
            "message": "Post submitted for admin approval",
            "post_id": str(result.inserted_id)
        }
        
    except Exception as e:
        logger.error(f"Error submitting post: {e}")
        raise HTTPException(status_code=500, detail=f"Error submitting post: {str(e)}")

@app.get("/pending-posts")
async def get_pending_posts():
    """Get all pending posts for admin approval."""
    
    try:
        pending_posts = list(posts_collection.find(
            {"status": "pending"},
            {"title": 1, "description": 1, "schemeName": 1, "created_at": 1}
        ))
        
        # Convert ObjectId to string
        for post in pending_posts:
            post["_id"] = str(post["_id"])
        
        return {
            "success": True,
            "posts": pending_posts
        }
        
    except Exception as e:
        logger.error(f"Error fetching pending posts: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching pending posts: {str(e)}")

@app.post("/approve-post")
async def approve_post(approval: PostApproval):
    """Approve or reject a post."""
    
    try:
        from bson import ObjectId
        
        current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y %I:%M %p')
        
        # Update post status
        result = posts_collection.update_one(
            {"_id": ObjectId(approval.post_id)},
            {"$set": {"status": approval.status, "updated_at": current_time}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Post not found")
        
        # If approved, update markdown content
        if approval.status == "approved":
            post = posts_collection.find_one({"_id": ObjectId(approval.post_id)})
            await update_markdown_with_posts(post["schemeName"])
        
        logger.info(f"Post {approval.post_id} {approval.status}")
        
        return {
            "success": True,
            "message": f"Post {approval.status} successfully"
        }
        
    except Exception as e:
        logger.error(f"Error approving post: {e}")
        raise HTTPException(status_code=500, detail=f"Error approving post: {str(e)}")

async def update_markdown_with_posts(scheme_name: str):
    """Update markdown content with approved posts."""
    
    try:
        # Find the markdown document
        markdown_doc = markdown_collection.find_one({"scheme_name": scheme_name})
        
        if not markdown_doc:
            logger.warning(f"No markdown document found for scheme: {scheme_name}")
            return
        
        # Get approved posts for this scheme
        approved_posts = list(posts_collection.find(
            {"schemeName": scheme_name, "status": "approved"},
            {"title": 1, "description": 1, "schemeName": 1, "created_at": 1}
        ))
        
        if not approved_posts:
            logger.info(f"No approved posts found for scheme: {scheme_name}")
            return
        
        # Build post content
        post_content = ""
        for post in approved_posts:
            post_text = f"""

## User Post: {post['title']}

**Scheme Name:** {post['schemeName']}

**Description:** {post['description']}

**Posted on:** {post['created_at']}

---
"""
            post_content += post_text
        
        # Update markdown content
        updated_content = markdown_doc["markdown_content"] + post_content
        current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y')
        
        markdown_collection.update_one(
            {"_id": markdown_doc["_id"]},
            {"$set": {
                "markdown_content": updated_content,
                "updated_at": current_time
            }}
        )
        
        logger.info(f"Updated markdown with {len(approved_posts)} posts for scheme: {scheme_name}")
        
    except Exception as e:
        logger.error(f"Error updating markdown with posts: {e}")

@app.get("/search-chunks")
async def search_chunks(query: str, scheme_name: str = None, k: int = 2):
    """Search for similar chunks using vector embeddings."""
    
    try:
        # Create query embedding with query prefix for multilingual-e5-base
        query_embedding = embedding_model.encode(
            f"query: {query}", 
            normalize_embeddings=True
        ).tolist()
        
        # Build Elasticsearch KNN search query
        search_body = {
            "knn": {
                "field": "embedding",
                "query_vector": query_embedding,
                "k": k,
                "num_candidates": 10
            }
        }
        
        # Add scheme filter if provided
        if scheme_name:
            search_body["query"] = {
                "match": {"scheme_name": scheme_name}
            }
        
        # Execute search
        response = es_client.search(index="markdown_vectors", body=search_body)
        
        # Format results
        results = []
        for hit in response['hits']['hits']:
            source = hit['_source']
            results.append({
                "text": source['text'][:200] + "..." if len(source['text']) > 200 else source['text'],
                "full_text": source['text'],
                "scheme_name": source['scheme_name'],
                "score": hit['_score'],
                "chunk_id": source['chunk_id'],
                #"language": source['language']
            })
        
        return {
            "success": True,
            "query": query,
            "results_count": len(results),
            "results": results
        }
        
    except Exception as e:
        logger.error(f"Error searching chunks: {e}")
        raise HTTPException(status_code=500, detail=f"Error searching chunks: {str(e)}")

@app.get("/schemes")
async def get_all_schemes():
    """Get all processed schemes."""
    
    try:
        schemes = list(markdown_collection.find(
            {},
            {"scheme_name": 1, "created_at": 1, "updated_at": 1, "chunks_count": 1}
        ))
        
        # Convert ObjectId to string
        for scheme in schemes:
            scheme["_id"] = str(scheme["_id"])
        
        return {
            "success": True,
            "schemes": schemes
        }
        
    except Exception as e:
        logger.error(f"Error fetching schemes: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching schemes: {str(e)}")

@app.get("/scheme/{scheme_name}")
async def get_scheme_details(scheme_name: str):
    """Get detailed information about a specific scheme."""
    
    try:
        scheme = markdown_collection.find_one({"scheme_name": scheme_name})
        
        if not scheme:
            raise HTTPException(status_code=404, detail="Scheme not found")
        
        # Convert ObjectId to string
        scheme["_id"] = str(scheme["_id"])
        
        # Get related posts
        posts = list(posts_collection.find(
            {"schemeName": scheme_name, "status": "approved"},
            {"title": 1, "description": 1, "created_at": 1}
        ))
        
        for post in posts:
            post["_id"] = str(post["_id"])
        
        return {
            "success": True,
            "scheme": scheme,
            "related_posts": posts
        }
        
    except Exception as e:
        logger.error(f"Error fetching scheme details: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching scheme details: {str(e)}")

@app.get("/test-search")
async def test_search():
    """Test search functionality with predefined queries."""
    
    test_queries = [
        "What is the Sukanya Samriddhi Account Scheme?",
        "Who can open a Sukanya Samriddhi account?",
        "What is the interest rate for Sukanya Samriddhi account?",
        "How to withdraw money from Sukanya Samriddhi account?",
        "सुकन्या समृद्धि खाते की ब्याज दर क्या है?",
        "सुकन्या समृद्धि खाता कब बंद किया जा सकता है?"
    ]
    
    results = {}
    
    for query in test_queries:
        try:
            search_result = await search_chunks(query, k=2)
            results[query] = search_result
        except Exception as e:
            results[query] = {"error": str(e)}
    
    return {
        "success": True,
        "test_results": results
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    
    try:
        # Test MongoDB connection
        mongo_status = "connected" if mongo_client.admin.command('ping') else "disconnected"
        
        # Test Elasticsearch connection
        es_status = "connected" if es_client.ping() else "disconnected"
        
        return {
            "status": "healthy",
            "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y %I:%M %p'),
            "services": {
                "mongodb": mongo_status,
                "elasticsearch": es_status,
                "gemini": "configured"
            }
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y %I:%M %p')
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)