from pymongo import MongoClient
from elasticsearch import Elasticsearch
import google.generativeai as genai
from sentence_transformers import SentenceTransformer
from config import *
from utils import logger

# Initialize MongoDB client
try:
    mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = mongo_client['pdf_ingestion_system']
    markdown_collection = db['markdown_files']
    posts_collection = db['posts']
    chats_collection = db['chats']
    logger.info("Connected to MongoDB")
except Exception as e:
    logger.error(f"MongoDB connection error: {e}")
    raise

# Initialize Elasticsearch client
try:
    es_client = Elasticsearch(
        [ELASTICSEARCH_URL],
        api_key=ELASTICSEARCH_API_KEY,
        verify_certs=False,
        request_timeout=30,
        max_retries=3,
        retry_on_timeout=True
    )
    es_info = es_client.info()
    es_version = es_info['version']['number']
    logger.info(f"Connected to Elasticsearch version: {es_version}")
except Exception as e:
    logger.error(f"Elasticsearch connection error: {e}")
    raise

# Initialize Gemini AI
try:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-2.0-flash-001')
    logger.info("Gemini AI initialized")
except Exception as e:
    logger.error(f"Gemini AI initialization error: {e}")
    raise

# Initialize embedding model
try:
    embedding_model = SentenceTransformer(
        EMBEDDING_MODEL_NAME,
        token=HUGGING_FACE_TOKEN
    )
    logger.info("SentenceTransformer initialized")
except Exception as e:
    logger.error(f"Embedding model initialization error: {e}")
    raise
