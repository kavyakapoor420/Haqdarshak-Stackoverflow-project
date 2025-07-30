from pymongo import MongoClient 
from pymongo.errors import ConnectionFailure 
from datetime import datetime 
import pytz
import logging 
from config.settings import mongo_uri 

_log=logging.getLogger(__name__)

def store_in_mongoDb(pdf_filename:str,markdown_content:str,scheme_name:str):
    """"store document in mongodb"""
    try:
        client=MongoClient(mongo_uri)
        db=client['Markdown-parsed']
        collection=db['markdown_files']
        client.list_database_names() # Check connection

        _log.info('connected to MongoDB successfully')

        current_time=datetime.now(pytz.timezone("Asia/Kolkata")).isoformat()

        document={
            "pdf_filename":str(pdf_filename),
            "markdown_content":markdown_content,
            "scheme_name":scheme_name if scheme_name else "No scheme found",
            "created_at":current_time,
            "updated_at":current_time
        }

        _log.debug(f'document to be stored in mongoDB its first 1000 characters are :{document['markdown_content'][:1000]}')
        _log.debug(f"total length of markdown content is {len(document['markdown_content'])}")

        result_id=collection.insert_one(document).inserted_id ;
        _log.info(f'stored markdown content and scheme name in MongoDB with ID:{result_id}')

        stored_doc=collection.find_one({"_id":result_id})
        _log.debug(f"retrieved document from MongoDB (first 1000 character ): {stored_doc['markdown_content']}")

        return client 

    except ConnectionFailure as e:
        _log.error(f"failed to connect to MongoDB:{e}")
        raise 
    except Exception as e:
        _log.error(f"error stroing data in MongoDB:{e}")
        raise 


def close_mongo_connection(client):
    """close MongoDb connection"""
    try:
        client.close() 
        _log.info('closed mongodb connection')
    except Exception as e:
        _log.error(f"error closing mongodb connection:{e}")