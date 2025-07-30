import logging 
from pathlib import Path 
from docling.chunking import HybridChunker



logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
_log=logging.getLogger(__name__)

def main():
    # convert the pdf into markdown file
    try:
        result=convert_document(SOURCE,pipeline_options)
    except FileNotFoundError :
        _log.error(f'pdf file not found at {SOURCE}')
        exit(1)
    except Exception as e:
        _log.error(f'error during document conversion{e}')
        exit(1)