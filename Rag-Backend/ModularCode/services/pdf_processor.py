import re
import os
from datetime import datetime
from pathlib import Path
from typing import List, Optional, Dict
import pytz
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.base_models import InputFormat
from docling.datamodel.pipeline_options import PdfPipelineOptions, TesseractOcrOptions
from docling.chunking import HybridChunker
from docling_core.types.doc import ImageRefMode
from database import gemini_model, es_client, embedding_model, markdown_collection
from translation_service import translation_service
from elasticsearch.helpers import bulk
from config import UPLOAD_DIR, PARSED_DIR
from utils import logger

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

