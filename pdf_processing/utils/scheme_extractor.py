import logging 
import google.generativeai as genai
from typing import List,Optional 
from utils.text_cleaner import clean_ocr_text 


_log=logging.getLogger(__name__)

def extract_scheme_name(chunks:List)->Optional[str]:
    """Extarct scheme name from chunks using GEMINI API OR MODEL"""
    genai.configure(api_key="AIzaSyDy780rpCWpDX7NKz9oInrjr59dxY0iymE")
    model=genai.GenerativeModel('gemini-2.0-flash-001')

    prompt_template="""
    You are given a chunk of text from a document that may contain text in English , Hindi, Bengali,Marathi .

    Your task  is to identify and extarct the exact name of scheme name is likely to be a proper noun or specific title such as 

    "Sukanya Samridhi Account Scheme" 

    or its Hindi equivalent "सुकन्या समृद्धि खाता योजना".

    If no scheme name is found in the chunk , return null .

    Provide only the scheme name as a string ,or null if not found .

    Chunk :
    {chunk}

    Output only the scheme name or null: 
"""

    for chunk in chunks:
        chunk_text=chunk.text if hasattr(chunk,'text') else str(chunk)
        chunk_text=clean_ocr_text(chunk_text)
        _log.debug(f"Processing chunk : {chunk_text[:200]}")
        prompt=prompt_template.format(chunk=chunk_text)

        try:
            response=model.generate_content(prompt)
            scheme_name=response.text.strip() 
            if scheme_name and scheme_name.lower()!='null':
                return scheme_name 
        except Exception as e:
            _log.error(f"error processing chunk with Gemini API :{e}")
            continue 
        return None 
