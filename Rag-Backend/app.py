import logging 
import os 
import re
import base64
from pathlib import Path 
from datetime import datetime 
from typing import List,Optional,Dict,Any 
import pytz
import numpy as np
from fastapi import FastAPI , File,UploadFile,HTTPException, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from docling.document_converter import DocumentConverter 
from docling.datamodel.base_models import InputFormat 
from docling.datamodel.pipeline_options import PdfPipelineOptions,TesseractOcrOptions
from docling.chunking import HybridChunking 
from docling_core.types.doc import ImaegRefMode

from google.generativeai import genai 
from sentence_transformers import SentenceTransformer
from pymongo import MongoClient 
from pymongo.errors import ConnectionFailure 


from elasticsearch import Elasticsearch 
from elasticsearch.helpers import bulk
import uvicorn 


#configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

logger=logging.getLogger(__name__)
