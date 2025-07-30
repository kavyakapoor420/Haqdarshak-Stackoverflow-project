import re 
import base64 
from pathlib import Path 
import logging

_log=logging.getLogger(__name__)

def process_base64_images(content:str,image_dir:Path,doc_filename:str)->str:
    """Decode base64 images, save them, and update markdown with file references."""
    image_dir.mkdir(parents=True, exist_ok=True)
    base64_pattern = r'!\[(.*?)\]\(data:image/(\w+);base64,([^)]+)\)'
    updated_content=content
    image_count=0

    for match in re.finditer(base64_pattern,content):
        all_text=match.group(1)
        image_type=match.group(2)
        base64_data=match.group(3).strip() 


        try:
            image_data=base64.b64decode(base64_data)
        except Exception as e:
            _log.error(f"error decoding base64 image {image_count} : {e}")
            continue

        updated_md_filename=image_dir.parent/f"{doc_filename}-with-image-links.md"
        try: 
            with open(updated_md_filename,'w',encoding='utf-8') as f:
                f.write(updated_content)
            _log.info(f"updated markdown wiht images links saved to {updated_md_filename}")
        except Exception as e:
            _log.error(f"error saving updating markdown : {e}")
        return updated_content 
    



