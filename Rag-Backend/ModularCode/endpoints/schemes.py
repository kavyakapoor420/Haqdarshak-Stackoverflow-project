from fastapi import APIRouter, HTTPException
from database import markdown_collection, posts_collection
from utils import logger

router = APIRouter()

@router.get("/schemes")
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

@router.get("/scheme/{scheme_name}")
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
