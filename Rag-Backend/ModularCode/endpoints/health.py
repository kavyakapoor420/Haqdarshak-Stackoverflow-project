from fastapi import APIRouter
from database import mongo_client, es_client
from translation_service import translation_service
from utils import logger
from datetime import datetime
import pytz

router = APIRouter()

@router.get("/health")
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
