# import logging
# import os
# import re
# import base64
# from pathlib import Path
# from datetime import datetime
# from typing import List, Optional, Dict, Any
# import pytz
# import numpy as np
# from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Depends
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from docling.document_converter import DocumentConverter, PdfFormatOption
# from docling.datamodel.base_models import InputFormat
# from docling.datamodel.pipeline_options import PdfPipelineOptions, TesseractOcrOptions
# from docling.chunking import HybridChunker
# from docling_core.types.doc import ImageRefMode
# import google.generativeai as genai
# from sentence_transformers import SentenceTransformer
# from pymongo import MongoClient
# from pymongo.errors import ConnectionFailure
# from elasticsearch import Elasticsearch
# from elasticsearch.helpers import bulk
# import uvicorn

# # Configure logging
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)


GEMINI_API_KEY=''
MONGO_URI = ''
HUGGING_FACE_TOKEN = ''
EMBEDDING_MODEL_NAME = ''
UPLOAD_DIR = Path("./uploads")
PARSED_DIR = Path("./parsed_docs")
ELASTICSEARCH_URL = ''
ELASTICSEARCH_API_KEY =''
mongo_uri ='mongodb://127.0.0.1:27017/pdf_ingestion_system'



# # embedding_model = SentenceTransformer(
# #     EMBEDDING_MODEL_NAME= 'intfloat/multilingual-e5-base',
# #     token='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'
# # )

# # Create directories
# UPLOAD_DIR.mkdir(exist_ok=True)
# PARSED_DIR.mkdir(exist_ok=True)

# # Initialize FastAPI app
# app = FastAPI(title="RAG Chatbot Backend", description="RAG-based chatbot with PDF processing and vector search")

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Initialize clients and models
# try:
#     # MongoDB connection
#     mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
#     db = mongo_client['pdf_ingestion_system']
#     markdown_collection = db['markdown_files']
#     posts_collection = db['posts']
#     chats_collection = db['chats']
    
#     # Elasticsearch connection
#     # es_client = Elasticsearch(
#     #     ELASTICSEARCH_URL,
#     #     api_key=ELASTICSEARCH_API_KEY
#     # )
    
#     es_client = Elasticsearch(
#     ELASTICSEARCH_URL,
#     verify_certs=False,  # Disable for local development if no SSL
#     request_timeout=30
#     )

#     # Gemini AI configuration
#     genai.configure(api_key=GEMINI_API_KEY)
#     gemini_model = genai.GenerativeModel('gemini-2.0-flash-001')
    
#     # Sentence transformer for embeddings
#     embedding_model = SentenceTransformer(
#         EMBEDDING_MODEL_NAME,
#         token=HUGGING_FACE_TOKEN
#     )
    
#     logger.info("All clients initialized successfully")
# except Exception as e:
#     logger.error(f"Failed to initialize clients: {e}")
#     raise

# # Pydantic models
# class PostRequest(BaseModel):
#     title: str
#     description: str
#     scheme_name: str

# class PostApproval(BaseModel):
#     post_id: str
#     status: str

# class QueryRequest(BaseModel):
#     query: str
#     language_code: Optional[str] = 'en-IN'

# class RAGResponse(BaseModel):
#     success: bool
#     message: str
#     scheme_name: Optional[str] = None
#     response: Optional[str] = None
#     retrieved_chunks: Optional[List[Dict]] = None

# class PDFProcessResponse(BaseModel):
#     success: bool
#     message: str
#     scheme_name: Optional[str] = None
#     document_id: Optional[str] = None
#     chunks_processed: Optional[int] = None

# # Document converter setup
# pipeline_options = PdfPipelineOptions(
#     do_table_structure=True,
#     do_ocr=True,
#     ocr_options=TesseractOcrOptions(lang=["eng", "hin"]),
#     generate_page_images=False,
#     generate_picture_images=False,
#     images_scale=1.0,
# )

# doc_converter = DocumentConverter(
#     format_options={
#         InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
#     }
# )

# class PDFProcessor:
#     def __init__(self):
#         self.chunker = HybridChunker(max_chunk_size=1000, min_chunk_size=200)
    
#     def clean_text(self, text: str) -> str:
#         unicode_map = {
#             'uni092F': 'य', 'uni093F': 'ि', 'uni092Fा': 'या', 'uni093F/g7021': '',
#             'uni0927': 'ध',
#         }
#         text = re.sub(r'/g\d{4}', '', text)
#         for code, char in unicode_map.items():
#             text = text.replace(f'/{code}', char)
#         text = re.sub(r'/uni[0-9A-Fa-f]{4}', '', text)
#         text = re.sub(r'\s+', ' ', text).strip()
#         return text
    
#     def remove_base64_images(self, markdown_content: str) -> str:
#         base64_pattern = r'!\[.*?\]\(data:image/[^;]+;base64,[^)]+\)'
#         return re.sub(base64_pattern, '[Image removed]', markdown_content)
    
#     def chunk_text_custom(self, text: str, max_length: int = 400) -> List[str]:
#         words = text.split()
#         chunks = []
#         current_chunk = []
#         current_length = 0
#         for word in words:
#             current_length += len(word) + 1
#             if current_length > max_length:
#                 if current_chunk:
#                     chunks.append(' '.join(current_chunk))
#                 current_chunk = [word]
#                 current_length = len(word) + 1
#             else:
#                 current_chunk.append(word)
#         if current_chunk:
#             chunks.append(' '.join(current_chunk))
#         return chunks
    
#     def extract_scheme_name(self, chunks: List[str]) -> Optional[str]:
#         example_schemes = [
#             "Sukanya Samriddhi Account Scheme",
#             "Pradhan Mantri Awas Yojana",
#             "Ayushman Bharat",
#             "Pradhan Mantri Kisan Samman Nidhi",
#             "Atal Pension Yojana",
#             "National Pension System",
#             "सुकन्या समृद्धि खाता योजना",
#             "प्रधानमंत्री आवास योजना"
#         ]
#         prompt_template = """
#         You are given a chunk of text from a user query or document that may contain text in English or Hindi. 
#         Your task is to identify and extract the exact name of the scheme mentioned in the text. 
#         The scheme name is a proper noun or specific title, such as one of the following examples:
#         {examples}
        
#         If no scheme name is found, return "null". 
#         Provide only the scheme name as a string, or "null" if not found.

#         Chunk:
#         {chunk}

#         Output only the scheme name or null:
#         """
#         for chunk in chunks:
#             chunk_text = self.clean_text(chunk)
#             prompt = prompt_template.format(chunk=chunk_text, examples="\n- " + "\n- ".join(example_schemes))
#             try:
#                 response = gemini_model.generate_content(prompt)
#                 scheme_name = response.text.strip()
#                 if scheme_name and scheme_name.lower() != 'null':
#                     logger.info(f"Found scheme name: {scheme_name}")
#                     return scheme_name
#             except Exception as e:
#                 logger.error(f"Error processing chunk with Gemini API: {e}")
#                 continue
#         return None
    
#     def create_embeddings(self, chunks: List[str]) -> List[Dict]:
#         embeddings_data = []
#         for i, chunk_text in enumerate(chunks):
#             chunk_text = self.clean_text(chunk_text)
#             if not chunk_text.strip():
#                 continue
#             try:
#                 embedding = embedding_model.encode(
#                     f"passage: {chunk_text}", 
#                     normalize_embeddings=True
#                 ).tolist()
#                 language = "english" if all(ord(c) < 128 for c in chunk_text) else "multilingual"
#                 embeddings_data.append({
#                     'chunk_id': i,
#                     'text': chunk_text,
#                     'embedding': embedding,
#                     'language': language
#                 })
#             except Exception as e:
#                 logger.error(f"Error creating embedding for chunk {i}: {e}")
#                 continue
#         return embeddings_data
    
#     def ensure_elasticsearch_index(self):
#         index_name = "markdown_vectors"
#         try:
#             if es_client.indices.exists(index=index_name):
#                 logger.info(f"Index {index_name} already exists")
#                 return
#             mapping = {
#                 "mappings": {
#                     "properties": {
#                         "document_id": {"type": "keyword"},
#                         "scheme_name": {"type": "text"},
#                         "chunk_id": {"type": "integer"},
#                         "text": {"type": "text"},
#                         "embedding": {
#                             "type": "dense_vector",
#                             "dims": 768,
#                             "index": True,
#                             "similarity": "cosine"
#                         },
#                         "language": {"type": "keyword"},
#                         "created_at": {"type": "date"}
#                     }
#                 }
#             }
#             es_client.indices.create(index=index_name, body=mapping)
#             logger.info(f"Created Elasticsearch index: {index_name}")
#         except Exception as e:
#             logger.error(f"Error creating Elasticsearch index: {e}")
#             raise
    
#     def store_embeddings_in_elasticsearch(self, embeddings_data: List[Dict], document_id: str, scheme_name: str):
#         try:
#             self.ensure_elasticsearch_index()
#             index_name = "markdown_vectors"
#             current_time = datetime.now(pytz.timezone('Asia/Kolkata'))
#             actions = [
#                 {
#                     "_index": index_name,
#                     "_id": f"{document_id}_{embedding_data['chunk_id']}",
#                     "_source": {
#                         "document_id": document_id,
#                         "scheme_name": scheme_name,
#                         "chunk_id": embedding_data['chunk_id'],
#                         "text": embedding_data['text'],
#                         "embedding": embedding_data['embedding'],
#                         "language": embedding_data['language'],
#                         "created_at": current_time
#                     }
#                 }
#                 for embedding_data in embeddings_data
#             ]
#             if actions:
#                 bulk(es_client, actions)
#                 logger.info(f"Stored {len(actions)} embeddings in Elasticsearch")
#         except Exception as e:
#             logger.error(f"Error storing embeddings in Elasticsearch: {e}")
#             raise

# pdf_processor = PDFProcessor()

# @app.post("/upload-pdf", response_model=PDFProcessResponse)
# async def upload_pdf(file: UploadFile = File(...)):
#     if not file.filename.endswith('.pdf'):
#         raise HTTPException(status_code=400, detail="Only PDF files are allowed")
#     try:
#         file_path = UPLOAD_DIR / file.filename
#         with open(file_path, "wb") as buffer:
#             content = await file.read()
#             buffer.write(content)
#         logger.info(f"Uploaded file saved: {file_path}")
#         result = doc_converter.convert(str(file_path))
#         raw_text = result.document.text if hasattr(result.document, 'text') else ""
#         if raw_text:
#             result.document.text = pdf_processor.clean_text(raw_text)
#         doc_filename = Path(file.filename).stem
#         md_filename = PARSED_DIR / f"{doc_filename}-parsed.md"
#         result.document.save_as_markdown(md_filename, image_mode=ImageRefMode.REFERENCED)
#         with open(md_filename, 'r', encoding='utf-8') as f:
#             markdown_content = f.read()
#         markdown_content = pdf_processor.remove_base64_images(markdown_content)
#         markdown_content = pdf_processor.clean_text(markdown_content)
#         with open(md_filename, 'w', encoding='utf-8') as f:
#             f.write(markdown_content)
#         logger.info(f"Cleaned markdown saved to: {md_filename}")
#         text_chunks = pdf_processor.chunk_text_custom(markdown_content, max_length=400)
#         logger.info(f"Generated {len(text_chunks)} chunks from document")
#         scheme_name = pdf_processor.extract_scheme_name(text_chunks)
#         if not scheme_name:
#             logger.warning("No scheme name found in the document")
#             scheme_name = "Unknown Scheme"
#         embeddings_data = pdf_processor.create_embeddings(text_chunks)
#         logger.info(f"Created {len(embeddings_data)} embeddings")
#         current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y')
#         document = {
#             "pdf_filename": file.filename,
#             "markdown_content": markdown_content,
#             "scheme_name": scheme_name,
#             "created_at": current_time,
#             "updated_at": current_time,
#             "chunks_count": len(text_chunks)
#         }
#         existing_doc = markdown_collection.find_one({"scheme_name": scheme_name})
#         if existing_doc:
#             document_id = str(existing_doc["_id"])
#             markdown_collection.update_one(
#                 {"_id": existing_doc["_id"]},
#                 {"$set": {
#                     "markdown_content": document["markdown_content"],
#                     "pdf_filename": document["pdf_filename"],
#                     "updated_at": current_time,
#                     "chunks_count": len(text_chunks)
#                 }}
#             )
#             logger.info(f"Updated existing document with ID: {document_id}")
#         else:
#             result_id = markdown_collection.insert_one(document).inserted_id
#             document_id = str(result_id)
#             logger.info(f"Stored new document with ID: {document_id}")
#         pdf_processor.store_embeddings_in_elasticsearch(embeddings_data, document_id, scheme_name)
#         os.remove(file_path)
#         return PDFProcessResponse(
#             success=True,
#             message="PDF processed successfully",
#             scheme_name=scheme_name,
#             document_id=document_id,
#             chunks_processed=len(text_chunks)
#         )
#     except Exception as e:
#         logger.error(f"Error processing PDF: {e}")
#         if file_path.exists():
#             os.remove(file_path)
#         raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

# @app.post("/submit-post")
# async def submit_post(post: PostRequest):
#     try:
#         current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y %I:%M %p')
#         post_document = {
#             "title": post.title,
#             "description": post.description,
#             "schemeName": post.scheme_name,
#             "status": "pending",
#             "created_at": current_time,
#             "updated_at": current_time
#         }
#         result = posts_collection.insert_one(post_document)
#         logger.info(f"Post submitted with ID: {result.inserted_id}")
#         return {
#             "success": True,
#             "message": "Post submitted for admin approval",
#             "post_id": str(result.inserted_id)
#         }
#     except Exception as e:
#         logger.error(f"Error submitting post: {e}")
#         raise HTTPException(status_code=500, detail=f"Error submitting post: {str(e)}")

# @app.get("/pending-posts")
# async def get_pending_posts():
#     try:
#         pending_posts = list(posts_collection.find(
#             {"status": "pending"},
#             {"title": 1, "description": 1, "schemeName": 1, "created_at": 1}
#         ))
#         for post in pending_posts:
#             post["_id"] = str(post["_id"])
#         return {
#             "success": True,
#             "posts": pending_posts
#         }
#     except Exception as e:
#         logger.error(f"Error fetching pending posts: {e}")
#         raise HTTPException(status_code=500, detail=f"Error fetching pending posts: {str(e)}")

# @app.post("/approve-post")
# async def approve_post(approval: PostApproval):
#     try:
#         from bson import ObjectId
#         current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y %I:%M %p')
#         result = posts_collection.update_one(
#             {"_id": ObjectId(approval.post_id)},
#             {"$set": {"status": approval.status, "updated_at": current_time}}
#         )
#         if result.matched_count == 0:
#             raise HTTPException(status_code=404, detail="Post not found")
#         if approval.status == "approved":
#             post = posts_collection.find_one({"_id": ObjectId(approval.post_id)})
#             await update_markdown_with_posts(post["schemeName"])
#         logger.info(f"Post {approval.post_id} {approval.status}")
#         return {
#             "success": True,
#             "message": f"Post {approval.status} successfully"
#         }
#     except Exception as e:
#         logger.error(f"Error approving post: {e}")
#         raise HTTPException(status_code=500, detail=f"Error approving post: {str(e)}")

# async def update_markdown_with_posts(scheme_name: str):
#     try:
#         markdown_doc = markdown_collection.find_one({"scheme_name": scheme_name})
#         if not markdown_doc:
#             logger.warning(f"No markdown document found for scheme: {scheme_name}")
#             return
#         approved_posts = list(posts_collection.find(
#             {"schemeName": scheme_name, "status": "approved"},
#             {"title": 1, "description": 1, "schemeName": 1, "created_at": 1}
#         ))
#         if not approved_posts:
#             logger.info(f"No approved posts found for scheme: {scheme_name}")
#             return
#         post_content = ""
#         for post in approved_posts:
#             post_text = f"""

# ## User Post: {post['title']}

# **Scheme Name:** {post['schemeName']}

# **Description:** {post['description']}

# **Posted on:** {post['created_at']}

# ---
# """
#             post_content += post_text
#         updated_content = markdown_doc["markdown_content"] + post_content
#         current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y')
#         markdown_collection.update_one(
#             {"_id": markdown_doc["_id"]},
#             {"$set": {
#                 "markdown_content": updated_content,
#                 "updated_at": current_time
#             }}
#         )
#         logger.info(f"Updated markdown with {len(approved_posts)} posts for scheme: {scheme_name}")
#     except Exception as e:
#         logger.error(f"Error updating markdown with posts: {e}")

# @app.post("/rag-query", response_model=RAGResponse)
# async def rag_query(query: QueryRequest):
#     try:
#         # Step 1: Extract scheme name from query
#         example_schemes = [
#             "Sukanya Samriddhi Account Scheme",
#             "Pradhan Mantri Awas Yojana",
#             "Ayushman Bharat",
#             "Pradhan Mantri Kisan Samman Nidhi",
#             "Atal Pension Yojana",
#             "National Pension System",
#             "सुकन्या समृद्धि खाता योजना",
#             "प्रधानमंत्री आवास योजना"
#         ]
#         scheme_prompt = """
#         You are given a user query that may contain text in English or Hindi. 
#         Your task is to identify and extract the exact name of the scheme mentioned in the query. 
#         The scheme name is a proper noun or specific title, such as one of the following examples:
#         {examples}
        
#         If no scheme name is found, return "null". 
#         Provide only the scheme name as a string, or "null" if not found.

#         Query:
#         {query}

#         Output only the scheme name or null:
#         """
#         prompt = scheme_prompt.format(query=query.query, examples="\n- " + "\n- ".join(example_schemes))
#         scheme_name = None
#         try:
#             response = gemini_model.generate_content(prompt)
#             scheme_name = response.text.strip()
#             if scheme_name.lower() == "null":
#                 scheme_name = None
#         except Exception as e:
#             logger.error(f"Error extracting scheme name with Gemini API: {e}")
#             scheme_name = None
        
#         if not scheme_name:
#             logger.warning(f"No scheme name found for query: {query.query}")
#             return RAGResponse(
#                 success=False,
#                 message="Please specify the scheme name.",
#                 scheme_name=None,
#                 response=None,
#                 retrieved_chunks=[]
#             )
        
#         # Step 2: Convert query to vector embedding
#         query_embedding = embedding_model.encode(
#             f"query: {query.query}", 
#             normalize_embeddings=True
#         ).tolist()
        
#         # Step 3: Search Elasticsearch for relevant chunks
#         search_body = {
#             "knn": {
#                 "field": "embedding",
#                 "query_vector": query_embedding,
#                 "k": 5,
#                 "num_candidates": 20
#             },
#             "query": {
#                 "match": {"scheme_name": scheme_name}
#             }
#         }
#         response = es_client.search(index="markdown_vectors", body=search_body)
#         retrieved_chunks = [
#             {
#                 "text": hit['_source']['text'],
#                 "chunk_id": hit['_source']['chunk_id'],
#                 "score": hit['_score']
#             }
#             for hit in response['hits']['hits']
#         ]
        
#         # Step 4: Generate response using retrieved chunks
#         context = "\n\n".join([chunk['text'] for chunk in retrieved_chunks])
#         response_prompt = """
#         You are a helpful chatbot answering questions about government schemes based on the provided context. 
#         Use the following context to answer the user's query accurately and concisely. 
#         If the context does not contain enough information to answer the query, provide a general response and suggest clarifying the query.
        
#         Context:
#         {context}
        
#         Query:
#         {query}
        
#         Answer in a clear and concise manner, using the language of the query ({language}) if possible:
#         """
#         response_text = "No relevant information found. Please clarify your query or specify the correct scheme."
#         try:
#             prompt = response_prompt.format(
#                 context=context,
#                 query=query.query,
#                 language=query.language_code
#             )
#             response = gemini_model.generate_content(prompt)
#             response_text = response.text.strip()
#         except Exception as e:
#             logger.error(f"Error generating response with Gemini API: {e}")
        
#         return RAGResponse(
#             success=True,
#             message="Query processed successfully",
#             scheme_name=scheme_name,
#             response=response_text,
#             retrieved_chunks=retrieved_chunks
#         )
#     except Exception as e:
#         logger.error(f"Error processing RAG query: {e}")
#         raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

# @app.get("/schemes")
# async def get_all_schemes():
#     try:
#         schemes = list(markdown_collection.find(
#             {},
#             {"scheme_name": 1, "created_at": 1, "updated_at": 1, "chunks_count": 1}
#         ))
#         for scheme in schemes:
#             scheme["_id"] = str(scheme["_id"])
#         return {
#             "success": True,
#             "schemes": schemes
#         }
#     except Exception as e:
#         logger.error(f"Error fetching schemes: {e}")
#         raise HTTPException(status_code=500, detail=f"Error fetching schemes: {str(e)}")

# @app.get("/scheme/{scheme_name}")
# async def get_scheme_details(scheme_name: str):
#     try:
#         scheme = markdown_collection.find_one({"scheme_name": scheme_name})
#         if not scheme:
#             raise HTTPException(status_code=404, detail="Scheme not found")
#         scheme["_id"] = str(scheme["_id"])
#         posts = list(posts_collection.find(
#             {"schemeName": scheme_name, "status": "approved"},
#             {"title": 1, "description": 1, "created_at": 1}
#         ))
#         for post in posts:
#             post["_id"] = str(post["_id"])
#         return {
#             "success": True,
#             "scheme": scheme,
#             "related_posts": posts
#         }
#     except Exception as e:
#         logger.error(f"Error fetching scheme details: {e}")
#         raise HTTPException(status_code=500, detail=f"Error fetching scheme details: {str(e)}")

# @app.get("/health")
# async def health_check():
#     try:
#         mongo_status = "connected" if mongo_client.admin.command('ping') else "disconnected"
#         es_status = "connected" if es_client.ping() else "disconnected"
#         return {
#             "status": "healthy",
#             "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y %I:%M %p'),
#             "services": {
#                 "mongodb": mongo_status,
#                 "elasticsearch": es_status,
#                 "gemini": "configured"
#             }
#         }
#     except Exception as e:
#         return {
#             "status": "unhealthy",
#             "error": str(e),
#             "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y %I:%M %p')
#         }

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)



# import logging
# import os
# import re
# import base64
# from pathlib import Path
# from datetime import datetime
# from typing import List, Optional, Dict, Any
# import pytz
# import numpy as np
# from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Depends
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from docling.document_converter import DocumentConverter, PdfFormatOption
# from docling.datamodel.base_models import InputFormat
# from docling.datamodel.pipeline_options import PdfPipelineOptions, TesseractOcrOptions
# from docling.chunking import HybridChunker
# from docling_core.types.doc import ImageRefMode
# import google.generativeai as genai
# from sentence_transformers import SentenceTransformer
# from pymongo import MongoClient
# from pymongo.errors import ConnectionFailure
# from elasticsearch import Elasticsearch
# from elasticsearch.helpers import bulk
# import uvicorn

# # Configure logging
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)

# # Configuration
# GEMINI_API_KEY = "AIzaSyDy780rpCWpDX7NKz9oInrjr59dxY0iymE"
# MONGO_URI = "mongodb://127.0.0.1:27017/"
# HUGGING_FACE_TOKEN = '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'
# EMBEDDING_MODEL_NAME = 'intfloat/multilingual-e5-base'
# UPLOAD_DIR = Path("./uploads")
# PARSED_DIR = Path("./parsed_docs")
# ELASTICSEARCH_URL = "https://my-elasticsearch-project-cff6bd.es.us-central1.gcp.elastic.cloud:443"
# ELASTICSEARCH_API_KEY = "aGdhV3JaZ0JhSEJ0RWhfNnRpQlI6SElfcDQ2dkYwbVgxaW5lSzRGN0Nydw=="
# mongo_uri = 'mongodb+srv://kavyakapoor413:Helloworld@cluster01.4zpagwq.mongodb.net/KavyaGPT?retryWrites=true&w=majority&appName=Cluster01'

# # Create directories
# UPLOAD_DIR.mkdir(exist_ok=True)
# PARSED_DIR.mkdir(exist_ok=True)

# # Initialize FastAPI app
# app = FastAPI(title="RAG Chatbot Backend", description="RAG-based chatbot with PDF processing and vector search")

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Initialize clients and models
# try:
#     # MongoDB connection
#     mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
#     db = mongo_client['pdf_ingestion_system']
#     markdown_collection = db['markdown_files']
#     posts_collection = db['posts']
#     chats_collection = db['chats']
    
#     # Elasticsearch connection with API key
#     es_client = Elasticsearch(
#         [ELASTICSEARCH_URL],
#         api_key=ELASTICSEARCH_API_KEY,
#         verify_certs=False,  # Insecure for development; enable in production
#         request_timeout=30,
#         max_retries=3,
#         retry_on_timeout=True
#     )
    
#     # Test Elasticsearch connection and get version
#     es_info = es_client.info()
#     es_version = es_info['version']['number']
#     logger.info(f"Connected to Elasticsearch version: {es_version}")

#     # Gemini AI configuration
#     genai.configure(api_key=GEMINI_API_KEY)
#     gemini_model = genai.GenerativeModel('gemini-2.0-flash-001')
    
#     # Sentence transformer for embeddings
#     embedding_model = SentenceTransformer(
#         EMBEDDING_MODEL_NAME,
#         token=HUGGING_FACE_TOKEN
#     )
    
#     logger.info("All clients initialized successfully")
# except Exception as e:
#     logger.error(f"Failed to initialize clients: {e}")
#     raise

# # Pydantic models
# class PostRequest(BaseModel):
#     title: str
#     description: str
#     scheme_name: str

# class PostApproval(BaseModel):
#     post_id: str
#     status: str

# class QueryRequest(BaseModel):
#     query: str
#     language_code: Optional[str] = 'en-IN'

# class RAGResponse(BaseModel):
#     success: bool
#     message: str
#     scheme_name: Optional[str] = None
#     response: Optional[str] = None
#     retrieved_chunks: Optional[List[Dict]] = None

# class PDFProcessResponse(BaseModel):
#     success: bool
#     message: str
#     scheme_name: Optional[str] = None
#     document_id: Optional[str] = None
#     chunks_processed: Optional[int] = None

# # Document converter setup
# pipeline_options = PdfPipelineOptions(
#     do_table_structure=True,
#     do_ocr=True,
#     ocr_options=TesseractOcrOptions(lang=["eng", "hin"]),
#     generate_page_images=False,
#     generate_picture_images=False,
#     images_scale=1.0,
# )

# doc_converter = DocumentConverter(
#     format_options={
#         InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
#     }
# )

# class PDFProcessor:
#     def __init__(self):
#         self.chunker = HybridChunker(max_chunk_size=1000, min_chunk_size=200)
    
#     def clean_text(self, text: str) -> str:
#         unicode_map = {
#             'uni092F': 'य', 'uni093F': 'ि', 'uni092Fा': 'या', 'uni093F/g7021': '',
#             'uni0927': 'ध',
#         }
#         text = re.sub(r'/g\d{4}', '', text)
#         for code, char in unicode_map.items():
#             text = text.replace(f'/{code}', char)
#         text = re.sub(r'/uni[0-9A-Fa-f]{4}', '', text)
#         text = re.sub(r'\s+', ' ', text).strip()
#         return text
    
#     def remove_base64_images(self, markdown_content: str) -> str:
#         base64_pattern = r'!\[.*?\]\(data:image/[^;]+;base64,[^)]+\)'
#         return re.sub(base64_pattern, '[Image removed]', markdown_content)
    
#     def chunk_text_custom(self, text: str, max_length: int = 400) -> List[str]:
#         words = text.split()
#         chunks = []
#         current_chunk = []
#         current_length = 0
#         for word in words:
#             current_length += len(word) + 1
#             if current_length > max_length:
#                 if current_chunk:
#                     chunks.append(' '.join(current_chunk))
#                 current_chunk = [word]
#                 current_length = len(word) + 1
#             else:
#                 current_chunk.append(word)
#         if current_chunk:
#             chunks.append(' '.join(current_chunk))
#         return chunks
    
#     def extract_scheme_name(self, chunks: List[str]) -> Optional[str]:
#         example_schemes = [
#             "Sukanya Samriddhi Account Scheme",
#             "Pradhan Mantri Awas Yojana",
#             "Ayushman Bharat",
#             "Pradhan Mantri Kisan Samman Nidhi",
#             "Atal Pension Yojana",
#             "National Pension System",
#             "सुकन्या समृद्धि खाता योजना",
#             "प्रधानमंत्री आवास योजना"
#         ]
#         prompt_template = """
#         You are given a chunk of text from a user query or document that may contain text in English or Hindi. 
#         Your task is to identify and extract the exact name of the scheme mentioned in the text. 
#         The scheme name is a proper noun or specific title, such as one of the following examples:
#         {examples}
        
#         If no scheme name is found, return "null". 
#         Provide only the scheme name as a string, or "null" if not found.

#         Chunk:
#         {chunk}

#         Output only the scheme name or null:
#         """
#         for chunk in chunks:
#             chunk_text = self.clean_text(chunk)
#             prompt = prompt_template.format(chunk=chunk_text, examples="\n- " + "\n- ".join(example_schemes))
#             try:
#                 response = gemini_model.generate_content(prompt)
#                 scheme_name = response.text.strip()
#                 if scheme_name and scheme_name.lower() != 'null':
#                     logger.info(f"Found scheme name: {scheme_name}")
#                     return scheme_name
#             except Exception as e:
#                 logger.error(f"Error processing chunk with Gemini API: {e}")
#                 continue
#         return None
    
#     def create_embeddings(self, chunks: List[str]) -> List[Dict]:
#         embeddings_data = []
#         for i, chunk_text in enumerate(chunks):
#             chunk_text = self.clean_text(chunk_text)
#             if not chunk_text.strip():
#                 continue
#             try:
#                 embedding = embedding_model.encode(
#                     f"passage: {chunk_text}", 
#                     normalize_embeddings=True
#                 ).tolist()
#                 language = "english" if all(ord(c) < 128 for c in chunk_text) else "multilingual"
#                 embeddings_data.append({
#                     'chunk_id': i,
#                     'text': chunk_text,
#                     'embedding': embedding,
#                     'language': language
#                 })
#             except Exception as e:
#                 logger.error(f"Error creating embedding for chunk {i}: {e}")
#                 continue
#         return embeddings_data
    
#     def ensure_elasticsearch_index(self):
#         index_name = "haqdarshak"
#         try:
#             if es_client.indices.exists(index=index_name):
#                 logger.info(f"Index {index_name} already exists")
#                 return
                
#             # Updated mapping for better compatibility
#             mapping = {
#                 "mappings": {
#                     "properties": {
#                         "document_id": {"type": "keyword"},
#                         "scheme_name": {"type": "text"},
#                         "chunk_id": {"type": "integer"},
#                         "text": {"type": "text"},
#                         "embedding": {
#                             "type": "dense_vector",
#                             "dims": 768
#                         },
#                         "language": {"type": "keyword"},
#                         "created_at": {"type": "date"}
#                     }
#                 }
#             }
#             es_client.indices.create(index=index_name, body=mapping)
#             logger.info(f"Created Elasticsearch index: {index_name}")
#         except Exception as e:
#             logger.error(f"Error creating Elasticsearch index: {e}")
#             raise
    
#     def store_embeddings_in_elasticsearch(self, embeddings_data: List[Dict], document_id: str, scheme_name: str):
#         try:
#             self.ensure_elasticsearch_index()
#             index_name = "markdown_vectors"
#             current_time = datetime.now(pytz.timezone('Asia/Kolkata'))
#             actions = [
#                 {
#                     "_index": index_name,
#                     "_id": f"{document_id}_{embedding_data['chunk_id']}",
#                     "_source": {
#                         "document_id": document_id,
#                         "scheme_name": scheme_name,
#                         "chunk_id": embedding_data['chunk_id'],
#                         "text": embedding_data['text'],
#                         "embedding": embedding_data['embedding'],
#                         "language": embedding_data['language'],
#                         "created_at": current_time
#                     }
#                 }
#                 for embedding_data in embeddings_data
#             ]
#             if actions:
#                 bulk(es_client, actions)
#                 logger.info(f"Stored {len(actions)} embeddings in Elasticsearch")
#         except Exception as e:
#             logger.error(f"Error storing embeddings in Elasticsearch: {e}")
#             raise

# pdf_processor = PDFProcessor()

# @app.post("/upload-pdf", response_model=PDFProcessResponse)
# async def upload_pdf(file: UploadFile = File(...)):
#     if not file.filename.endswith('.pdf'):
#         raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
#     file_path = None
#     try:
#         file_path = UPLOAD_DIR / file.filename
#         with open(file_path, "wb") as buffer:
#             content = await file.read()
#             buffer.write(content)
#         logger.info(f"Uploaded file saved: {file_path}")
        
#         result = doc_converter.convert(str(file_path))
#         raw_text = result.document.text if hasattr(result.document, 'text') else ""
#         if raw_text:
#             result.document.text = pdf_processor.clean_text(raw_text)
        
#         doc_filename = Path(file.filename).stem
#         md_filename = PARSED_DIR / f"{doc_filename}-parsed.md"
#         result.document.save_as_markdown(md_filename, image_mode=ImageRefMode.REFERENCED)
        
#         with open(md_filename, 'r', encoding='utf-8') as f:
#             markdown_content = f.read()
        
#         markdown_content = pdf_processor.remove_base64_images(markdown_content)
#         markdown_content = pdf_processor.clean_text(markdown_content)
        
#         with open(md_filename, 'w', encoding='utf-8') as f:
#             f.write(markdown_content)
#         logger.info(f"Cleaned markdown saved to: {md_filename}")
        
#         text_chunks = pdf_processor.chunk_text_custom(markdown_content, max_length=400)
#         logger.info(f"Generated {len(text_chunks)} chunks from document")
        
#         scheme_name = pdf_processor.extract_scheme_name(text_chunks)
#         if not scheme_name:
#             logger.warning("No scheme name found in the document")
#             scheme_name = "Unknown Scheme"
        
#         embeddings_data = pdf_processor.create_embeddings(text_chunks)
#         logger.info(f"Created {len(embeddings_data)} embeddings")
        
#         current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y')
#         document = {
#             "pdf_filename": file.filename,
#             "markdown_content": markdown_content,
#             "scheme_name": scheme_name,
#             "created_at": current_time,
#             "updated_at": current_time,
#             "chunks_count": len(text_chunks)
#         }
        
#         existing_doc = markdown_collection.find_one({"scheme_name": scheme_name})
#         if existing_doc:
#             document_id = str(existing_doc["_id"])
#             markdown_collection.update_one(
#                 {"_id": existing_doc["_id"]},
#                 {"$set": {
#                     "markdown_content": document["markdown_content"],
#                     "pdf_filename": document["pdf_filename"],
#                     "updated_at": current_time,
#                     "chunks_count": len(text_chunks)
#                 }}
#             )
#             logger.info(f"Updated existing document with ID: {document_id}")
#         else:
#             result_id = markdown_collection.insert_one(document).inserted_id
#             document_id = str(result_id)
#             logger.info(f"Stored new document with ID: {document_id}")
        
#         pdf_processor.store_embeddings_in_elasticsearch(embeddings_data, document_id, scheme_name)
        
#         # Clean up uploaded file
#         if file_path and file_path.exists():
#             os.remove(file_path)
        
#         return PDFProcessResponse(
#             success=True,
#             message="PDF processed successfully",
#             scheme_name=scheme_name,
#             document_id=document_id,
#             chunks_processed=len(text_chunks)
#         )
#     except Exception as e:
#         logger.error(f"Error processing PDF: {e}")
#         if file_path and file_path.exists():
#             os.remove(file_path)
#         raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

# @app.post("/submit-post")
# async def submit_post(post: PostRequest):
#     try:
#         current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y %I:%M %p')
#         post_document = {
#             "title": post.title,
#             "description": post.description,
#             "schemeName": post.scheme_name,
#             "status": "pending",
#             "created_at": current_time,
#             "updated_at": current_time
#         }
#         result = posts_collection.insert_one(post_document)
#         logger.info(f"Post submitted with ID: {result.inserted_id}")
#         return {
#             "success": True,
#             "message": "Post submitted for admin approval",
#             "post_id": str(result.inserted_id)
#         }
#     except Exception as e:
#         logger.error(f"Error submitting post: {e}")
#         raise HTTPException(status_code=500, detail=f"Error submitting post: {str(e)}")

# @app.get("/pending-posts")
# async def get_pending_posts():
#     try:
#         pending_posts = list(posts_collection.find(
#             {"status": "pending"},
#             {"title": 1, "description": 1, "schemeName": 1, "created_at": 1}
#         ))
#         for post in pending_posts:
#             post["_id"] = str(post["_id"])
#         return {
#             "success": True,
#             "posts": pending_posts
#         }
#     except Exception as e:
#         logger.error(f"Error fetching pending posts: {e}")
#         raise HTTPException(status_code=500, detail=f"Error fetching pending posts: {str(e)}")

# @app.post("/approve-post")
# async def approve_post(approval: PostApproval):
#     try:
#         from bson import ObjectId
#         current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y %I:%M %p')
#         result = posts_collection.update_one(
#             {"_id": ObjectId(approval.post_id)},
#             {"$set": {"status": approval.status, "updated_at": current_time}}
#         )
#         if result.matched_count == 0:
#             raise HTTPException(status_code=404, detail="Post not found")
#         if approval.status == "approved":
#             post = posts_collection.find_one({"_id": ObjectId(approval.post_id)})
#             await update_markdown_with_posts(post["schemeName"])
#         logger.info(f"Post {approval.post_id} {approval.status}")
#         return {
#             "success": True,
#             "message": f"Post {approval.status} successfully"
#         }
#     except Exception as e:
#         logger.error(f"Error approving post: {e}")
#         raise HTTPException(status_code=500, detail=f"Error approving post: {str(e)}")

# async def update_markdown_with_posts(scheme_name: str):
#     try:
#         markdown_doc = markdown_collection.find_one({"scheme_name": scheme_name})
#         if not markdown_doc:
#             logger.warning(f"No markdown document found for scheme: {scheme_name}")
#             return
        
#         approved_posts = list(posts_collection.find(
#             {"schemeName": scheme_name, "status": "approved"},
#             {"title": 1, "description": 1, "schemeName": 1, "created_at": 1}
#         ))
        
#         if not approved_posts:
#             logger.info(f"No approved posts found for scheme: {scheme_name}")
#             return
        
#         post_content = ""
#         for post in approved_posts:
#             post_text = f"""

# ## User Post: {post['title']}

# **Scheme Name:** {post['schemeName']}

# **Description:** {post['description']}

# **Posted on:** {post['created_at']}

# ---
# """
#             post_content += post_text
        
#         updated_content = markdown_doc["markdown_content"] + post_content
#         current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y')
#         markdown_collection.update_one(
#             {"_id": markdown_doc["_id"]},
#             {"$set": {
#                 "markdown_content": updated_content,
#                 "updated_at": current_time
#             }}
#         )
#         logger.info(f"Updated markdown with {len(approved_posts)} posts for scheme: {scheme_name}")
#     except Exception as e:
#         logger.error(f"Error updating markdown with posts: {e}")

# @app.post("/rag-query", response_model=RAGResponse)
# async def rag_query(query: QueryRequest):
#     try:
#         logger.info(f"Processing RAG query: {query.query}")
        
#         # Step 1: Extract scheme name from query
#         example_schemes = [
#             "Sukanya Samriddhi Account Scheme",
#             "Pradhan Mantri Awas Yojana",
#             "Ayushman Bharat",
#             "Pradhan Mantri Kisan Samman Nidhi",
#             "Atal Pension Yojana",
#             "National Pension System",
#             "सुकन्या समृद्धि खाता योजना",
#             "प्रधानमंत्री आवास योजना"
#         ]
        
#         scheme_prompt = """
#         You are given a user query that may contain text in English or Hindi. 
#         Your task is to identify and extract the exact name of the scheme mentioned in the query. 
#         The scheme name is a proper noun or specific title, such as one of the following examples:
#         {examples}
        
#         If no scheme name is found, return "null". 
#         Provide only the scheme name as a string, or "null" if not found.

#         Query:
#         {query}

#         Output only the scheme name or null:
#         """
        
#         scheme_name = None
#         try:
#             prompt = scheme_prompt.format(query=query.query, examples="\n- " + "\n- ".join(example_schemes))
#             response = gemini_model.generate_content(prompt)
#             scheme_name = response.text.strip()
#             if scheme_name.lower() == "null" or not scheme_name:
#                 scheme_name = None
#             logger.info(f"Extracted scheme name: {scheme_name}")
#         except Exception as e:
#             logger.error(f"Error extracting scheme name with Gemini API: {e}")
#             scheme_name = None
        
#         if not scheme_name:
#             logger.warning(f"No scheme name found for query: {query.query}")
#             return RAGResponse(
#                 success=False,
#                 message="Please specify the scheme name in your query.",
#                 scheme_name=None,
#                 response="I couldn't identify a specific government scheme in your question. Please mention the scheme name you'd like to know about.",
#                 retrieved_chunks=[]
#             )
        
#         # Step 2: Convert query to vector embedding
#         try:
#             query_embedding = embedding_model.encode(
#                 f"query: {query.query}", 
#                 normalize_embeddings=True
#             ).tolist()
#             logger.info("Generated query embedding successfully")
#         except Exception as e:
#             logger.error(f"Error creating query embedding: {e}")
#             raise HTTPException(status_code=500, detail="Error processing query embedding")
        
#         # Step 3: Search Elasticsearch for relevant chunks
#         try:
#             # Updated search query for better compatibility
#             search_body = {
#                 "size": 5,
#                 "query": {
#                     "bool": {
#                         "must": [
#                             {"match": {"scheme_name": scheme_name}}
#                         ]
#                     }
#                 },
#                 "_source": ["text", "chunk_id", "scheme_name", "document_id"]
#             }
            
#             # Use script_score for vector similarity
#             if query_embedding:
#                 search_body["query"]["bool"]["must"].append({
#                     "script_score": {
#                         "query": {"match_all": {}},
#                         "script": {
#                             "source": "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
#                             "params": {"query_vector": query_embedding}
#                         }
#                     }
#                 })
            
#             logger.info(f"Searching for chunks related to scheme: {scheme_name}")
#             response = es_client.search(index="markdown_vectors", body=search_body)
            
#             retrieved_chunks = [
#                 {
#                     "text": hit['_source']['text'],
#                     "chunk_id": hit['_source']['chunk_id'],
#                     "score": hit['_score']
#                 }
#                 for hit in response['hits']['hits']
#             ]
#             logger.info(f"Retrieved {len(retrieved_chunks)} chunks from Elasticsearch")
            
#         except Exception as e:
#             logger.error(f"Error searching Elasticsearch: {e}")
#             # Fallback to MongoDB search if Elasticsearch fails
#             try:
#                 logger.info("Falling back to MongoDB search")
#                 markdown_doc = markdown_collection.find_one({"scheme_name": scheme_name})
#                 if markdown_doc:
#                     # Simple text chunking for fallback
#                     content = markdown_doc.get("markdown_content", "")
#                     chunks = pdf_processor.chunk_text_custom(content, max_length=400)
#                     retrieved_chunks = [
#                         {"text": chunk, "chunk_id": i, "score": 1.0}
#                         for i, chunk in enumerate(chunks[:5])  # Take first 5 chunks
#                     ]
#                 else:
#                     retrieved_chunks = []
#             except Exception as fallback_error:
#                 logger.error(f"Fallback search also failed: {fallback_error}")
#                 retrieved_chunks = []
        
#         # Step 4: Generate response using retrieved chunks
#         if not retrieved_chunks:
#             return RAGResponse(
#                 success=False,
#                 message=f"No information found for scheme: {scheme_name}",
#                 scheme_name=scheme_name,
#                 response=f"I couldn't find specific information about {scheme_name}. Please make sure the scheme name is correct or try uploading the relevant document first.",
#                 retrieved_chunks=[]
#             )
        
#         context = "\n\n".join([chunk['text'] for chunk in retrieved_chunks])
#         response_prompt = """
#         You are a helpful chatbot answering questions about government schemes based on the provided context. 
#         Use the following context to answer the user's query accurately and concisely. 
#         If the context does not contain enough information to answer the query, provide a general response and suggest clarifying the query.
        
#         Context:
#         {context}
        
#         Query:
#         {query}
        
#         Answer in a clear and concise manner, using the language of the query ({language}) if possible:
#         """
        
#         response_text = "No relevant information found. Please clarify your query or specify the correct scheme."
#         try:
#             prompt = response_prompt.format(
#                 context=context,
#                 query=query.query,
#                 language=query.language_code
#             )
#             response = gemini_model.generate_content(prompt)
#             response_text = response.text.strip()
#             logger.info("Generated response successfully")
#         except Exception as e:
#             logger.error(f"Error generating response with Gemini API: {e}")
#             response_text = f"I found information about {scheme_name}, but I'm having trouble generating a response right now. Please try again."
        
#         return RAGResponse(
#             success=True,
#             message="Query processed successfully",
#             scheme_name=scheme_name,
#             response=response_text,
#             retrieved_chunks=retrieved_chunks
#         )
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"Unexpected error processing RAG query: {e}")
#         raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

# @app.get("/schemes")
# async def get_all_schemes():
#     try:
#         schemes = list(markdown_collection.find(
#             {},
#             {"scheme_name": 1, "created_at": 1, "updated_at": 1, "chunks_count": 1}
#         ))
#         for scheme in schemes:
#             scheme["_id"] = str(scheme["_id"])
#         return {
#             "success": True,
#             "schemes": schemes
#         }
#     except Exception as e:
#         logger.error(f"Error fetching schemes: {e}")
#         raise HTTPException(status_code=500, detail=f"Error fetching schemes: {str(e)}")

# @app.get("/scheme/{scheme_name}")
# async def get_scheme_details(scheme_name: str):
#     try:
#         scheme = markdown_collection.find_one({"scheme_name": scheme_name})
#         if not scheme:
#             raise HTTPException(status_code=404, detail="Scheme not found")
#         scheme["_id"] = str(scheme["_id"])
        
#         posts = list(posts_collection.find(
#             {"schemeName": scheme_name, "status": "approved"},
#             {"title": 1, "description": 1, "created_at": 1}
#         ))
#         for post in posts:
#             post["_id"] = str(post["_id"])
            
#         return {
#             "success": True,
#             "scheme": scheme,
#             "related_posts": posts
#         }
#     except Exception as e:
#         logger.error(f"Error fetching scheme details: {e}")
#         raise HTTPException(status_code=500, detail=f"Error fetching scheme details: {str(e)}")

# @app.get("/health")
# async def health_check():
#     try:
#         # Check MongoDB
#         mongo_status = "connected"
#         try:
#             mongo_client.admin.command('ping')
#         except:
#             mongo_status = "disconnected"
        
#         # Check Elasticsearch
#         es_status = "connected"
#         try:
#             es_client.ping()
#         except:
#             es_status = "disconnected"
        
#         return {
#             "status": "healthy",
#             "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y %I:%M %p'),
#             "services": {
#                 "mongodb": mongo_status,
#                 "elasticsearch": es_status,
#                 "gemini": "configured"
#             }
#         }
#     except Exception as e:
#         return {
#             "status": "unhealthy",
#             "error": str(e),
#             "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y %I:%M %p')
#         }

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)


import logging
import os
import re
import base64
from pathlib import Path
from datetime import datetime
from typing import List, Optional, Dict, Any
import pytz
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.base_models import InputFormat
from docling.datamodel.pipeline_options import PdfPipelineOptions, TesseractOcrOptions
from docling.chunking import HybridChunker
from docling_core.types.doc import ImageRefMode
import google.generativeai as genai
from sentence_transformers import SentenceTransformer
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Configuration
GEMINI_API_KEY=''
MONGO_URI = ''
HUGGING_FACE_TOKEN = ''
EMBEDDING_MODEL_NAME = ''
UPLOAD_DIR = Path("./uploads")
PARSED_DIR = Path("./parsed_docs")
ELASTICSEARCH_URL = ''
ELASTICSEARCH_API_KEY =''
mongo_uri ='mongodb://127.0.0.1:27017/pdf_ingestion_system'

# Create directories
UPLOAD_DIR.mkdir(exist_ok=True)
PARSED_DIR.mkdir(exist_ok=True)

# Initialize FastAPI app
app = FastAPI(title="RAG Chatbot Backend", description="RAG-based chatbot with PDF processing and vector search")

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
    chats_collection = db['chats']
    
    # Elasticsearch connection with API key
    es_client = Elasticsearch(
        [ELASTICSEARCH_URL],
        api_key=ELASTICSEARCH_API_KEY,
        verify_certs=False,
        request_timeout=30,
        max_retries=3,
        retry_on_timeout=True
    )
    
    # Test Elasticsearch connection and get version
    es_info = es_client.info()
    es_version = es_info['version']['number']
    logger.info(f"Connected to Elasticsearch version: {es_version}")

    # Gemini AI configuration
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-2.0-flash-001')
    
    # Sentence transformer for embeddings
    embedding_model = SentenceTransformer(
        EMBEDDING_MODEL_NAME,
        token=HUGGING_FACE_TOKEN
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
    status: str

class QueryRequest(BaseModel):
    query: str
    language_code: Optional[str] = 'en-IN'

class RAGResponse(BaseModel):
    success: bool
    message: str
    scheme_name: Optional[str] = None
    response: Optional[str] = None
    retrieved_chunks: Optional[List[Dict]] = None

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
    generate_page_images=False,
    generate_picture_images=False,
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
        unicode_map = {
            'uni092F': 'य', 'uni093F': 'ि', 'uni092Fा': 'या', 'uni093F/g7021': '',
            'uni0927': 'ध',
        }
        text = re.sub(r'/g\d{4}', '', text)
        for code, char in unicode_map.items():
            text = text.replace(f'/{code}', char)
        text = re.sub(r'/uni[0-9A-Fa-f]{4}', '', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    
    def remove_base64_images(self, markdown_content: str) -> str:
        base64_pattern = r'!\[.*?\]\(data:image/[^;]+;base64,[^)]+\)'
        return re.sub(base64_pattern, '[Image removed]', markdown_content)
    
    def chunk_text_custom(self, text: str, max_length: int = 400) -> List[str]:
        words = text.split()
        chunks = []
        current_chunk = []
        current_length = 0
        for word in words:
            current_length += len(word) + 1
            if current_length > max_length:
                if current_chunk:
                    chunks.append(' '.join(current_chunk))
                current_chunk = [word]
                current_length = len(word) + 1
            else:
                current_chunk.append(word)
        if current_chunk:
            chunks.append(' '.join(current_chunk))
        return chunks
    
    def extract_scheme_name(self, chunks: List[str]) -> Optional[str]:
        example_schemes = [
            "Sukanya Samriddhi Account Scheme",
            "Pradhan Mantri Awas Yojana",
            "Ayushman Bharat",
            "Pradhan Mantri Kisan Samman Nidhi",
            "Atal Pension Yojana",
            "National Pension System",
            "सुकन्या समृद्धि खाता योजना",
            "प्रधानमंत्री आवास योजना"
        ]
        prompt_template = """
        You are given a chunk of text from a user query or document that may contain text in English or Hindi. 
        Your task is to identify and extract the exact name of the scheme mentioned in the text. 
        The scheme name is a proper noun or specific title, such as one of the following examples:
        {examples}
        
        If no scheme name is found, return "null". 
        Provide only the scheme name as a string, or "null" if not found.

        Chunk:
        {chunk}

        Output only the scheme name or null:
        """
        for chunk in chunks:
            chunk_text = self.clean_text(chunk)
            prompt = prompt_template.format(chunk=chunk_text, examples="\n- " + "\n- ".join(example_schemes))
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
        embeddings_data = []
        for i, chunk_text in enumerate(chunks):
            chunk_text = self.clean_text(chunk_text)
            if not chunk_text.strip():
                continue
            try:
                embedding = embedding_model.encode(
                    f"passage: {chunk_text}", 
                    normalize_embeddings=True
                ).tolist()
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
        index_name = "haqdarshak"
        try:
            if not es_client.indices.exists(index=index_name):
                logger.info(f"Creating index: {index_name}")
                mapping = {
                    "mappings": {
                        "properties": {
                            "document_id": {"type": "keyword"},
                            "scheme_name": {"type": "text"},
                            "chunk_id": {"type": "integer"},
                            "text": {"type": "text"},
                            "embedding": {
                                "type": "dense_vector",
                                "dims": 768
                            },
                            "language": {"type": "keyword"},
                            "created_at": {"type": "date"}
                        }
                    }
                }
                es_client.indices.create(index=index_name, body=mapping)
                logger.info(f"Created Elasticsearch index: {index_name} with mapping")
            else:
                logger.info(f"Index {index_name} already exists, checking mapping")
                current_mapping = es_client.indices.get_mapping(index=index_name)
                logger.info(f"Current mapping for {index_name}: {current_mapping}")
        except Exception as e:
            logger.error(f"Error creating or checking Elasticsearch index {index_name}: {e}")
            raise
    
    def store_embeddings_in_elasticsearch(self, embeddings_data: List[Dict], document_id: str, scheme_name: str):
        try:
            self.ensure_elasticsearch_index()
            index_name = "haqdarshak"
            current_time = datetime.now(pytz.timezone('Asia/Kolkata'))
            actions = [
                {
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
                for embedding_data in embeddings_data
            ]
            if actions:
                response = bulk(es_client, actions)
                logger.info(f"Bulk response: {response}")
                if response[0] == 0:
                    logger.warning(f"No documents indexed successfully in {index_name}")
                else:
                    logger.info(f"Stored {response[0]} embeddings in Elasticsearch")
        except Exception as e:
            logger.error(f"Error storing embeddings in Elasticsearch: {e}")
            raise

pdf_processor = PDFProcessor()

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
        
        scheme_name = pdf_processor.extract_scheme_name(text_chunks)
        if not scheme_name:
            logger.warning("No scheme name found in the document")
            scheme_name = "Unknown Scheme"
        
        embeddings_data = pdf_processor.create_embeddings(text_chunks)
        logger.info(f"Created {len(embeddings_data)} embeddings")
        
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
            message="PDF processed successfully",
            scheme_name=scheme_name,
            document_id=document_id,
            chunks_processed=len(text_chunks)
        )
    except Exception as e:
        logger.error(f"Error processing PDF: {e}")
        if file_path and file_path.exists():
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@app.post("/submit-post")
async def submit_post(post: PostRequest):
    try:
        current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y %I:%M %p')
        post_document = {
            "title": post.title,
            "description": post.description,
            "schemeName": post.scheme_name,
            "status": "pending",
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
    try:
        pending_posts = list(posts_collection.find(
            {"status": "pending"},
            {"title": 1, "description": 1, "schemeName": 1, "created_at": 1}
        ))
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
    try:
        from bson import ObjectId
        current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y %I:%M %p')
        result = posts_collection.update_one(
            {"_id": ObjectId(approval.post_id)},
            {"$set": {"status": approval.status, "updated_at": current_time}}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Post not found")
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
    try:
        markdown_doc = markdown_collection.find_one({"scheme_name": scheme_name})
        if not markdown_doc:
            logger.warning(f"No markdown document found for scheme: {scheme_name}")
            return
        
        approved_posts = list(posts_collection.find(
            {"schemeName": scheme_name, "status": "approved"},
            {"title": 1, "description": 1, "schemeName": 1, "created_at": 1}
        ))
        
        if not approved_posts:
            logger.info(f"No approved posts found for scheme: {scheme_name}")
            return
        
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

@app.post("/rag-query", response_model=RAGResponse)
async def rag_query(query: QueryRequest):
    try:
        logger.info(f"Processing RAG query: {query.query}")
        
        # Step 1: Extract scheme name from query
        example_schemes = [
            "Sukanya Samriddhi Account Scheme",
            "Pradhan Mantri Awas Yojana",
            "Ayushman Bharat",
            "Pradhan Mantri Kisan Samman Nidhi",
            "Atal Pension Yojana",
            "National Pension System",
            "सुकन्या समृद्धि खाता योजना",
            "प्रधानमंत्री आवास योजना"
        ]
        
        scheme_prompt = """
        You are given a user query that may contain text in English or Hindi. 
        Your task is to identify and extract the exact name of the scheme mentioned in the query. 
        The scheme name is a proper noun or specific title, such as one of the following examples:
        {examples}
        
        If no scheme name is found, return "null". 
        Provide only the scheme name as a string, or "null" if not found.

        Query:
        {query}

        Output only the scheme name or null:
        """
        
        scheme_name = None
        try:
            prompt = scheme_prompt.format(query=query.query, examples="\n- " + "\n- ".join(example_schemes))
            response = gemini_model.generate_content(prompt)
            scheme_name = response.text.strip()
            if scheme_name.lower() == "null" or not scheme_name:
                scheme_name = None
            logger.info(f"Extracted scheme name: {scheme_name}")
        except Exception as e:
            logger.error(f"Error extracting scheme name with Gemini API: {e}")
            scheme_name = None
        
        if not scheme_name:
            logger.warning(f"No scheme name found for query: {query.query}")
            return RAGResponse(
                success=False,
                message="Please specify the scheme name in your query.",
                scheme_name=None,
                response="I couldn't identify a specific government scheme in your question. Please mention the scheme name you'd like to know about.",
                retrieved_chunks=[]
            )
        
        # Step 2: Convert query to vector embedding
        try:
            query_embedding = embedding_model.encode(
                f"query: {query.query}", 
                normalize_embeddings=True
            ).tolist()
            logger.info("Generated query embedding successfully")
        except Exception as e:
            logger.error(f"Error creating query embedding: {e}")
            raise HTTPException(status_code=500, detail="Error processing query embedding")
        
        # Step 3: Search Elasticsearch for relevant chunks
        try:
            # Updated search query for better compatibility
            search_body = {
                "size": 5,
                "query": {
                    "bool": {
                        "must": [
                            {"match": {"scheme_name": scheme_name}}
                        ]
                    }
                },
                "_source": ["text", "chunk_id", "scheme_name", "document_id"]
            }
            
            # Use script_score for vector similarity
            if query_embedding:
                search_body["query"]["bool"]["must"].append({
                    "script_score": {
                        "query": {"match_all": {}},
                        "script": {
                            "source": "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
                            "params": {"query_vector": query_embedding}
                        }
                    }
                })
            
            logger.info(f"Searching for chunks related to scheme: {scheme_name}")
            response = es_client.search(index="haqdarshak", body=search_body)
            
            retrieved_chunks = [
                {
                    "text": hit['_source']['text'],
                    "chunk_id": hit['_source']['chunk_id'],
                    "score": hit['_score']
                }
                for hit in response['hits']['hits']
            ]
            logger.info(f"Retrieved {len(retrieved_chunks)} chunks from Elasticsearch")
            
        except Exception as e:
            logger.error(f"Error searching Elasticsearch: {e}")
            # Fallback to MongoDB search if Elasticsearch fails
            try:
                logger.info("Falling back to MongoDB search")
                markdown_doc = markdown_collection.find_one({"scheme_name": scheme_name})
                if markdown_doc:
                    # Simple text chunking for fallback
                    content = markdown_doc.get("markdown_content", "")
                    chunks = pdf_processor.chunk_text_custom(content, max_length=400)
                    retrieved_chunks = [
                        {"text": chunk, "chunk_id": i, "score": 1.0}
                        for i, chunk in enumerate(chunks[:5])  # Take first 5 chunks
                    ]
                else:
                    retrieved_chunks = []
            except Exception as fallback_error:
                logger.error(f"Fallback search also failed: {fallback_error}")
                retrieved_chunks = []
        
        # Step 4: Generate response using retrieved chunks
        if not retrieved_chunks:
            return RAGResponse(
                success=False,
                message=f"No information found for scheme: {scheme_name}",
                scheme_name=scheme_name,
                response=f"I couldn't find specific information about {scheme_name}. Please make sure the scheme name is correct or try uploading the relevant document first.",
                retrieved_chunks=[]
            )
        
        context = "\n\n".join([chunk['text'] for chunk in retrieved_chunks])
        response_prompt = """
        You are a helpful chatbot answering questions about government schemes based on the provided context. 
        Use the following context to answer the user's query accurately and concisely. 
        If the context does not contain enough information to answer the query, provide a general response and suggest clarifying the query.
        
        Context:
        {context}
        
        Query:
        {query}
        
        Answer in a clear and concise manner, using the language of the query ({language}) if possible:
        """
        
        response_text = "No relevant information found. Please clarify your query or specify the correct scheme."
        try:
            prompt = response_prompt.format(
                context=context,
                query=query.query,
                language=query.language_code
            )
            response = gemini_model.generate_content(prompt)
            response_text = response.text.strip()
            logger.info("Generated response successfully")
        except Exception as e:
            logger.error(f"Error generating response with Gemini API: {e}")
            response_text = f"I found information about {scheme_name}, but I'm having trouble generating a response right now. Please try again."
        
        return RAGResponse(
            success=True,
            message="Query processed successfully",
            scheme_name=scheme_name,
            response=response_text,
            retrieved_chunks=retrieved_chunks
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error processing RAG query: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@app.get("/schemes")
async def get_all_schemes():
    try:
        schemes = list(markdown_collection.find(
            {},
            {"scheme_name": 1, "created_at": 1, "updated_at": 1, "chunks_count": 1}
        ))
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
    try:
        scheme = markdown_collection.find_one({"scheme_name": scheme_name})
        if not scheme:
            raise HTTPException(status_code=404, detail="Scheme not found")
        scheme["_id"] = str(scheme["_id"])
        
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

@app.get("/health")
async def health_check():
    try:
        # Check MongoDB
        mongo_status = "connected"
        try:
            mongo_client.admin.command('ping')
        except:
            mongo_status = "disconnected"
        
        # Check Elasticsearch
        es_status = "connected"
        try:
            es_client.ping()
        except:
            es_status = "disconnected"
        
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



# db.markdown_files.find().sort({ _id: -1 }).limit(1).forEach(doc => {
#     if (doc.
# markdown_content) {
#         print(doc.
# markdown_content.slice(-500));
#     }
# })
