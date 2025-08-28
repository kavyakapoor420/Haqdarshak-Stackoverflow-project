from pydantic import BaseModel
from typing import List, Optional, Dict

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


# from pydantic import BaseModel 
# from typing import Optional,List,Dict 

# class PostRequest(BaseModel):
#     title:str
#     description:str 
#     scheme_name:str 

# class PostApproval(BaseModel):
#     post_id:str
#     status:str 

# class QueryRequest(BaseModel):
#      query:str
#      language_code:Optional[str]='en-IN'

# class RAGResponse(BaseModel):
#     success:bool
#     message:str 
#     scheme_name:Optional[str]=None 
#     response:Optional[str]=None 
#     reterieved_chunk:Optional[List[Dict]]=None 
#     detected_language:Optional[str]=None 
#     translated_query:Optional[str]=None 


# class PDFProcessorResponse(BaseModel):
#     success:bool
#     message:str
#     scheme_name:Optional[str]=None 
#     document_id:Optional[str]=None 
#     chunks_processed:Optional[int]=None 