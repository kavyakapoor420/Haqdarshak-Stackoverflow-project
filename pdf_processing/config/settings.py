from pathlib import Path 
from docling.datamodel.pipeline_options import PdfPipelineOptions,TesseractOcrOptions

SOURCE = "./data/Sukanya Samriddhi Account Scheme 2019 English (1).pdf"

output_dir=Path('parsed-doc')
output_dir.mkdir(parents=True,exist_ok=True)


#pipeline options 
pipeline_options=PdfPipelineOptions(
    do_table_structure=True,
    do_ocr=True,
    ocr_options=TesseractOcrOptions(lang=['eng','hin']),
    generate_page_images=True,
    generate_picture_images=True,
    images_scale=3.0 
)


#mongo_uri
mongo_uri = "mongodb://127.0.0.1:27017/Markdown-parsed"
#altas wala mongodb url 
# mongo_uri = "mongodb+srv://kavyakapoor413:oreokapoor@cluster0.phv02.mongodb.net/myAppDB?retryWrites=true&w=majority&appName=Cluster0"