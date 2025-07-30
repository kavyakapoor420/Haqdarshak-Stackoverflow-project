import logging
from pathlib import Path
from config.settings import SOURCE, pipeline_options, output_dir
from pipeline.document_converter import convert_document
from utils.text_cleaner import clean_ocr_text
from utils.image_processor import process_base64_images
from utils.scheme_extractor import extract_scheme_name
from database.mongo_handler import store_in_mongodb, close_mongo_connection
from docling.chunking import HybridChunker

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
_log = logging.getLogger(__name__)

def main():
    # Convert PDF to markdown
    try:
        result = convert_document(SOURCE, pipeline_options)
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

    # Save markdown with embedded images
    doc_filename = Path(SOURCE).stem
    md_filename = output_dir / f"{doc_filename}-with-images.md"
    try:
        result.document.save_as_markdown(md_filename, image_mode="EMBEDDED")
        _log.info(f"Markdown content has been saved to {md_filename}")
    except Exception as e:
        _log.error(f"Error saving markdown: {e}")
        exit(1)

    # Read and clean markdown content
    try:
        with open(md_filename, 'r', encoding='utf-8') as f:
            markdown_content = f.read()
        markdown_content = clean_ocr_text(markdown_content)
        _log.debug(f"Cleaned markdown content (first 500 chars): {markdown_content[:500]}")
        _log.debug(f"Total length of markdown content: {len(markdown_content)} characters")
    except Exception as e:
        _log.error(f"Error reading markdown file: {e}")
        exit(1)

    # Process images
    image_dir = output_dir / 'images'
    markdown_content = process_base64_images(markdown_content, image_dir, doc_filename)

    # Chunk document
    chunker = HybridChunker(max_chunk_size=1000, min_chunk_size=200)
    try:
        chunks = list(chunker.chunk(dl_doc=result.document))
        _log.info(f"Generated {len(chunks)} chunks from document")
    except Exception as e:
        _log.error(f"Error during chunking: {e}")
        exit(1)

    # Extract scheme name
    scheme_name = extract_scheme_name(chunks)
    if scheme_name:
        _log.info(f"Extracted scheme name: {scheme_name}")
    else:
        _log.warning("No scheme name found in the document")

    # Save scheme name to file
    output_result_file = output_dir / f"{doc_filename}-scheme-name.txt"
    try:
        with open(output_result_file, 'w', encoding='utf-8') as f:
            f.write(scheme_name if scheme_name else "No scheme name found")
        _log.info(f"Scheme name result saved to {output_result_file}")
    except Exception as e:
        _log.error(f"Error saving scheme name result: {e}")

    # Store in MongoDB
    try:
        store_in_mongodb(SOURCE, markdown_content, scheme_name)
    except Exception as e:
        _log.error(f"Error storing data in MongoDB: {e}")
        exit(1)

    # Close MongoDB connection
    try:
        close_mongo_connection()
        _log.info("Closed MongoDB connection")
    except Exception as e:
        _log.error(f"Error closing MongoDB connection: {e}")

if __name__ == "__main__":
    main()