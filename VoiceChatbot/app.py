
# sarvam_api_key="sk_oswbovqu_RKsxylFUid3eSRD2aDlCELnI"
# gemini_api_key = "AIzaSyAXzmHm2OTvvjtUmDyQNy-tgDlslaxbOEo"
# # Initialize API clients
# #SARVAM_API_KEY = "sk_oswbovqu_RKsxylFUid3eSRD2aDlCELnI"


# #GEMINI_API_KEY = "AIzaSyAXzmHm2OTvvjtUmDyQNy-tgDlslaxbOEo"



# # gemini_model = genai.GenerativeModel('gemini-2.0-flash-001')
    
# # main.py
# # main.py

# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import requests
# import base64
# import re
# import os

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# SARVAM_API_KEY = os.getenv("sk_99efun0w_bhUfOelKzuzsPi4JolHyIiwg")
# if not SARVAM_API_KEY:
#     raise ValueError("SARVAM_API_KEY environment variable not set")

# class TextToSpeechRequest(BaseModel):
#     text: str
#     target_language_code: str
#     speaker: str

# def split_text_into_chunks(text: str, max_length: int = 500) -> list:
#     """Split text into chunks, preferring sentence boundaries, max 500 chars."""
#     sentences = re.split(r'(?<=[.!?])\s+', text.strip())
#     chunks = []
#     current_chunk = ""
    
#     for sentence in sentences:
#         if len(current_chunk) + len(sentence) <= max_length:
#             current_chunk += sentence + " "
#         else:
#             if current_chunk:
#                 chunks.append(current_chunk.strip())
#             current_chunk = sentence + " "
    
#     if current_chunk:
#         chunks.append(current_chunk.strip())
    
#     return chunks

# def sarvam_text_to_speech(text: str, language_code: str, speaker: str) -> str:
#     """Call Sarvam AI text-to-speech API for a single text chunk."""
#     url = "https://api.sarvam.ai/text-to-speech"
#     headers = {
#         "api-subscription-key": SARVAM_API_KEY,
#         "Content-Type": "application/json"
#     }
#     payload = {
#         "text": text[:500],
#         "target_language_code": language_code,
#         "speaker": speaker,
#         "model": "bulbul:v2",
#         "enable_preprocessing": True,
#         "speech_sample_rate": 22050
#     }
    
#     response = requests.post(url, headers=headers, json=payload)
#     if response.status_code != 200:
#         raise HTTPException(status_code=response.status_code, detail=f"Sarvam AI text-to-speech API error: {response.text}")
    
#     data = response.json()
#     return data["audios"][0]

# @app.post("/text-to-speech")
# async def text_to_speech(request: TextToSpeechRequest):
#     """Return list of audio chunks as base64 strings."""
#     try:
#         text_chunks = split_text_into_chunks(request.text, max_length=500)
#         print(f"Generated {len(text_chunks)} chunks: {text_chunks}")
        
#         audio_chunks = []
#         for chunk in text_chunks:
#             audio_base64 = sarvam_text_to_speech(chunk, request.target_language_code, request.speaker)
#             audio_chunks.append(audio_base64)
        
#         return {"audio_chunks": audio_chunks}
    
#     except Exception as e:
#         print(f"Error in text-to-speech: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error processing text-to-speech: {str(e)}")


# python3 -m http.server 3000  




from fastapi import FastAPI, File, UploadFile, HTTPException, Form, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncio
import aiohttp
import json
import base64
import os
import tempfile
import uuid
from typing import Optional, Dict, Any
from pydantic import BaseModel
import uvicorn
from sarvamai import AsyncSarvamAI, SarvamAI
import logging
import websockets
import io

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Sarvam AI Voice Chatbot Backend", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    text: str
    gemini_api_key: str

class TTSRequest(BaseModel):
    text: str
    sarvam_api_key: str
    language_code: str = "en-IN"
    speaker: str = "anushka"

class StreamingTTSRequest(BaseModel):
    text: str
    sarvam_api_key: str
    language_code: str = "en-IN"
    speaker: str = "anushka"
    model: str = "bulbul:v2"

class BatchSTTRequest(BaseModel):
    sarvam_api_key: str
    language_code: str = "unknown"
    with_timestamps: bool = True
    with_diarization: bool = False
    num_speakers: int = 2

# Store for managing long audio processing jobs
active_jobs = {}

@app.get("/")
async def root():
    return {"message": "Sarvam AI Voice Chatbot Backend is running!"}

@app.post("/speech-to-text")
async def speech_to_text(
    file: UploadFile = File(...),
    sarvam_api_key: str = Form(...),
    language_code: str = Form(default="unknown")
):
    """Handle short audio files (< 30 seconds) with real-time transcription using REST API"""
    try:
        # Initialize Sarvam AI client
        client = SarvamAI(api_subscription_key=sarvam_api_key)
        
        # Read the uploaded file
        audio_data = await file.read()
        
        # Create a file-like object from bytes
        audio_file = io.BytesIO(audio_data)
        audio_file.name = file.filename  # Add name attribute for the client
        
        # Use the correct transcribe method
        response = client.speech_to_text.transcribe(
            file=audio_file,
            model="saarika:v2.5",
            language_code=language_code
        )
        
        return response
                
    except Exception as e:
        logger.error(f"Error in speech-to-text: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")

@app.post("/speech-to-text-translate")
async def speech_to_text_translate(
    file: UploadFile = File(...),
    sarvam_api_key: str = Form(...)
):
    """Translate speech from Indian languages to English using Saaras model"""
    try:
        # Initialize Sarvam AI client
        client = SarvamAI(api_subscription_key=sarvam_api_key)
        
        # Read the uploaded file
        audio_data = await file.read()
        
        # Create a file-like object from bytes
        audio_file = io.BytesIO(audio_data)
        audio_file.name = file.filename
        
        # Use the translate method with Saaras model
        response = client.speech_to_text.translate(
            file=audio_file,
            model="saaras:v2.5"
        )
        
        return response
                
    except Exception as e:
        logger.error(f"Error in speech-to-text translation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error translating audio: {str(e)}")

@app.post("/batch-speech-to-text")
async def batch_speech_to_text(
    file: UploadFile = File(...),
    sarvam_api_key: str = Form(...),
    language_code: str = Form(default="unknown"),
    with_timestamps: bool = Form(default=True),
    with_diarization: bool = Form(default=False),
    num_speakers: int = Form(default=2)
):
    """Handle long audio files using Sarvam AI batch processing"""
    try:
        job_id = str(uuid.uuid4())
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            temp_file.write(await file.read())
            temp_file_path = temp_file.name
        
        # Initialize Sarvam AI client
        client = AsyncSarvamAI(api_subscription_key=sarvam_api_key)
        
        # Create batch job
        job = await client.speech_to_text_job.create_job(
            language_code=language_code,
            model="saarika:v2.5",
            with_timestamps=with_timestamps,
            with_diarization=with_diarization,
            num_speakers=num_speakers if with_diarization else None
        )
        
        # Upload file
        await job.upload_files(file_paths=[temp_file_path])
        
        # Start processing
        await job.start()
        
        # Store job info
        active_jobs[job_id] = {
            "sarvam_job": job,
            "temp_file": temp_file_path,
            "status": "processing"
        }
        
        # Start background task to monitor job
        asyncio.create_task(monitor_batch_job(job_id))
        
        return {
            "job_id": job_id,
            "status": "processing",
            "message": "Long audio file is being processed. Use the job_id to check status."
        }
        
    except Exception as e:
        logger.error(f"Error in batch-speech-to-text: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing long audio: {str(e)}")

@app.get("/batch-job-status/{job_id}")
async def get_batch_job_status(job_id: str):
    """Check the status of a batch processing job"""
    if job_id not in active_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job_info = active_jobs[job_id]
    return {
        "job_id": job_id,
        "status": job_info["status"],
        "result": job_info.get("result"),
        "error": job_info.get("error")
    }

async def monitor_batch_job(job_id: str):
    """Background task to monitor batch job completion"""
    try:
        job_info = active_jobs[job_id]
        sarvam_job = job_info["sarvam_job"]
        temp_file_path = job_info["temp_file"]
        
        # Wait for completion
        final_status = await sarvam_job.wait_until_complete()
        
        if await sarvam_job.is_failed():
            active_jobs[job_id]["status"] = "failed"
            active_jobs[job_id]["error"] = "Batch STT job failed"
        else:
            # Create temporary output directory
            output_dir = tempfile.mkdtemp()
            await sarvam_job.download_outputs(output_dir=output_dir)
            
            # Read the result files
            result_files = os.listdir(output_dir)
            transcript_data = {}
            
            for result_file in result_files:
                if result_file.endswith('.json'):
                    with open(os.path.join(output_dir, result_file), 'r') as f:
                        transcript_data = json.load(f)
            
            active_jobs[job_id]["status"] = "completed"
            active_jobs[job_id]["result"] = transcript_data
            
            # Cleanup
            import shutil
            shutil.rmtree(output_dir)
        
        # Cleanup temp file
        if os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
            
    except Exception as e:
        logger.error(f"Error monitoring batch job {job_id}: {str(e)}")
        active_jobs[job_id]["status"] = "failed"
        active_jobs[job_id]["error"] = str(e)

@app.post("/chat")
async def chat_with_gemini(request: ChatRequest):
    """Generate AI response using Google Gemini"""
    try:
        async with aiohttp.ClientSession() as session:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key={request.gemini_api_key}"
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": request.text
                    }]
                }]
            }
            
            async with session.post(url, json=payload) as response:
                if response.status != 200:
                    error_text = await response.text()
                    logger.error(f"Gemini API error: {response.status} - {error_text}")
                    raise HTTPException(status_code=response.status, detail=f"Gemini API error: {error_text}")
                
                data = await response.json()
                
                if 'candidates' in data and len(data['candidates']) > 0:
                    ai_response = data['candidates'][0]['content']['parts'][0]['text']
                    return {"response": ai_response}
                else:
                    return {"response": "Sorry, I couldn't generate a response. Please try again."}
                    
    except Exception as e:
        logger.error(f"Error in chat: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.post("/text-to-speech")
async def text_to_speech(request: TTSRequest):
    """Convert text to speech using Sarvam AI REST API"""
    try:
        # Initialize Sarvam AI client
        client = SarvamAI(api_subscription_key=request.sarvam_api_key)
        
        # Split long text into chunks (max 500 characters as per API limit)
        text_chunks = split_text_into_chunks(request.text, max_length=500)
        audio_chunks = []
        
        for chunk in text_chunks:
            if not chunk.strip():
                continue
                
            # Use the correct TTS method
            response = client.text_to_speech.convert(
                text=chunk,
                model=request.model if hasattr(request, 'model') else "bulbul:v2",
                speaker=request.speaker,
                target_language_code=request.language_code
            )
            
            if hasattr(response, 'audio') and response.audio:
                audio_chunks.append(response.audio)
        
        # Return the first chunk for now (you might want to merge chunks in production)
        if audio_chunks:
            return {"audio": audio_chunks[0], "chunks_count": len(audio_chunks)}
        else:
            raise HTTPException(status_code=500, detail="No audio generated")
            
    except Exception as e:
        logger.error(f"Error in text-to-speech: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating speech: {str(e)}")

@app.websocket("/streaming-tts")
async def streaming_text_to_speech(websocket: WebSocket):
    """WebSocket endpoint for streaming TTS using Sarvam AI streaming API"""
    await websocket.accept()
    
    try:
        # Wait for initial configuration
        config_data = await websocket.receive_json()
        
        if config_data.get("type") != "config":
            await websocket.send_json({"error": "First message must be config"})
            return
        
        sarvam_api_key = config_data.get("sarvam_api_key")
        speaker = config_data.get("speaker", "anushka")
        language_code = config_data.get("target_language_code", "en-IN")
        
        if not sarvam_api_key:
            await websocket.send_json({"error": "sarvam_api_key required in config"})
            return
        
        # Initialize Sarvam AI streaming client
        from sarvamai import SarvamAIClient
        client = SarvamAIClient(api_subscription_key=sarvam_api_key)
        
        # Connect to streaming TTS
        socket = await client.text_to_speech_streaming.connect(model="bulbul:v2")
        
        # Configure the connection
        await socket.configure_connection({
            "type": "config",
            "data": {
                "speaker": speaker,
                "target_language_code": language_code,
                "output_audio_codec": "mp3",
                "min_buffer_size": 50,
                "max_chunk_length": 500
            }
        })
        
        # Send confirmation to client
        await websocket.send_json({"type": "ready", "message": "Streaming TTS ready"})
        
        async def handle_sarvam_messages():
            """Handle messages from Sarvam AI streaming socket"""
            async for message in socket:
                if message.get("type") == "audio":
                    # Forward audio data to client
                    await websocket.send_json({
                        "type": "audio",
                        "data": message.get("data", {}).get("audio", "")
                    })
                elif message.get("type") == "error":
                    await websocket.send_json({
                        "type": "error",
                        "message": message.get("message", "Unknown error")
                    })
        
        # Start handling Sarvam messages in background
        sarvam_task = asyncio.create_task(handle_sarvam_messages())
        
        # Handle client messages
        while True:
            try:
                data = await websocket.receive_json()
                message_type = data.get("type")
                
                if message_type == "text":
                    # Send text to Sarvam AI for conversion
                    text = data.get("text", "")
                    if text:
                        await socket.convert(text)
                
                elif message_type == "flush":
                    # Send flush message to ensure complete processing
                    await socket.flush()
                
                elif message_type == "ping":
                    # Keep connection alive
                    await socket.ping()
                    await websocket.send_json({"type": "pong"})
                
                elif message_type == "close":
                    break
                    
            except WebSocketDisconnect:
                break
        
        # Cleanup
        sarvam_task.cancel()
        await socket.close()
        
    except Exception as e:
        logger.error(f"Error in streaming TTS: {str(e)}")
        await websocket.send_json({"type": "error", "message": str(e)})
    
    finally:
        try:
            await websocket.close()
        except:
            pass

def split_text_into_chunks(text: str, max_length: int = 500) -> list:
    """Split text into chunks for better TTS processing"""
    if len(text) <= max_length:
        return [text]
    
    chunks = []
    sentences = text.split('. ')
    current_chunk = ""
    
    for sentence in sentences:
        if len(current_chunk + sentence + '. ') <= max_length:
            current_chunk += sentence + '. '
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = sentence + '. '
    
    if current_chunk:
        chunks.append(current_chunk.strip())
        
    return chunks

@app.post("/process-voice-message")
async def process_voice_message(
    file: UploadFile = File(...),
    sarvam_api_key: str = Form(...),
    gemini_api_key: str = Form(...),
    language_code: str = Form(default="unknown"),
    speaker: str = Form(default="anushka"),
    target_language_code: str = Form(default="en-IN"),
    use_translation: bool = Form(default=False)
):
    """Complete voice message processing pipeline"""
    try:
        # Step 1: Determine if we need batch processing based on file size
        file_content = await file.read()
        file_size_mb = len(file_content) / (1024 * 1024)
        
        # Reset file pointer
        await file.seek(0)
        
        if file_size_mb > 5:  # Use batch processing for files > 5MB
            # Use batch processing
            job_id = str(uuid.uuid4())
            
            with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
                temp_file.write(file_content)
                temp_file_path = temp_file.name
            
            client = AsyncSarvamAI(api_subscription_key=sarvam_api_key)
            
            job = await client.speech_to_text_job.create_job(
                language_code=language_code,
                model="saarika:v2.5",
                with_timestamps=True,
                with_diarization=False
            )
            
            await job.upload_files(file_paths=[temp_file_path])
            await job.start()
            
            # Wait for completion (with timeout)
            try:
                final_status = await asyncio.wait_for(job.wait_until_complete(), timeout=300)  # 5 min timeout
                
                if await job.is_failed():
                    raise HTTPException(status_code=500, detail="Batch transcription failed")
                
                # Download results
                output_dir = tempfile.mkdtemp()
                await job.download_outputs(output_dir=output_dir)
                
                # Read transcription result
                result_files = os.listdir(output_dir)
                transcript = ""
                
                for result_file in result_files:
                    if result_file.endswith('.json'):
                        with open(os.path.join(output_dir, result_file), 'r') as f:
                            data = json.load(f)
                            if 'transcript' in data:
                                transcript = data['transcript']
                            elif 'transcripts' in data:
                                transcript = ' '.join([t.get('text', '') for t in data['transcripts']])
                
                # Cleanup
                import shutil
                shutil.rmtree(output_dir)
                os.unlink(temp_file_path)
                
            except asyncio.TimeoutError:
                return {
                    "job_id": job_id,
                    "status": "processing",
                    "message": "Large file is still processing. Check back later."
                }
        else:
            # Use regular STT for smaller files
            client = SarvamAI(api_subscription_key=sarvam_api_key)
            
            # Create a file-like object from bytes
            audio_file = io.BytesIO(file_content)
            audio_file.name = file.filename
            
            if use_translation:
                # Use translation API for Indian languages to English
                stt_result = client.speech_to_text.translate(
                    file=audio_file,
                    model="saaras:v2.5"
                )
            else:
                # Use transcription API
                stt_result = client.speech_to_text.transcribe(
                    file=audio_file,
                    model="saarika:v2.5",
                    language_code=language_code
                )
            
            # Extract transcript from response
            if hasattr(stt_result, 'transcript'):
                transcript = stt_result.transcript
            elif isinstance(stt_result, dict) and 'transcript' in stt_result:
                transcript = stt_result['transcript']
            else:
                raise HTTPException(status_code=400, detail="Could not extract transcript from response")
        
        if not transcript:
            raise HTTPException(status_code=400, detail="Could not transcribe audio")
        
        # Step 2: Generate AI response
        chat_request = ChatRequest(text=transcript, gemini_api_key=gemini_api_key)
        chat_response = await chat_with_gemini(chat_request)
        ai_response = chat_response["response"]
        
        # Step 3: Convert response to speech
        tts_request = TTSRequest(
            text=ai_response,
            sarvam_api_key=sarvam_api_key,
            language_code=target_language_code,
            speaker=speaker
        )
        tts_response = await text_to_speech(tts_request)
        
        return {
            "transcript": transcript,
            "ai_response": ai_response,
            "audio": tts_response["audio"],
            "chunks_count": tts_response.get("chunks_count", 1)
        }
        
    except Exception as e:
        logger.error(f"Error in process-voice-message: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing voice message: {str(e)}")



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)