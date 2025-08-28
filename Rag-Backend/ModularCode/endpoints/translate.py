from fastapi import APIRouter, HTTPException, Query
from translation_service import translation_service
from utils import logger

router = APIRouter()

@router.get("/supported-languages")
async def get_supported_languages():
    return {
        "success": True,
        "supported_languages": list(translation_service.LANGUAGE_CODE_MAPPING.keys()),
        "language_mapping": translation_service.LANGUAGE_CODE_MAPPING
    }

@router.post("/translate")
async def translate_text(text: str = Query(...), source_lang: str = Query(...), target_lang: str = Query(...)):
    try:
        source_lang = translation_service.LANGUAGE_CODE_MAPPING.get(source_lang, source_lang)
        target_lang = translation_service.LANGUAGE_CODE_MAPPING.get(target_lang, target_lang)
        translated = translation_service.translate_text(text, source_lang, target_lang)
        return {
            "success": True,
            "original_text": text,
            "translated_text": translated,
            "source_language": source_lang,
            "target_language": target_lang
        }
    except Exception as e:
        logger.error(f"Translation error: {e}")
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")
