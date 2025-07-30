from pymongo import MongoClient 
from pymongo.errors import ConnectionFailure
from datetime import datetime 
import pytz 
import logging 
from config.settings import mongo_uri

_log=logging.getLogger(__name__)

def store_in_mongodb(pdf_filename:str,markdown_content:str,scheme_name:str):
    """Store document data in MongoDB"""

    try:
        client=MongoClient(mongo_uri)
        db=client['Markdown-parsed']
        collection=db['markdown_files']
        client.list_database_names() 
        _log.info("connected to MongoDb successfully")

        current_time=datetime.now(pytz.timezone('Asia/Kolkata')).isoformat() 

        document={
            "pdf_filename":str(pdf_filename),
            "markdown_content":markdown_content,
            "scheme_name":scheme_name if scheme_name else "No scheme name found",
            ""
        }


    except ConnectionFailure as e:
    except Exception as e:
