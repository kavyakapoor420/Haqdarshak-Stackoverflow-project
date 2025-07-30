from docling.document_converter import DocumentConverter ,PdfFormatOption
from docling.datamodel.base_models import InputFormat 
import logging 

_log=logging.getLogger(__name__)

def convert_document(source:str,pipeline_options):
    """Convert a PDF document using Docling"""
    doc_converter=DocumentConverter(
        format_options={
            InputFormat.PDF:PdfFormatOption(pipeline_options=pipeline_options)
        }
    )
    return doc_converter.convert(source)
