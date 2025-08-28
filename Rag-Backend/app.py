

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
import requests

from bson import ObjectId

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Configuration
# GEMINI_API_KEY = "AIzaSyDy780rpCWpDX7NKz9oInrjr59dxY0iymE"
# MONGO_URI = "mongodb://127.0.0.1:27017/pdf_ingestion_system"
# UPLOAD_DIR = Path("./uploads")
# PARSED_DIR = Path("./parsed_docs")
# ELASTICSEARCH_URL = "https://my-elasticsearch-project-cff6bd.es.us-central1.gcp.elastic.cloud:443"
# ELASTICSEARCH_API_KEY = "aGdhV3JaZ0JhSEJ0RWhfNnRpQlI6SElfcDQ2dkYwbVgxaW5lSzRGN0Nydw=="
# mongo_uri = 'mongodb+srv://kavyakapoor413:Helloworld@cluster01.4zpagwq.mongodb.net/KavyaGPT?retryWrites=true&w=majority&appName=Cluster01'

# GEMINI_API_KEY=''
# MONGO_URI = ''
# HUGGING_FACE_TOKEN = ''
# EMBEDDING_MODEL_NAME = ''
# UPLOAD_DIR = Path("./uploads")
# PARSED_DIR = Path("./parsed_docs")
# ELASTICSEARCH_URL = ''
# ELASTICSEARCH_API_KEY =''
# mongo_uri ='mongodb://127.0.0.1:27017/pdf_ingestion_system'


GEMINI_API_KEY = "AIzaSyDy780rpCWpDX7NKz9oInrjr59dxY0iymE"
MONGO_URI = "mongodb://127.0.0.1:27017/pdf_ingestion_system"
HUGGING_FACE_TOKEN ='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'
EMBEDDING_MODEL_NAME = 'intfloat/multilingual-e5-base'
UPLOAD_DIR = Path("./uploads")
PARSED_DIR = Path("./parsed_docs")
ELASTICSEARCH_URL = "https://my-elasticsearch-project-cff6bd.es.us-central1.gcp.elastic.cloud:443"
ELASTICSEARCH_API_KEY = "aGdhV3JaZ0JhSEJ0RWhfNnRpQlI6SElfcDQ2dkYwbVgxaW5lSzRGN0Nydw=="
mongo_uri ='mongodb://127.0.0.1:27017/pdf_ingestion_system'
SARVAM_API_KEY = 'sk_9hxc0y4c_BPOUXUh2Fc5bbjzk4VLggBd1' 

UPLOAD_DIR = Path("./uploads")
PARSED_DIR = Path("./parsed_docs")

# Sarvam AI Configuration for Translation
# SARVAM_API_KEY = 'sk_oswbovqu_RKsxylFUid3eSRD2aDlCELnI'
SARVAM_TRANSLATE_URL = 'https://api.sarvam.ai/translate'

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

# Language mapping for Sarvam AI
LANGUAGE_CODE_MAPPING = {
    'hi': 'hi-IN',  # Hindi
    'hi-IN': 'hi-IN',
    'en': 'en-IN',  # English
    'en-IN': 'en-IN',
    'bn': 'bn-IN',  # Bengali
    'bn-IN': 'bn-IN',
    'gu': 'gu-IN',  # Gujarati
    'gu-IN': 'gu-IN',
    'kn': 'kn-IN',  # Kannada
    'kn-IN': 'kn-IN',
    'ml': 'ml-IN',  # Malayalam
    'ml-IN': 'ml-IN',
    'mr': 'mr-IN',  # Marathi
    'mr-IN': 'mr-IN',
    'or': 'or-IN',  # Odia
    'or-IN': 'or-IN',
    'pa': 'pa-IN',  # Punjabi
    'pa-IN': 'pa-IN',
    'ta': 'ta-IN',  # Tamil
    'ta-IN': 'ta-IN',
    'te': 'te-IN',  # Telugu
    'te-IN': 'te-IN',
    'ur': 'ur-IN',  # Urdu
    'ur-IN': 'ur-IN'
}

# Translation utility class
class TranslationService:
    def __init__(self):
        self.sarvam_api_key = SARVAM_API_KEY
        self.translate_url = SARVAM_TRANSLATE_URL
        
    def detect_language(self, text: str) -> str:
        """
        Detect language of the text using character analysis and common words
        """
        # Simple heuristic-based language detection
        # Check for Devanagari script (Hindi)
        hindi_chars = re.findall(r'[\u0900-\u097F]', text)
        if len(hindi_chars) > len(text) * 0.3:
            return 'hi-IN'
        
        # Check for Bengali script
        bengali_chars = re.findall(r'[\u0980-\u09FF]', text)
        if len(bengali_chars) > len(text) * 0.3:
            return 'bn-IN'
            
        # Check for Telugu script
        telugu_chars = re.findall(r'[\u0C00-\u0C7F]', text)
        if len(telugu_chars) > len(text) * 0.3:
            return 'te-IN'
            
        # Check for Tamil script
        tamil_chars = re.findall(r'[\u0B80-\u0BFF]', text)
        if len(tamil_chars) > len(text) * 0.3:
            return 'ta-IN'
            
        # Default to English if no Indic script detected
        return 'en-IN'
    
    def translate_text(self, text: str, source_language: str, target_language: str) -> str:
        """
        Translate text using Sarvam AI API
        """
        try:
            # Skip translation if source and target are the same
            if source_language == target_language:
                return text
                
            # Clean text for translation
            clean_text = text.strip()
            if not clean_text:
                return text
                
            headers = {
                'api-subscription-key': self.sarvam_api_key,
                'Content-Type': 'application/json'
            }
            
            payload = {
                'input': clean_text,
                'source_language_code': source_language,
                'target_language_code': target_language,
                'speaker_gender': 'Male',
                'mode': 'formal',
                'model': 'mayura:v1',
                'enable_preprocessing': True
            }
            
            logger.info(f"Translating from {source_language} to {target_language}: {clean_text[:50]}...")
            
            response = requests.post(self.translate_url, headers=headers, json=payload, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                translated_text = result.get('translated_text', text)
                logger.info(f"Translation successful: {translated_text[:50]}...")
                return translated_text
            else:
                logger.error(f"Translation API error: {response.status_code} - {response.text}")
                return text
                
        except Exception as e:
            logger.error(f"Translation error: {e}")
            return text
    
    def translate_to_english(self, text: str, source_language: str = None) -> tuple:
        """
        Translate text to English for processing
        Returns (translated_text, detected_language)
        """
        if not source_language:
            source_language = self.detect_language(text)
        
        if source_language == 'en-IN':
            return text, source_language
            
        translated = self.translate_text(text, source_language, 'en-IN')
        return translated, source_language
    
    def translate_from_english(self, text: str, target_language: str) -> str:
        """
        Translate text from English to target language
        """
        if target_language == 'en-IN':
            return text
            
        return self.translate_text(text, 'en-IN', target_language)

# Initialize translation service
translation_service = TranslationService()

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
    detected_language: Optional[str] = None
    translated_query: Optional[str] = None

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
    
    def extract_scheme_name_multilingual(self, chunks: List[str]) -> Optional[str]:
        """
        Enhanced scheme name extraction supporting multilingual content
        """
        example_schemes = [
            "Sukanya Samriddhi Account Scheme",
            "Pradhan Mantri Awas Yojana", 
            "Ayushman Bharat",
            "Pradhan Mantri Kisan Samman Nidhi",
            "Atal Pension Yojana",
            "National Pension System",
            "सुकन्या समृद्धि खाता योजना",
            "प्रधानमंत्री आवास योजना",
            "आयुष्मान भारत",
            "प्रधानमंत्री किसान सम्मान निधि"
        ]
        
        prompt_template = """
        You are given a chunk of text from a document that may contain text in English, Hindi, or other Indian languages.
        Your task is to identify and extract the exact name of the government scheme mentioned in the text.
        The scheme name is a proper noun or specific title.
        
        Common scheme examples:
        {examples}
        
        If no scheme name is found, return "null".
        Provide only the scheme name as a string, or "null" if not found.
        Extract the scheme name in its original language format.

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
    
    def create_embeddings_multilingual(self, chunks: List[str]) -> List[Dict]:
        """
        Create embeddings for multilingual chunks
        """
        embeddings_data = []
        for i, chunk_text in enumerate(chunks):
            chunk_text = self.clean_text(chunk_text)
            if not chunk_text.strip():
                continue
            try:
                # Create embedding for original text
                embedding = embedding_model.encode(
                    f"passage: {chunk_text}", 
                    normalize_embeddings=True
                ).tolist()
                
                # Detect language
                detected_lang = translation_service.detect_language(chunk_text)
                
                # Create English translation embedding if not already in English
                english_text = chunk_text
                english_embedding = embedding
                
                if detected_lang != 'en-IN':
                    try:
                        english_text = translation_service.translate_text(chunk_text, detected_lang, 'en-IN')
                        english_embedding = embedding_model.encode(
                            f"passage: {english_text}", 
                            normalize_embeddings=True
                        ).tolist()
                    except Exception as e:
                        logger.error(f"Error translating chunk {i} to English: {e}")
                
                embeddings_data.append({
                    'chunk_id': i,
                    'text': chunk_text,
                    'english_text': english_text,
                    'embedding': embedding,
                    'english_embedding': english_embedding,
                    'language': detected_lang
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
                            "english_text": {"type": "text"},
                            "embedding": {
                                "type": "dense_vector",
                                "dims": 768
                            },
                            "english_embedding": {
                                "type": "dense_vector",
                                "dims": 768
                            },
                            "language": {"type": "keyword"},
                            "created_at": {"type": "date"}
                        }
                    }
                }
                es_client.indices.create(index=index_name, body=mapping)
                logger.info(f"Created Elasticsearch index: {index_name} with multilingual mapping")
            else:
                logger.info(f"Index {index_name} already exists")
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
                        "english_text": embedding_data['english_text'],
                        "embedding": embedding_data['embedding'],
                        "english_embedding": embedding_data['english_embedding'],
                        "language": embedding_data['language'],
                        "created_at": current_time
                    }
                }
                for embedding_data in embeddings_data
            ]
            if actions:
                response = bulk(es_client, actions)
                logger.info(f"Stored {response[0]} multilingual embeddings in Elasticsearch")
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


# Add this new endpoint to your FastAPI app (around line 800, after the existing endpoints)

@app.post("/approve-post")
async def approve_post(approval: PostApproval):
    try:
        from bson import ObjectId
        current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y %I:%M %p')
        
        # Update the post status
        result = posts_collection.update_one(
            {"_id": ObjectId(approval.post_id)},
            {"$set": {"status": approval.status, "updated_at": current_time}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Post not found")
        
        # If post is approved, update markdown and regenerate embeddings
        if approval.status == "approved":
            post = posts_collection.find_one({"_id": ObjectId(approval.post_id)})
            if post:
                await update_markdown_with_posts_and_embeddings(post["schemeName"])
        
        logger.info(f"Post {approval.post_id} {approval.status}")
        return {
            "success": True,
            "message": f"Post {approval.status} successfully"
        }
    except Exception as e:
        logger.error(f"Error approving post: {e}")
        raise HTTPException(status_code=500, detail=f"Error approving post: {str(e)}")




# async def update_markdown_with_posts_and_embeddings(scheme_name: str):
#     """Update markdown content with approved posts and regenerate embeddings."""
    
#     try:
#         logger.info(f"Updating markdown and embeddings for scheme: {scheme_name}")
        
#         # Find the markdown document
#         markdown_doc = markdown_collection.find_one({"scheme_name": scheme_name})
        
#         if not markdown_doc:
#             logger.warning(f"No markdown document found for scheme: {scheme_name}")
#             return False
        
#         # Get approved posts for this scheme
#         approved_posts = list(posts_collection.find(
#             {"schemeName": scheme_name, "status": "approved"},
#             {"title": 1, "description": 1, "schemeName": 1, "created_at": 1}
#         ))
        
#         if not approved_posts:
#             logger.info(f"No approved posts found for scheme: {scheme_name}")
#             return False
        
#         # Build post content
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
        
#         # Check if posts are already added to avoid duplication
#         original_content = markdown_doc["markdown_content"]
#         if "## User Post:" in original_content:
#             # Remove existing user posts and add fresh ones
#             content_parts = original_content.split("## User Post:")
#             base_content = content_parts[0].rstrip()
#             updated_content = base_content + post_content
#         else:
#             # First time adding posts
#             updated_content = original_content + post_content
        
#         current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y')
        
#         # Update the markdown document in MongoDB
#         update_result = markdown_collection.update_one(
#             {"_id": markdown_doc["_id"]},
#             {"$set": {
#                 "markdown_content": updated_content,
#                 "updated_at": current_time,
#                 "last_post_update": current_time
#             }}
#         )
        
#         if update_result.modified_count == 0:
#             logger.warning(f"No MongoDB document was modified for scheme: {scheme_name}")
#             return False
        
#         logger.info(f"Successfully updated MongoDB with {len(approved_posts)} posts for scheme: {scheme_name}")
        
#         # Regenerate embeddings for the updated content
#         await regenerate_embeddings_for_scheme(scheme_name, updated_content, str(markdown_doc["_id"]))
        
#         return True
        
#     except Exception as e:
#         logger.error(f"Error updating markdown with posts and embeddings: {e}")
#         raise e



async def update_markdown_with_posts(scheme_name: str):
    """Update markdown content with approved posts and update the actual markdown file."""
    
    try:
        # Find the markdown document in MongoDB - Note: scheme_name field in markdown collection
        markdown_doc = markdown_collection.find_one({"scheme_name": scheme_name})
        
        if not markdown_doc:
            logger.warning(f"No markdown document found for scheme: {scheme_name}")
            # Try alternative search by partial match
            markdown_doc = markdown_collection.find_one(
                {"scheme_name": {"$regex": scheme_name, "$options": "i"}}
            )
            if not markdown_doc:
                logger.error(f"Still no markdown document found for scheme: {scheme_name}")
                return
            else:
                logger.info(f"Found markdown document with regex match: {markdown_doc['scheme_name']}")
        
        # Get approved posts for this scheme - Note: schemeName field in posts collection
        # Check both exact match and regex match for flexibility
        approved_posts = list(posts_collection.find(
            {
                "$and": [
                    {"status": "approved"},
                    {
                        "$or": [
                            {"schemeName": scheme_name},
                            {"schemeName": {"$regex": scheme_name, "$options": "i"}}
                        ]
                    }
                ]
            },
            {"title": 1, "description": 1, "schemeName": 1, "created_at": 1, "_id": 1}
        ))
        
        if not approved_posts:
            logger.info(f"No approved posts found for scheme: {scheme_name}")
            return
        
        # Check if we have already processed these posts (prevent duplicates)
        processed_post_ids = markdown_doc.get("processed_post_ids", [])
        new_posts = [post for post in approved_posts if str(post["_id"]) not in processed_post_ids]
        
        if not new_posts:
            logger.info(f"All approved posts already processed for scheme: {scheme_name}")
            return
        
        # Build post content to append
        post_content = ""
        new_post_ids = []
        
        for post in new_posts:
            post_text = f"""

## User Post: {post['title']}

**Scheme Name:** {post['schemeName']}

**Description:** {post['description']}

**Posted on:** {post['created_at']}

---
"""
            post_content += post_text
            new_post_ids.append(str(post["_id"]))
        
        # Update markdown content in database
        updated_content = markdown_doc["markdown_content"] + post_content
        current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y')
        
        # Update both content and processed post IDs
        all_processed_ids = processed_post_ids + new_post_ids
        
        result = markdown_collection.update_one(
            {"_id": markdown_doc["_id"]},
            {"$set": {
                "markdown_content": updated_content,
                "updated_at": current_time,
                "processed_post_ids": all_processed_ids
            }}
        )
        
        if result.modified_count == 0:
            logger.error("Failed to update markdown document in database")
            return
        
        # Also update the actual markdown file on disk
        try:
            # Get the original PDF filename to construct the markdown filename
            pdf_filename = markdown_doc.get("pdf_filename", "")
            if pdf_filename:
                # Extract base name without extension and construct markdown filename
                doc_filename = Path(pdf_filename).stem
                md_filename = PARSED_DIR / f"{doc_filename}-parsed.md"
                
                # Check if file exists
                if md_filename.exists():
                    # Write the updated content to the markdown file
                    with open(md_filename, 'w', encoding='utf-8') as f:
                        f.write(updated_content)
                    
                    logger.info(f"Successfully updated markdown file: {md_filename}")
                else:
                    logger.error(f"Markdown file not found: {md_filename}")
            else:
                logger.warning(f"No PDF filename found for scheme: {scheme_name}, skipping file update")
                
        except Exception as file_error:
            logger.error(f"Error updating markdown file: {file_error}")
            # Continue execution even if file update fails
        
        logger.info(f"Successfully updated markdown with {len(new_posts)} new posts for scheme: {scheme_name}")
        
        # Log the updated content length for debugging
        logger.info(f"Updated content length: {len(updated_content)} characters")
        
    except Exception as e:
        logger.error(f"Error updating markdown with posts: {e}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise e



@app.post("/rag-query", response_model=RAGResponse)
async def rag_query(query: QueryRequest):
    try:
        logger.info(f"Processing multilingual RAG query: {query.query}")
        
        # Step 1: Detect language and translate query to English
        detected_language = translation_service.detect_language(query.query)
        logger.info(f"Detected language: {detected_language}")
        
        # Translate query to English for processing
        translated_query, original_language = translation_service.translate_to_english(query.query, detected_language)
        logger.info(f"Translated query: {translated_query}")
        
        # Step 2: Extract scheme name from translated query
        example_schemes = [
            "Sukanya Samriddhi Account Scheme",
            "Pradhan Mantri Awas Yojana",
            "Ayushman Bharat",
            "Pradhan Mantri Kisan Samman Nidhi",
            "Atal Pension Yojana",
            "National Pension System"
        ]
        
        scheme_prompt = """
        You are given a user query in English about government schemes.
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
            prompt = scheme_prompt.format(query=translated_query, examples="\n- " + "\n- ".join(example_schemes))
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
            response_text = "Please specify the scheme name in your query."
            # Translate response back to original language
            if original_language != 'en-IN':
                response_text = translation_service.translate_from_english(response_text, original_language)
            
            return RAGResponse(
                success=False,
                message="No scheme name found plz try to include the name of Relevant Scheme accroding to your Query for a better response",
                scheme_name=None,
                response=response_text,
                retrieved_chunks=[],
                detected_language=detected_language,
                translated_query=translated_query
            )
        
        # Step 3: Convert query to vector embedding (using both original and translated)
        try:
            # Create embeddings for both original and English query
            original_query_embedding = embedding_model.encode(
                f"query: {query.query}", 
                normalize_embeddings=True
            ).tolist()
            
            english_query_embedding = embedding_model.encode(
                f"query: {translated_query}", 
                normalize_embeddings=True
            ).tolist()
            
            logger.info("Generated multilingual query embeddings successfully")
        except Exception as e:
            logger.error(f"Error creating query embeddings: {e}")
            raise HTTPException(status_code=500, detail="Error processing query embeddings")
        
        # Step 4: Search Elasticsearch for relevant chunks using both embeddings
        try:
            # Enhanced search query with multilingual support
            search_body = {
                "size": 10,  # Get more results for better multilingual matching
                "query": {
                    "bool": {
                        "should": [
                            # Match scheme name
                            {
                                "multi_match": {
                                    "query": scheme_name,
                                    "fields": ["scheme_name^2", "text", "english_text"],
                                    "type": "best_fields",
                                    "boost": 2.0
                                }
                            },
                            # Vector similarity on original embedding
                            {
                                "script_score": {
                                    "query": {"match_all": {}},
                                    "script": {
                                        "source": "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
                                        "params": {"query_vector": original_query_embedding}
                                    },
                                    "boost": 1.5
                                }
                            },
                            # Vector similarity on English embedding
                            {
                                "script_score": {
                                    "query": {"match_all": {}},
                                    "script": {
                                        "source": "cosineSimilarity(params.query_vector, 'english_embedding') + 1.0",
                                        "params": {"query_vector": english_query_embedding}
                                    },
                                    "boost": 1.8  # Higher boost for English embeddings
                                }
                            }
                        ],
                        "minimum_should_match": 1
                    }
                },
                "_source": ["text", "english_text", "chunk_id", "scheme_name", "document_id", "language"]
            }
            
            logger.info(f"Searching for multilingual chunks related to scheme: {scheme_name}")
            response = es_client.search(index="haqdarshak", body=search_body)
            
            # Process and deduplicate results
            retrieved_chunks = []
            seen_chunk_ids = set()
            
            for hit in response['hits']['hits']:
                chunk_id = f"{hit['_source']['document_id']}_{hit['_source']['chunk_id']}"
                if chunk_id not in seen_chunk_ids:
                    seen_chunk_ids.add(chunk_id)
                    retrieved_chunks.append({
                        "text": hit['_source']['text'],
                        "english_text": hit['_source'].get('english_text', hit['_source']['text']),
                        "chunk_id": hit['_source']['chunk_id'],
                        "language": hit['_source'].get('language', 'en-IN'),
                        "score": hit['_score']
                    })
            
            # Sort by score and take top 5
            retrieved_chunks = sorted(retrieved_chunks, key=lambda x: x['score'], reverse=True)[:5]
            logger.info(f"Retrieved {len(retrieved_chunks)} unique multilingual chunks from Elasticsearch")
            
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
                        {
                            "text": chunk, 
                            "english_text": chunk,
                            "chunk_id": i, 
                            "language": "en-IN",
                            "score": 1.0
                        }
                        for i, chunk in enumerate(chunks[:5])  # Take first 5 chunks
                    ]
                else:
                    retrieved_chunks = []
            except Exception as fallback_error:
                logger.error(f"Fallback search also failed: {fallback_error}")
                retrieved_chunks = []
        
        # Step 5: Generate response using retrieved chunks
        if not retrieved_chunks:
            response_text = f"I couldn't find specific information about {scheme_name}. Please make sure the scheme name is correct or try uploading the relevant document first."
            
            # Translate response back to original language
            if original_language != 'en-IN':
                response_text = translation_service.translate_from_english(response_text, original_language)
            
            return RAGResponse(
                success=False,
                message=f"No information found for scheme: {scheme_name}",
                scheme_name=scheme_name,
                response=response_text,
                retrieved_chunks=[],
                detected_language=detected_language,
                translated_query=translated_query
            )
        
        # Prepare context from retrieved chunks (use English text for consistency)
        context = "\n\n".join([chunk['english_text'] for chunk in retrieved_chunks])
        
        # Enhanced response generation prompt with multilingual awareness
        response_prompt = """
        You are a helpful chatbot answering questions about government schemes. 
        Use the following context to answer the user's query accurately and concisely in English.
        The user's original query was in a different language, but provide your answer in clear English first.
        
        Context:
        {context}
        
        Original User Query: {original_query}
        Translated Query: {translated_query}
        
        Provide a comprehensive answer based on the context. If the context doesn't contain enough information, 
        provide what information is available and suggest clarifying the query:
        """
        
        response_text = "No relevant information found. Please clarify your query or specify the correct scheme."
        try:
            prompt = response_prompt.format(
                context=context,
                original_query=query.query,
                translated_query=translated_query
            )
            response = gemini_model.generate_content(prompt)
            response_text = response.text.strip()
            logger.info("Generated English response successfully")
            
            # Translate response back to original language if needed
            if original_language != 'en-IN':
                logger.info(f"Translating response back to {original_language}")
                response_text = translation_service.translate_from_english(response_text, original_language)
                logger.info("Response translated back successfully")
                
        except Exception as e:
            logger.error(f"Error generating response with Gemini API: {e}")
            error_response = f"I found information about {scheme_name}, but I'm having trouble generating a response right now. Please try again."
            
            # Translate error response back to original language
            if original_language != 'en-IN':
                error_response = translation_service.translate_from_english(error_response, original_language)
            response_text = error_response
        
        return RAGResponse(
            success=True,
            message="Multilingual query processed successfully",
            scheme_name=scheme_name,
            response=response_text,
            retrieved_chunks=retrieved_chunks,
            detected_language=detected_language,
            translated_query=translated_query
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error processing multilingual RAG query: {e}")
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

@app.get("/supported-languages")
async def get_supported_languages():
    """
    Get list of supported languages for translation
    """
    return {
        "success": True,
        "supported_languages": list(LANGUAGE_CODE_MAPPING.keys()),
        "language_mapping": LANGUAGE_CODE_MAPPING
    }

@app.post("/translate")
async def translate_text(text: str, source_lang: str, target_lang: str):
    """
    Direct translation endpoint for testing
    """
    try:
        source_lang = LANGUAGE_CODE_MAPPING.get(source_lang, source_lang)
        target_lang = LANGUAGE_CODE_MAPPING.get(target_lang, target_lang)
        
        translated = translation_service.translate_text(text, source_lang, target_lang)
        return {
            "success": True,
            "original_text": text,
            "translated_text": translated,
            "source_language": source_lang,
            "target_language": target_lang
        }
    except Exception as e:
        logger.error(f"Translation error: {e}")
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")

async def regenerate_embeddings_for_scheme(scheme_name: str, updated_content: str, document_id: str):
    """Regenerate embeddings for updated scheme content."""
    
    try:
        logger.info(f"Regenerating embeddings for scheme: {scheme_name}")
        
        # Delete existing embeddings for this document from Elasticsearch
        try:
            delete_query = {
                "query": {
                    "term": {
                        "document_id": document_id
                    }
                }
            }
            es_client.delete_by_query(index="haqdarshak", body=delete_query)
            logger.info(f"Deleted existing embeddings for document: {document_id}")
        except Exception as delete_error:
            logger.warning(f"Error deleting existing embeddings: {delete_error}")
        
        # Create new chunks from updated content
        text_chunks = pdf_processor.chunk_text_custom(updated_content, max_length=400)
        logger.info(f"Generated {len(text_chunks)} new chunks for updated content")
        
        # Create new embeddings
        embeddings_data = pdf_processor.create_embeddings_multilingual(text_chunks)
        logger.info(f"Created {len(embeddings_data)} new multilingual embeddings")
        
        # Store new embeddings in Elasticsearch
        pdf_processor.store_embeddings_in_elasticsearch(embeddings_data, document_id, scheme_name)
        logger.info(f"Successfully stored new embeddings in Elasticsearch for scheme: {scheme_name}")
        
        # Update chunk count in MongoDB
        markdown_collection.update_one(
            {"_id": ObjectId(document_id)},
            {"$set": {"chunks_count": len(text_chunks)}}
        )
        
    except Exception as e:
        logger.error(f"Error regenerating embeddings for scheme {scheme_name}: {e}")
        raise e

# Add this endpoint to manually trigger markdown update (for testing/admin use)
@app.post("/admin/update-scheme-content/{scheme_name}")
async def manually_update_scheme_content(scheme_name: str):
    """Manually trigger markdown update and embedding regeneration for a scheme."""
    try:
        success = await update_markdown_with_posts_and_embeddings(scheme_name)
        if success:
            return {
                "success": True,
                "message": f"Successfully updated content and embeddings for scheme: {scheme_name}"
            }
        else:
            return {
                "success": False,
                "message": f"No updates needed for scheme: {scheme_name}"
            }
    except Exception as e:
        logger.error(f"Error manually updating scheme content: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating scheme content: {str(e)}")

@app.post("/submit-post")
async def submit_post(post: PostRequest):
    try:
        current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y %I:%M %p')
        post_document = {
            "title": post.title,
            "description": post.description,
            "schemeName": post.scheme_name,  # Make sure this matches your PostRequest model
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

@app.post("/approve-post")
async def approve_post(approval: PostApproval):
    try:
        from bson import ObjectId
        current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y %I:%M %p')
        
        # Get the post first to check current status
        post = posts_collection.find_one({"_id": ObjectId(approval.post_id)})
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        
        # Update post status
        result = posts_collection.update_one(
            {"_id": ObjectId(approval.post_id)},
            {"$set": {"status": approval.status, "updated_at": current_time}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Post not found")
        
        # Only update markdown if status is changing to approved
        if approval.status == "approved":
            logger.info(f"Updating markdown for approved post: {post['title']}")
            try:
                await update_markdown_with_posts(post["schemeName"])
                logger.info(f"Successfully updated markdown for scheme: {post['schemeName']}")
            except Exception as markdown_error:
                logger.error(f"Error updating markdown: {markdown_error}")
                # Don't fail the approval if markdown update fails
        
        logger.info(f"Post {approval.post_id} {approval.status}")
        return {
            "success": True,
            "message": f"Post {approval.status} successfully"
        }
    except Exception as e:
        logger.error(f"Error approving post: {e}")
        raise HTTPException(status_code=500, detail=f"Error approving post: {str(e)}")

@app.get("/debug/scheme/{scheme_name}")
async def debug_scheme(scheme_name: str):
    try:
        # Check markdown document
        markdown_doc = markdown_collection.find_one({"scheme_name": scheme_name})
        if not markdown_doc:
            markdown_doc = markdown_collection.find_one(
                {"scheme_name": {"$regex": scheme_name, "$options": "i"}}
            )
        
        # Check posts
        posts = list(posts_collection.find(
            {"schemeName": scheme_name, "status": "approved"},
            {"title": 1, "schemeName": 1, "status": 1, "created_at": 1}
        ))
        
        # Check file existence
        file_exists = False
        file_path = None
        if markdown_doc and markdown_doc.get("pdf_filename"):
            doc_filename = Path(markdown_doc["pdf_filename"]).stem
            file_path = PARSED_DIR / f"{doc_filename}-parsed.md"
            file_exists = file_path.exists()
        
        return {
            "scheme_name": scheme_name,
            "markdown_doc_found": markdown_doc is not None,
            "markdown_doc_scheme_name": markdown_doc["scheme_name"] if markdown_doc else None,
            "approved_posts_count": len(posts),
            "posts": posts,
            "processed_post_ids": markdown_doc.get("processed_post_ids", []) if markdown_doc else [],
            "markdown_file_exists": file_exists,
            "markdown_file_path": str(file_path) if file_path else None,
            "content_length": len(markdown_doc["markdown_content"]) if markdown_doc else 0
        }
    except Exception as e:
        logger.error(f"Debug error: {e}")
        return {"error": str(e)}


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
        
        # Check translation service
        translation_status = "configured"
        try:
            test_translation = translation_service.translate_text("test", "en-IN", "hi-IN")
            if test_translation:
                translation_status = "working"
        except:
            translation_status = "error"
        
        return {
            "status": "healthy",
            "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y %I:%M %p'),
            "services": {
                "mongodb": mongo_status,
                "elasticsearch": es_status,
                "gemini": "configured",
                "translation": translation_status,
                "multilingual_support": "enabled"
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
# import requests
# from bson import ObjectId

# # Configure logging
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)

# GEMINI_API_KEY = "AIzaSyDy780rpCWpDX7NKz9oInrjr59dxY0iymE"
# MONGO_URI = "mongodb://127.0.0.1:27017/pdf_ingestion_system"
# HUGGING_FACE_TOKEN ='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'
# EMBEDDING_MODEL_NAME = 'intfloat/multilingual-e5-base'
# UPLOAD_DIR = Path("./uploads")
# PARSED_DIR = Path("./parsed_docs")
# ELASTICSEARCH_URL = "https://my-elasticsearch-project-cff6bd.es.us-central1.gcp.elastic.cloud:443"
# ELASTICSEARCH_API_KEY = "aGdhV3JaZ0JhSEJ0RWhfNnRpQlI6SElfcDQ2dkYwbVgxaW5lSzRGN0Nydw=="
# mongo_uri ='mongodb://127.0.0.1:27017/pdf_ingestion_system'
# SARVAM_API_KEY = 'sk_9hxc0y4c_BPOUXUh2Fc5bbjzk4VLggBd1' 


# # Sarvam AI Configuration for Translation
# SARVAM_TRANSLATE_URL = 'https://api.sarvam.ai/translate'

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
#         verify_certs=False,
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

# # Language mapping for Sarvam AI
# LANGUAGE_CODE_MAPPING = {
#     'hi': 'hi-IN',  # Hindi
#     'hi-IN': 'hi-IN',
#     'en': 'en-IN',  # English
#     'en-IN': 'en-IN',
#     'bn': 'bn-IN',  # Bengali
#     'bn-IN': 'bn-IN',
#     'gu': 'gu-IN',  # Gujarati
#     'gu-IN': 'gu-IN',
#     'kn': 'kn-IN',  # Kannada
#     'kn-IN': 'kn-IN',
#     'ml': 'ml-IN',  # Malayalam
#     'ml-IN': 'ml-IN',
#     'mr': 'mr-IN',  # Marathi
#     'mr-IN': 'mr-IN',
#     'or': 'or-IN',  # Odia
#     'or-IN': 'or-IN',
#     'pa': 'pa-IN',  # Punjabi
#     'pa-IN': 'pa-IN',
#     'ta': 'ta-IN',  # Tamil
#     'ta-IN': 'ta-IN',
#     'te': 'te-IN',  # Telugu
#     'te-IN': 'te-IN',
#     'ur': 'ur-IN',  # Urdu
#     'ur-IN': 'ur-IN'
# }

# # Translation utility class
# class TranslationService:
#     def __init__(self):
#         self.sarvam_api_key = SARVAM_API_KEY
#         self.translate_url = SARVAM_TRANSLATE_URL
        
#     def detect_language(self, text: str) -> str:
#         """
#         Detect language of the text using character analysis and common words
#         """
#         # Simple heuristic-based language detection
#         # Check for Devanagari script (Hindi)
#         hindi_chars = re.findall(r'[\u0900-\u097F]', text)
#         if len(hindi_chars) > len(text) * 0.3:
#             return 'hi-IN'
        
#         # Check for Bengali script
#         bengali_chars = re.findall(r'[\u0980-\u09FF]', text)
#         if len(bengali_chars) > len(text) * 0.3:
#             return 'bn-IN'
            
#         # Check for Telugu script
#         telugu_chars = re.findall(r'[\u0C00-\u0C7F]', text)
#         if len(telugu_chars) > len(text) * 0.3:
#             return 'te-IN'
            
#         # Check for Tamil script
#         tamil_chars = re.findall(r'[\u0B80-\u0BFF]', text)
#         if len(tamil_chars) > len(text) * 0.3:
#             return 'ta-IN'
            
#         # Default to English if no Indic script detected
#         return 'en-IN'
    
#     def translate_text(self, text: str, source_language: str, target_language: str) -> str:
#         """
#         Translate text using Sarvam AI API
#         """
#         try:
#             # Skip translation if source and target are the same
#             if source_language == target_language:
#                 return text
                
#             # Clean text for translation
#             clean_text = text.strip()
#             if not clean_text:
#                 return text
                
#             headers = {
#                 'api-subscription-key': self.sarvam_api_key,
#                 'Content-Type': 'application/json'
#             }
            
#             payload = {
#                 'input': clean_text,
#                 'source_language_code': source_language,
#                 'target_language_code': target_language,
#                 'speaker_gender': 'Male',
#                 'mode': 'formal',
#                 'model': 'mayura:v1',
#                 'enable_preprocessing': True
#             }
            
#             logger.info(f"Translating from {source_language} to {target_language}: {clean_text[:50]}...")
            
#             response = requests.post(self.translate_url, headers=headers, json=payload, timeout=10)
            
#             if response.status_code == 200:
#                 result = response.json()
#                 translated_text = result.get('translated_text', text)
#                 logger.info(f"Translation successful: {translated_text[:50]}...")
#                 return translated_text
#             else:
#                 logger.error(f"Translation API error: {response.status_code} - {response.text}")
#                 return text
                
#         except Exception as e:
#             logger.error(f"Translation error: {e}")
#             return text
    
#     def translate_to_english(self, text: str, source_language: str = None) -> tuple:
#         """
#         Translate text to English for processing
#         Returns (translated_text, detected_language)
#         """
#         if not source_language:
#             source_language = self.detect_language(text)
        
#         if source_language == 'en-IN':
#             return text, source_language
            
#         translated = self.translate_text(text, source_language, 'en-IN')
#         return translated, source_language
    
#     def translate_from_english(self, text: str, target_language: str) -> str:
#         """
#         Translate text from English to target language
#         """
#         if target_language == 'en-IN':
#             return text
            
#         return self.translate_text(text, 'en-IN', target_language)

# # Initialize translation service
# translation_service = TranslationService()

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
#     detected_language: Optional[str] = None
#     translated_query: Optional[str] = None

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
    
#     def extract_scheme_name_multilingual(self, chunks: List[str]) -> Optional[str]:
#         """
#         Enhanced scheme name extraction supporting multilingual content
#         """
#         example_schemes = [
#             "Sukanya Samriddhi Account Scheme",
#             "Pradhan Mantri Awas Yojana", 
#             "Ayushman Bharat",
#             "Pradhan Mantri Kisan Samman Nidhi",
#             "Atal Pension Yojana",
#             "National Pension System",
#             "सुकन्या समृद्धि खाता योजना",
#             "प्रधानमंत्री आवास योजना",
#             "आयुष्मान भारत",
#             "प्रधानमंत्री किसान सम्मान निधि"
#         ]
        
#         prompt_template = """
#         You are given a chunk of text from a document that may contain text in English, Hindi, or other Indian languages.
#         Your task is to identify and extract the exact name of the government scheme mentioned in the text.
#         The scheme name is a proper noun or specific title.
        
#         Common scheme examples:
#         {examples}
        
#         If no scheme name is found, return "null".
#         Provide only the scheme name as a string, or "null" if not found.
#         Extract the scheme name in its original language format.

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
    
#     def create_embeddings_multilingual(self, chunks: List[str]) -> List[Dict]:
#         """
#         Create embeddings for multilingual chunks
#         """
#         embeddings_data = []
#         for i, chunk_text in enumerate(chunks):
#             chunk_text = self.clean_text(chunk_text)
#             if not chunk_text.strip():
#                 continue
#             try:
#                 # Create embedding for original text
#                 embedding = embedding_model.encode(
#                     f"passage: {chunk_text}", 
#                     normalize_embeddings=True
#                 ).tolist()
                
#                 # Detect language
#                 detected_lang = translation_service.detect_language(chunk_text)
                
#                 # Create English translation embedding if not already in English
#                 english_text = chunk_text
#                 english_embedding = embedding
                
#                 if detected_lang != 'en-IN':
#                     try:
#                         english_text = translation_service.translate_text(chunk_text, detected_lang, 'en-IN')
#                         english_embedding = embedding_model.encode(
#                             f"passage: {english_text}", 
#                             normalize_embeddings=True
#                         ).tolist()
#                     except Exception as e:
#                         logger.error(f"Error translating chunk {i} to English: {e}")
                
#                 embeddings_data.append({
#                     'chunk_id': i,
#                     'text': chunk_text,
#                     'english_text': english_text,
#                     'embedding': embedding,
#                     'english_embedding': english_embedding,
#                     'language': detected_lang
#                 })
                
#             except Exception as e:
#                 logger.error(f"Error creating embedding for chunk {i}: {e}")
#                 continue
#         return embeddings_data
    
#     def ensure_elasticsearch_index(self):
#         index_name = "haqdarshak"
#         try:
#             if not es_client.indices.exists(index=index_name):
#                 logger.info(f"Creating index: {index_name}")
#                 mapping = {
#                     "mappings": {
#                         "properties": {
#                             "document_id": {"type": "keyword"},
#                             "scheme_name": {"type": "text"},
#                             "chunk_id": {"type": "integer"},
#                             "text": {"type": "text"},
#                             "english_text": {"type": "text"},
#                             "embedding": {
#                                 "type": "dense_vector",
#                                 "dims": 768
#                             },
#                             "english_embedding": {
#                                 "type": "dense_vector",
#                                 "dims": 768
#                             },
#                             "language": {"type": "keyword"},
#                             "created_at": {"type": "date"}
#                         }
#                     }
#                 }
#                 es_client.indices.create(index=index_name, body=mapping)
#                 logger.info(f"Created Elasticsearch index: {index_name} with multilingual mapping")
#             else:
#                 logger.info(f"Index {index_name} already exists")
#         except Exception as e:
#             logger.error(f"Error creating or checking Elasticsearch index {index_name}: {e}")
#             raise
    
#     def store_embeddings_in_elasticsearch(self, embeddings_data: List[Dict], document_id: str, scheme_name: str):
#         try:
#             self.ensure_elasticsearch_index()
#             index_name = "haqdarshak"
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
#                         "english_text": embedding_data['english_text'],
#                         "embedding": embedding_data['embedding'],
#                         "english_embedding": embedding_data['english_embedding'],
#                         "language": embedding_data['language'],
#                         "created_at": current_time
#                     }
#                 }
#                 for embedding_data in embeddings_data
#             ]
#             if actions:
#                 response = bulk(es_client, actions)
#                 logger.info(f"Stored {response[0]} multilingual embeddings in Elasticsearch")
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
        
#         markdown_content = ""
#         with open(file_path.with_suffix('.md'), 'w', encoding='utf-8') as temp_md:
#             result.document.save_as_markdown(temp_md.name, image_mode=ImageRefMode.REFERENCED)
        
#         with open(file_path.with_suffix('.md'), 'r', encoding='utf-8') as f:
#             markdown_content = f.read()
        
#         markdown_content = pdf_processor.remove_base64_images(markdown_content)
#         markdown_content = pdf_processor.clean_text(markdown_content)
        
#         text_chunks = pdf_processor.chunk_text_custom(markdown_content, max_length=400)
#         logger.info(f"Generated {len(text_chunks)} chunks from document")
        
#         scheme_name = pdf_processor.extract_scheme_name_multilingual(text_chunks)
#         if not scheme_name:
#             logger.warning("No scheme name found in the document")
#             scheme_name = "Unknown Scheme"
        
#         # Use consistent filename based on scheme_name
#         safe_scheme_name = scheme_name.replace(' ', '_').replace('/', '_').replace('\\', '_')
#         md_filename = PARSED_DIR / f"{safe_scheme_name}-parsed.md"
        
#         with open(md_filename, 'w', encoding='utf-8') as f:
#             f.write(markdown_content)
#         logger.info(f"Cleaned markdown saved to: {md_filename}")
        
#         current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y')
        
#         existing_doc = markdown_collection.find_one({"scheme_name": scheme_name})
        
#         post_content = ""
#         approved_posts = []
#         appended_posts_ids = []
#         updated_content = markdown_content
#         text_chunks = pdf_processor.chunk_text_custom(updated_content, max_length=400)
#         embeddings_data = pdf_processor.create_embeddings_multilingual(text_chunks)
#         logger.info(f"Created {len(embeddings_data)} multilingual embeddings")
#         chunks_count = len(text_chunks)
        
#         if existing_doc:
#             document_id = str(existing_doc["_id"])
            
#             # Get all current approved posts
#             approved_posts = list(posts_collection.find(
#                 {"schemeName": scheme_name, "status": "approved"},
#                 {"title": 1, "description": 1, "schemeName": 1, "created_at": 1, "_id": 1}
#             ))
            
#             appended_posts_ids = [post["_id"] for post in approved_posts]
            
#             for post in approved_posts:
#                 post_text = f"""\n\n## User Post: {post['title']}\n\n**Scheme Name:** {post['schemeName']}\n\n**Description:** {post['description']}\n\n**Posted on:** {post['created_at']}\n\n---\n"""
#                 post_content += post_text
            
#             updated_content = markdown_content + post_content
            
#             with open(md_filename, 'w', encoding='utf-8') as f:
#                 f.write(updated_content)
            
#             text_chunks = pdf_processor.chunk_text_custom(updated_content, max_length=400)
#             embeddings_data = pdf_processor.create_embeddings_multilingual(text_chunks)
#             chunks_count = len(text_chunks)
            
#             # Delete old embeddings
#             es_client.delete_by_query(
#                 index="haqdarshak",
#                 body={"query": {"term": {"document_id": document_id}}}
#             )
            
#             markdown_collection.update_one(
#                 {"_id": existing_doc["_id"]},
#                 {"$set": {
#                     "markdown_content": updated_content,
#                     "pdf_filename": file.filename,
#                     "updated_at": current_time,
#                     "chunks_count": chunks_count,
#                     "appended_posts": appended_posts_ids
#                 }}
#             )
#             logger.info(f"Updated existing document with ID: {document_id}")
#         else:
#             document = {
#                 "pdf_filename": file.filename,
#                 "markdown_content": updated_content,
#                 "scheme_name": scheme_name,
#                 "created_at": current_time,
#                 "updated_at": current_time,
#                 "chunks_count": chunks_count,
#                 "appended_posts": appended_posts_ids
#             }
#             result_id = markdown_collection.insert_one(document).inserted_id
#             document_id = str(result_id)
#             logger.info(f"Stored new document with ID: {document_id}")
        
#         pdf_processor.store_embeddings_in_elasticsearch(embeddings_data, document_id, scheme_name)
        
#         # Clean up uploaded file
#         if file_path and file_path.exists():
#             os.remove(file_path)
        
#         return PDFProcessResponse(
#             success=True,
#             message="PDF processed successfully with multilingual support",
#             scheme_name=scheme_name,
#             document_id=document_id,
#             chunks_processed=chunks_count
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
#     """Update markdown content with approved posts."""
    
#     try:
#         # Find the markdown document
#         markdown_doc = markdown_collection.find_one({"scheme_name": scheme_name})
        
#         if not markdown_doc:
#             logger.warning(f"No markdown document found for scheme: {scheme_name}")
#             return
        
#         if "appended_posts" not in markdown_doc:
#             markdown_collection.update_one({"_id": markdown_doc["_id"]}, {"$set": {"appended_posts": []}})
#             markdown_doc["appended_posts"] = []
        
#         appended_posts_ids = markdown_doc["appended_posts"]
        
#         # Get new approved posts for this scheme that haven't been appended yet
#         new_posts = list(posts_collection.find(
#             {"schemeName": scheme_name, "status": "approved", "_id": {"$nin": appended_posts_ids}},
#             {"title": 1, "description": 1, "schemeName": 1, "created_at": 1}
#         ))
        
#         if not new_posts:
#             logger.info(f"No new approved posts found for scheme: {scheme_name}")
#             return
        
#         # Build post content
#         post_content = ""
#         for post in new_posts:
#             post_text = f"""\n\n## User Post: {post['title']}\n\n**Scheme Name:** {post['schemeName']}\n\n**Description:** {post['description']}\n\n**Posted on:** {post['created_at']}\n\n---\n"""
#             post_content += post_text
        
#         # Update markdown content
#         updated_content = markdown_doc["markdown_content"] + post_content
#         current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y')
        
#         # Append to physical file
#         safe_scheme_name = scheme_name.replace(' ', '_').replace('/', '_').replace('\\', '_')
#         md_filename = PARSED_DIR / f"{safe_scheme_name}-parsed.md"
#         with open(md_filename, 'a', encoding='utf-8') as f:
#             f.write(post_content)
        
#         # Process new content for chunks and embeddings
#         new_text_chunks = pdf_processor.chunk_text_custom(post_content, max_length=400)
#         new_embeddings_data = pdf_processor.create_embeddings_multilingual(new_text_chunks)
        
#         current_chunks_count = markdown_doc.get("chunks_count", 0)
        
#         for i, emb in enumerate(new_embeddings_data):
#             emb["chunk_id"] = current_chunks_count + i
        
#         pdf_processor.store_embeddings_in_elasticsearch(new_embeddings_data, str(markdown_doc["_id"]), scheme_name)
        
#         # Update mongo
#         markdown_collection.update_one(
#             {"_id": markdown_doc["_id"]},
#             {
#                 "$set": {
#                     "markdown_content": updated_content,
#                     "updated_at": current_time,
#                     "chunks_count": current_chunks_count + len(new_text_chunks)
#                 },
#                 "$push": {
#                     "appended_posts": {"$each": [post["_id"] for post in new_posts]}
#                 }
#             }
#         )
        
#         logger.info(f"Updated markdown with {len(new_posts)} new posts for scheme: {scheme_name}")
        
#     except Exception as e:
#         logger.error(f"Error updating markdown with posts: {e}")

# @app.post("/rag-query", response_model=RAGResponse)
# async def rag_query(query: QueryRequest):
#     try:
#         logger.info(f"Processing multilingual RAG query: {query.query}")
        
#         # Step 1: Detect language and translate query to English
#         detected_language = translation_service.detect_language(query.query)
#         logger.info(f"Detected language: {detected_language}")
        
#         # Translate query to English for processing
#         translated_query, original_language = translation_service.translate_to_english(query.query, detected_language)
#         logger.info(f"Translated query: {translated_query}")
        
#         # Step 2: Extract scheme name from translated query
#         example_schemes = [
#             "Sukanya Samriddhi Account Scheme",
#             "Pradhan Mantri Awas Yojana",
#             "Ayushman Bharat",
#             "Pradhan Mantri Kisan Samman Nidhi",
#             "Atal Pension Yojana",
#             "National Pension System"
#         ]
        
#         scheme_prompt = """
#         You are given a user query in English about government schemes.
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
#             prompt = scheme_prompt.format(query=translated_query, examples="\n- " + "\n- ".join(example_schemes))
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
#             response_text = "Please specify the scheme name in your query."
#             # Translate response back to original language
#             if original_language != 'en-IN':
#                 response_text = translation_service.translate_from_english(response_text, original_language)
            
#             return RAGResponse(
#                 success=False,
#                 message="No scheme name found plz try to include the name of Relevant Scheme accroding to your Query for a better response",
#                 scheme_name=None,
#                 response=response_text,
#                 retrieved_chunks=[],
#                 detected_language=detected_language,
#                 translated_query=translated_query
#             )
        
#         # Step 3: Convert query to vector embedding (using both original and translated)
#         try:
#             # Create embeddings for both original and English query
#             original_query_embedding = embedding_model.encode(
#                 f"query: {query.query}", 
#                 normalize_embeddings=True
#             ).tolist()
            
#             english_query_embedding = embedding_model.encode(
#                 f"query: {translated_query}", 
#                 normalize_embeddings=True
#             ).tolist()
            
#             logger.info("Generated multilingual query embeddings successfully")
#         except Exception as e:
#             logger.error(f"Error creating query embeddings: {e}")
#             raise HTTPException(status_code=500, detail="Error processing query embeddings")
        
#         # Step 4: Search Elasticsearch for relevant chunks using both embeddings
#         try:
#             # Enhanced search query with multilingual support
#             search_body = {
#                 "size": 10,  # Get more results for better multilingual matching
#                 "query": {
#                     "bool": {
#                         "should": [
#                             # Match scheme name
#                             {
#                                 "multi_match": {
#                                     "query": scheme_name,
#                                     "fields": ["scheme_name^2", "text", "english_text"],
#                                     "type": "best_fields",
#                                     "boost": 2.0
#                                 }
#                             },
#                             # Vector similarity on original embedding
#                             {
#                                 "script_score": {
#                                     "query": {"match_all": {}},
#                                     "script": {
#                                         "source": "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
#                                         "params": {"query_vector": original_query_embedding}
#                                     },
#                                     "boost": 1.5
#                                 }
#                             },
#                             # Vector similarity on English embedding
#                             {
#                                 "script_score": {
#                                     "query": {"match_all": {}},
#                                     "script": {
#                                         "source": "cosineSimilarity(params.query_vector, 'english_embedding') + 1.0",
#                                         "params": {"query_vector": english_query_embedding}
#                                     },
#                                     "boost": 1.8  # Higher boost for English embeddings
#                                 }
#                             }
#                         ],
#                         "minimum_should_match": 1
#                     }
#                 },
#                 "_source": ["text", "english_text", "chunk_id", "scheme_name", "document_id", "language"]
#             }
            
#             logger.info(f"Searching for multilingual chunks related to scheme: {scheme_name}")
#             response = es_client.search(index="haqdarshak", body=search_body)
            
#             # Process and deduplicate results
#             retrieved_chunks = []
#             seen_chunk_ids = set()
            
#             for hit in response['hits']['hits']:
#                 chunk_id = f"{hit['_source']['document_id']}_{hit['_source']['chunk_id']}"
#                 if chunk_id not in seen_chunk_ids:
#                     seen_chunk_ids.add(chunk_id)
#                     retrieved_chunks.append({
#                         "text": hit['_source']['text'],
#                         "english_text": hit['_source'].get('english_text', hit['_source']['text']),
#                         "chunk_id": hit['_source']['chunk_id'],
#                         "language": hit['_source'].get('language', 'en-IN'),
#                         "score": hit['_score']
#                     })
            
#             # Sort by score and take top 5
#             retrieved_chunks = sorted(retrieved_chunks, key=lambda x: x['score'], reverse=True)[:5]
#             logger.info(f"Retrieved {len(retrieved_chunks)} unique multilingual chunks from Elasticsearch")
            
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
#                         {
#                             "text": chunk, 
#                             "english_text": chunk,
#                             "chunk_id": i, 
#                             "language": "en-IN",
#                             "score": 1.0
#                         }
#                         for i, chunk in enumerate(chunks[:5])  # Take first 5 chunks
#                     ]
#                 else:
#                     retrieved_chunks = []
#             except Exception as fallback_error:
#                 logger.error(f"Fallback search also failed: {fallback_error}")
#                 retrieved_chunks = []
        
#         # Step 5: Generate response using retrieved chunks
#         if not retrieved_chunks:
#             response_text = f"I couldn't find specific information about {scheme_name}. Please make sure the scheme name is correct or try uploading the relevant document first."
            
#             # Translate response back to original language
#             if original_language != 'en-IN':
#                 response_text = translation_service.translate_from_english(response_text, original_language)
            
#             return RAGResponse(
#                 success=False,
#                 message=f"No information found for scheme: {scheme_name}",
#                 scheme_name=scheme_name,
#                 response=response_text,
#                 retrieved_chunks=[],
#                 detected_language=detected_language,
#                 translated_query=translated_query
#             )
        
#         # Prepare context from retrieved chunks (use English text for consistency)
#         context = "\n\n".join([chunk['english_text'] for chunk in retrieved_chunks])
        
#         # Enhanced response generation prompt with multilingual awareness
#         response_prompt = """
#         You are a helpful chatbot answering questions about government schemes. 
#         Use the following context to answer the user's query accurately and concisely in English.
#         The user's original query was in a different language, but provide your answer in clear English first.
        
#         Context:
#         {context}
        
#         Original User Query: {original_query}
#         Translated Query: {translated_query}
        
#         Provide a comprehensive answer based on the context. If the context doesn't contain enough information, 
#         provide what information is available and suggest clarifying the query:
#         """
        
#         response_text = "No relevant information found. Please clarify your query or specify the correct scheme."
#         try:
#             prompt = response_prompt.format(
#                 context=context,
#                 original_query=query.query,
#                 translated_query=translated_query
#             )
#             response = gemini_model.generate_content(prompt)
#             response_text = response.text.strip()
#             logger.info("Generated English response successfully")
            
#             # Translate response back to original language if needed
#             if original_language != 'en-IN':
#                 logger.info(f"Translating response back to {original_language}")
#                 response_text = translation_service.translate_from_english(response_text, original_language)
#                 logger.info("Response translated back successfully")
                
#         except Exception as e:
#             logger.error(f"Error generating response with Gemini API: {e}")
#             error_response = f"I found information about {scheme_name}, but I'm having trouble generating a response right now. Please try again."
            
#             # Translate error response back to original language
#             if original_language != 'en-IN':
#                 error_response = translation_service.translate_from_english(error_response, original_language)
#             response_text = error_response
        
#         return RAGResponse(
#             success=True,
#             message="Multilingual query processed successfully",
#             scheme_name=scheme_name,
#             response=response_text,
#             retrieved_chunks=retrieved_chunks,
#             detected_language=detected_language,
#             translated_query=translated_query
#         )
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"Unexpected error processing multilingual RAG query: {e}")
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

# @app.get("/supported-languages")
# async def get_supported_languages():
#     """
#     Get list of supported languages for translation
#     """
#     return {
#         "success": True,
#         "supported_languages": list(LANGUAGE_CODE_MAPPING.keys()),
#         "language_mapping": LANGUAGE_CODE_MAPPING
#     }

# @app.post("/translate")
# async def translate_text(text: str, source_lang: str, target_lang: str):
#     """
#     Direct translation endpoint for testing
#     """
#     try:
#         source_lang = LANGUAGE_CODE_MAPPING.get(source_lang, source_lang)
#         target_lang = LANGUAGE_CODE_MAPPING.get(target_lang, target_lang)
        
#         translated = translation_service.translate_text(text, source_lang, target_lang)
#         return {
#             "success": True,
#             "original_text": text,
#             "translated_text": translated,
#             "source_language": source_lang,
#             "target_language": target_lang
#         }
#     except Exception as e:
#         logger.error(f"Translation error: {e}")
#         raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")

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
        
#         # Check translation service
#         translation_status = "configured"
#         try:
#             test_translation = translation_service.translate_text("test", "en-IN", "hi-IN")
#             if test_translation:
#                 translation_status = "working"
#         except:
#             translation_status = "error"
        
#         return {
#             "status": "healthy",
#             "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%d %B %Y %I:%M %p'),
#             "services": {
#                 "mongodb": mongo_status,
#                 "elasticsearch": es_status,
#                 "gemini": "configured",
#                 "translation": translation_status,
#                 "multilingual_support": "enabled"
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