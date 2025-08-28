import pymongo
from elasticsearch import Elasticsearch
from datetime import datetime, timedelta
import pytz

# MongoDB connection
mongo_client = pymongo.MongoClient("mongodb://127.0.0.1:27017/pdf_ingestion_system")
db = mongo_client['pdf_ingestion_system']
markdown_collection = db['markdown_files']
posts_collection = db['posts']

# Elasticsearch connection
es_client = Elasticsearch(
    ["https://my-elasticsearch-project-cff6bd.es.us-central1.gcp.elastic.cloud:443"],
    api_key="aGdhV3JaZ0JhSEJ0RWhfNnRpQlI6SElfcDQ2dkYwbVgxaW5lSzRGN0Nydw==",
    verify_certs=False
)

def check_updates(scheme_name=None):
    print("=" * 60)
    print("CHECKING MARKDOWN UPDATES")
    print("=" * 60)
    
    # Check MongoDB updates
    if scheme_name:
        query = {"scheme_name": scheme_name}
    else:
        query = {}
    
    markdown_docs = list(markdown_collection.find(
        query,
        {
            "scheme_name": 1,
            "updated_at": 1,
            "last_post_update": 1,
            "chunks_count": 1
        }
    ))
    
    for doc in markdown_docs:
        print(f"Scheme: {doc.get('scheme_name', 'N/A')}")
        print(f"Updated At: {doc.get('updated_at', 'N/A')}")
        print(f"Last Post Update: {doc.get('last_post_update', 'N/A')}")
        print(f"Chunks Count: {doc.get('chunks_count', 'N/A')}")
        
        # Check if content has user posts
        full_doc = markdown_collection.find_one({"_id": doc["_id"]})
        if full_doc and "## User Post:" in full_doc.get("markdown_content", ""):
            print("✅ Contains user posts")
        else:
            print("❌ No user posts found")
        print("-" * 40)
    
    print("\n" + "=" * 60)
    print("CHECKING APPROVED POSTS")
    print("=" * 60)
    
    # Check approved posts
    if scheme_name:
        posts_query = {"schemeName": scheme_name, "status": "approved"}
    else:
        posts_query = {"status": "approved"}
    
    approved_posts = list(posts_collection.find(
        posts_query,
        {"title": 1, "schemeName": 1, "created_at": 1}
    ))
    
    print(f"Total approved posts: {len(approved_posts)}")
    for post in approved_posts:
        print(f"- {post.get('title', 'No title')} (Scheme: {post.get('schemeName', 'N/A')})")
    
    print("\n" + "=" * 60)
    print("CHECKING ELASTICSEARCH EMBEDDINGS")
    print("=" * 60)
    
    # Check Elasticsearch
    try:
        if scheme_name:
            es_query = {
                "query": {"match": {"scheme_name": scheme_name}},
                "size": 0
            }
        else:
            es_query = {"size": 0}
        
        response = es_client.search(index="haqdarshak", body=es_query)
        total_embeddings = response['hits']['total']['value']
        print(f"Total embeddings: {total_embeddings}")
        
        # Check for user post embeddings
        user_post_query = {
            "query": {"match_phrase": {"text": "User Post"}},
            "size": 5,
            "_source": ["scheme_name", "chunk_id", "created_at"]
        }
        
        user_post_response = es_client.search(index="haqdarshak", body=user_post_query)
        user_post_count = user_post_response['hits']['total']['value']
        
        print(f"Embeddings containing user posts: {user_post_count}")
        
        if user_post_count > 0:
            print("Recent user post embeddings:")
            for hit in user_post_response['hits']['hits'][:3]:
                source = hit['_source']
                print(f"- Scheme: {source.get('scheme_name', 'N/A')}, Chunk: {source.get('chunk_id', 'N/A')}")
        
    except Exception as e:
        print(f"Error checking Elasticsearch: {e}")

# Usage examples:
# Check all schemes
check_updates("Sukanya Samriddhi Account Scheme")