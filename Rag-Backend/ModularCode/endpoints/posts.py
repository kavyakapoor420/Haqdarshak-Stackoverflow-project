from fastapi import APIRouter, HTTPException
from datetime import datetime
import pytz
from bson import ObjectId
from database import posts_collection, markdown_collection
from models import PostRequest, PostApproval
from utils import logger

router = APIRouter()

@router.post("/submit-post")
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

@router.get("/pending-posts")
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

@router.post("/approve-post")
async def approve_post(approval: PostApproval):
    try:
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
