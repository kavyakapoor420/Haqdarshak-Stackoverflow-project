import re 

def clean_ocr_text(text:str)->str:
    """Clean up Unicode escape sequences and glyph IDs from OCR output."""
    unicode_map = {
        'uni092F': 'य',  # Ya
        'uni093F': 'ि',  # Vowel sign I
        'uni092Fा': 'या',  # Ya + Vowel sign Aa
        'uni093F/g7021': '',  # Remove invalid sequences
        'uni0927': 'ध',  # Dha
    }

    text=re.sub(r'/g\d{4}','',text)
    for code,char in unicode_map.items():
        text=text.replace(f'/{code}',char)
    text =re.sub(r'/uni[0-9A-Fa-f]{4}', '', text)
    text=re.sub(r'\s+','',text).strip() 
    return text 

