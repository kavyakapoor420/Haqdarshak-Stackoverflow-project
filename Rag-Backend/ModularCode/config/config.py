import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Configuration
GEMINI_API_KEY = "AIzaSyDy780rpCWpDX7NKz9oInrjr59dxY0iymE"
MONGO_URI = "mongodb://127.0.0.1:27017/pdf_ingestion_system"
HUGGING_FACE_TOKEN = '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'
EMBEDDING_MODEL_NAME = 'intfloat/multilingual-e5-base'
UPLOAD_DIR = Path("./uploads")
PARSED_DIR = Path("./parsed_docs")
ELASTICSEARCH_URL = "https://my-elasticsearch-project-cff6bd.es.us-central1.gcp.elastic.cloud:443"
ELASTICSEARCH_API_KEY = "aGdhV3JaZ0JhSEJ0RWhfNnRpQlI6SElfcDQ2dkYwbVgxaW5lSzRGN0Nydw=="
SARVAM_API_KEY = 'sk_9hxc0y4c_BPOUXUh2Fc5bbjzk4VLggBd1'
SARVAM_TRANSLATE_URL = 'https://api.sarvam.ai/translate'

# Create directories
UPLOAD_DIR.mkdir(exist_ok=True)
PARSED_DIR.mkdir(exist_ok=True)

