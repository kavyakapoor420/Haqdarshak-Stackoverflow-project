import re
import requests
from config import SARVAM_API_KEY, SARVAM_TRANSLATE_URL
from utils import logger

class TranslationService:
    LANGUAGE_CODE_MAPPING = {
        'hi': 'hi-IN',  # Hindi
        'hi-IN': 'hi-IN',
        'en': 'en-IN',  # English
        'en-IN': 'en-IN',
        'bn': 'bn-IN',  # Bengali
        'bn-IN': 'bn-IN',
        'gu': 'gu-IN',  # Gujarati
        'gu-IN': 'gu-IN',
        'kn': 'kn-IN',  # Kannada
        'kn-IN': 'kn-IN',
        'ml': 'ml-IN',  # Malayalam
        'ml-IN': 'ml-IN',
        'mr': 'mr-IN',  # Marathi
        'mr-IN': 'mr-IN',
        'or': 'or-IN',  # Odia
        'or-IN': 'or-IN',
        'pa': 'pa-IN',  # Punjabi
        'pa-IN': 'pa-IN',
        'ta': 'ta-IN',  # Tamil
        'ta-IN': 'ta-IN',
        'te': 'te-IN',  # Telugu
        'te-IN': 'te-IN',
        'ur': 'ur-IN',  # Urdu
        'ur-IN': 'ur-IN'
    }

    def __init__(self):
        self.sarvam_api_key = SARVAM_API_KEY
        self.translate_url = SARVAM_TRANSLATE_URL

    def detect_language(self, text: str) -> str:
        """
        Detect language of the text using character analysis and common words
        """
        # Simple heuristic-based language detection
        # Check for Devanagari script (Hindi)
        hindi_chars = re.findall(r'[\u0900-\u097F]', text)
        if len(hindi_chars) > len(text) * 0.3:
            return 'hi-IN'
        
        # Check for Bengali script
        bengali_chars = re.findall(r'[\u0980-\u09FF]', text)
        if len(bengali_chars) > len(text) * 0.3:
            return 'bn-IN'
            
        # Check for Telugu script
        telugu_chars = re.findall(r'[\u0C00-\u0C7F]', text)
        if len(telugu_chars) > len(text) * 0.3:
            return 'te-IN'
            
        # Check for Tamil script
        tamil_chars = re.findall(r'[\u0B80-\u0BFF]', text)
        if len(tamil_chars) > len(text) * 0.3:
            return 'ta-IN'
            
        # Default to English if no Indic script detected
        return 'en-IN'

    def translate_text(self, text: str, source_language: str, target_language: str) -> str:
        """
        Translate text using Sarvam AI API
        """
        try:
            # Skip translation if source and target are the same
            if source_language == target_language:
                return text
                
            # Clean text for translation
            clean_text = text.strip()
            if not clean_text:
                return text
                
            headers = {
                'api-subscription-key': self.sarvam_api_key,
                'Content-Type': 'application/json'
            }
            
            payload = {
                'input': clean_text,
                'source_language_code': source_language,
                'target_language_code': target_language,
                'speaker_gender': 'Male',
                'mode': 'formal',
                'model': 'mayura:v1',
                'enable_preprocessing': True
            }
            
            logger.info(f"Translating from {source_language} to {target_language}: {clean_text[:50]}...")
            
            response = requests.post(self.translate_url, headers=headers, json=payload, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                translated_text = result.get('translated_text', text)
                logger.info(f"Translation successful: {translated_text[:50]}...")
                return translated_text
            else:
                logger.error(f"Translation API error: {response.status_code} - {response.text}")
                return text
                
        except Exception as e:
            logger.error(f"Translation error: {e}")
            return text

    def translate_to_english(self, text: str, source_language: str = None) -> tuple:
        """
        Translate text to English for processing
        Returns (translated_text, detected_language)
        """
        if not source_language:
            source_language = self.detect_language(text)
        
        if source_language == 'en-IN':
            return text, source_language
            
        translated = self.translate_text(text, source_language, 'en-IN')
        return translated, source_language

    def translate_from_english(self, text: str, target_language: str) -> str:
        """
        Translate text from English to target language
        """
        if target_language == 'en-IN':
            return text
            
        return self.translate_text(text, 'en-IN', target_language)

# Singleton instance
translation_service = TranslationService()
