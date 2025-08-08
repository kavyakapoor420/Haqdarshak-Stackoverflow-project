




import logging
from pathlib import Path
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.base_models import InputFormat
from docling.datamodel.pipeline_options import PdfPipelineOptions, TesseractOcrOptions
from docling.chunking import HybridChunker
import google.generativeai as genai
import os
import re
import base64
from typing import List, Optional
from docling_core.types.doc import DoclingDocument, ImageRefMode
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from datetime import datetime
import pytz

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
_log = logging.getLogger(__name__)

# Define constants
SOURCE = "./data/Sukanya Samriddhi Account Scheme 2019 English (1).pdf"
pdf_path = SOURCE  # Define pdf_path as SOURCE

pipeline_options = PdfPipelineOptions(
    do_table_structure=True,
    do_ocr=True,
    ocr_options=TesseractOcrOptions(lang=["eng", "hin"]),
    generate_page_images=True,
    generate_picture_images=True,
    images_scale=3.0,
)

doc_converter = DocumentConverter(
    format_options={
        InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
    }
)

def clean_ocr_text(text: str) -> str:
    """Clean up Unicode escape sequences and glyph IDs from OCR output."""
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

# Connect to MongoDB
mongo_uri = "mongodb://127.0.0.1:27017/Markdown-parsed"
try:
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
    markdown_db = client['Markdown-parsed']  # Database for markdown files
    posts_db = client['postReviewSystem']    # Database for posts
    markdown_collection = markdown_db['markdown_files']
    posts_collection = posts_db['posts']
    client.list_database_names()
    _log.info(f"Connected to MongoDB at {mongo_uri}")
except ConnectionFailure as e:
    _log.error(f"Failed to connect to MongoDB: {e}")
    exit(1)

try:
    result = doc_converter.convert(SOURCE)
    raw_text = result.document.text if hasattr(result.document, 'text') else "No text attribute"
    _log.debug(f"Raw extracted text (first 500 chars): {raw_text[:500]}")
    if hasattr(result.document, 'text'):
        result.document.text = clean_ocr_text(raw_text)
except FileNotFoundError:
    _log.error(f"PDF file not found at {SOURCE}")
    exit(1)
except Exception as e:
    _log.error(f"Error during document conversion: {e}")
    exit(1)

output_dir = Path('parsed-doc')
output_dir.mkdir(parents=True, exist_ok=True)
doc_filename = Path(SOURCE).stem
md_filename = output_dir / f"{doc_filename}-with-images.md"
try:
    result.document.save_as_markdown(md_filename, image_mode=ImageRefMode.EMBEDDED)
    _log.info(f"Markdown content has been saved to {md_filename}")
except Exception as e:
    _log.error(f"Error saving markdown: {e}")
    exit(1)

image_dir = output_dir / 'images'
image_dir.mkdir(parents=True, exist_ok=True)

try:
    with open(md_filename, 'r', encoding='utf-8') as f:
        markdown_content = f.read()
    markdown_content = clean_ocr_text(markdown_content)
    _log.debug(f"Cleaned markdown content (first 500 chars): {markdown_content[:500]}")
    _log.debug(f"Total length of markdown_content: {len(markdown_content)} characters")
except Exception as e:
    _log.error(f"Error reading markdown file: {e}")
    exit(1)

def process_base64_images(content: str, image_dir: Path, doc_filename: str) -> str:
    """Decode base64 images, save them, and update markdown with file references."""
    base64_pattern = r'!\[(.*?)\]\(data:image/(\w+);base64,([^)]+)\)'
    updated_content = content
    image_count = 0
    for match in re.finditer(base64_pattern, content):
        alt_text, image_type, base64_data = match.groups()
        try:
            image_data = base64.b64decode(base64_data)
            image_filename = f"{doc_filename}_image_{image_count}.{image_type}"
            image_path = image_dir / image_filename
            with open(image_path, 'wb') as f:
                f.write(image_data)
            _log.info(f"Saved image to {image_path}")
            relative_image_path = f"images/{image_filename}"
            updated_content = updated_content.replace(match.group(0), f"![{alt_text}]({relative_image_path})")
            image_count += 1
        except Exception as e:
            _log.error(f"Error decoding base64 image {image_count}: {e}")
            continue
    updated_md_filename = output_dir / f"{doc_filename}-with-image-links.md"
    try:
        with open(updated_md_filename, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        _log.info(f"Updated markdown with image links saved to {updated_md_filename}")
    except Exception as e:
        _log.error(f"Error saving updated markdown: {e}")
    return updated_content

markdown_content = process_base64_images(markdown_content, image_dir, doc_filename)

chunker = HybridChunker(max_chunk_size=1000, min_chunk_size=200)
try:
    chunks = list(chunker.chunk(dl_doc=result.document))
    _log.info(f"Generated {len(chunks)} chunks from document")
except Exception as e:
    _log.error(f"Error during chunking: {e}")
    exit(1)

genai.configure(api_key="AIzaSyDy780rpCWpDX7NKz9oInrjr59dxY0iymE")
model = genai.GenerativeModel('gemini-2.0-flash-001')

def extract_scheme_name(chunks: List) -> Optional[str]:
    """Extract scheme name from chunks using Gemini model."""
    prompt_template = """
    You are given a chunk of text from a document that may contain text in English and Hindi. Your task is to identify and extract the exact name of the scheme mentioned in the text. The scheme name is likely to be a proper noun or a specific title, such as "Sukanya Samriddhi Account Scheme" or its Hindi equivalent "सुकन्या समृद्धि खाता योजना". If no scheme name is found in the chunk, return null. Provide only the scheme name as a string, or null if not found.

    Chunk:
    {chunk}

    Output only the scheme name or null:
    """
    for chunk in chunks:
        chunk_text = chunk.text if hasattr(chunk, 'text') else str(chunk)
        chunk_text = clean_ocr_text(chunk_text)
        _log.debug(f"Processing chunk: {chunk_text[:200]}")
        prompt = prompt_template.format(chunk=chunk_text)
        try:
            response = model.generate_content(prompt)
            scheme_name = response.text.strip()
            if scheme_name and scheme_name.lower() != 'null':
                return scheme_name
        except Exception as e:
            _log.error(f"Error processing chunk with Gemini API: {e}")
            continue
    return None

scheme_name = extract_scheme_name(chunks)
if scheme_name:
    _log.info(f"Extracted scheme name: {scheme_name}")
else:
    _log.warning("No scheme name found in the document")

output_result_file = output_dir / f"{doc_filename}-scheme-name.txt"
try:
    with open(output_result_file, 'w', encoding='utf-8') as f:
        f.write(scheme_name if scheme_name else "No scheme name found")
    _log.info(f"Scheme name result saved to {output_result_file}")
except Exception as e:
    _log.error(f"Error saving scheme name result: {e}")

# Store or update markdown content
if scheme_name:
    current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%Y-%m-%d %I:%M %p')
    document = {
        "pdf_filename": pdf_path,
        "markdown_content": markdown_content,
        "scheme_name": scheme_name,
        "created_at": current_time,
        "updated_at": current_time
    }
    _log.debug(f"Document to be stored in MongoDB (first 1000 chars): {document['markdown_content'][:1000]}")
    _log.debug(f"Total length of markdown_content: {len(document['markdown_content'])}")
    
    # Check for existing document and update or insert
    existing_doc = markdown_collection.find_one({"scheme_name": scheme_name})
    if existing_doc:
        result_id = existing_doc["_id"]
        markdown_collection.update_one(
            {"_id": result_id},
            {"$set": {"markdown_content": document["markdown_content"], "pdf_filename": document["pdf_filename"], "updated_at": current_time}}
        )
        _log.info(f"Updated existing document with ID: {result_id}")
    else:
        result_id = markdown_collection.insert_one(document).inserted_id
        _log.info(f"Stored new document with ID: {result_id}")
    
    # Retrieve and verify
    stored_doc = markdown_collection.find_one({"_id": result_id})
    _log.debug(f"Retrieved document from MongoDB (first 1000 chars): {stored_doc['markdown_content'][:1000]}")
    _log.debug(f"Length of retrieved markdown_content: {len(stored_doc['markdown_content'])}")

    # Update with posts and append to markdown file
    def update_markdown_with_posts(scheme_name, inserted_id, updated_md_filename):
        try:
            markdown_doc = markdown_collection.find_one({"_id": inserted_id})
            if not markdown_doc:
                _log.error(f"No markdown document found with ID: {inserted_id}")
                return

            posts = posts_collection.find(
                {"schemeName": scheme_name, "status": "accepted"},
                {"title": 1, "description": 1, "schemeName": 1, "_id": 0}
            )
            posts_list = list(posts)
            if not posts_list:
                _log.info(f"No approved posts found for scheme: {scheme_name}")
                return

            updated_content = markdown_doc["markdown_content"]
            post_content = ""
            for post in posts_list:
                post_text = f"\n\n## User Post: \n\n {post['title']}\n\n**Scheme Name:** {post['schemeName']}\n\n**Description:** {post['description']}\n"
                updated_content += post_text
                post_content += post_text
            
            current_time = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%Y-%m-%d %I:%M %p')
            result = markdown_collection.update_one(
                {"_id": markdown_doc["_id"]},
                {"$set": {"markdown_content": updated_content, "updated_at": current_time}}
            )
            if result.modified_count > 0:
                _log.info(f"Markdown updated with {len(posts_list)} posts for scheme: {scheme_name}")
                # Append post content to the markdown file
                try:
                    with open(updated_md_filename, 'a', encoding='utf-8') as f:
                        f.write(post_content)
                    _log.info(f"Appended {len(posts_list)} posts to {updated_md_filename}")
                except Exception as e:
                    _log.error(f"Error appending posts to markdown file: {e}")
                markdown_doc = markdown_collection.find_one({"_id": markdown_doc["_id"]})
                _log.debug(f"Updated markdown_content (first 500 chars): {markdown_doc['markdown_content'][:500]}")
                _log.debug(f"Last 500 characters of updated markdown_content: {markdown_doc['markdown_content'][-500:]}")
            else:
                _log.warning("No changes made to markdown content")

        except Exception as e:
            _log.error(f"Error updating markdown with posts: {e}")

    # Call the updated function with the markdown filename
    update_markdown_with_posts(scheme_name, result_id, output_dir / f"{doc_filename}-with-image-links.md")

# Define task schedule for daily update
print("Here's the Task Schedule for daily markdown update:")

