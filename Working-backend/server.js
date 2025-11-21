

//const SARVAM_API_KEY = 'sk_9hxc0y4c_BPOUXUh2Fc5bbjzk4VLggBd1'; // Replace with your Sarvam AI API key

const { get } = require("mongoose");

//app.use(cors("*"))




// const express = require('express');
// const { SarvamAIClient } = require('sarvamai');
// const multer = require('multer');
// const fs = require('fs').promises;
// const path = require('path');
// const axios = require('axios');
// const cors=require('cors')

// const app = express();
// const port = 3001;
// const upload = multer({ storage: multer.memoryStorage() });

// const SARVAM_API_KEY = 'sk_9hxc0y4c_BPOUXUh2Fc5bbjzk4VLggBd1'; // Replace with your valid Sarvam AI API key
// const client = new SarvamAIClient({ apiSubscriptionKey: SARVAM_API_KEY });

// // Middleware
// app.use(express.json());
// app.use(cors("*"))

// // STT Endpoint
// app.post('/api/stt', upload.single('audio'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No audio file provided' });
//     }

//     const tempFilePath = path.join(__dirname, `temp-${Date.now()}.wav`);
//     await fs.writeFile(tempFilePath, req.file.buffer);

//     // Try SDK first
//     try {
//       const file = new File([req.file.buffer], 'audio.wav', { type: 'audio/wav' });
//       const response = await client.speechToText.translate(file, {
//         model: 'saarika:v2.5',
//         language_code: 'unknown',
//         with_timestamps: false,
//         with_diarization: false,
//       });

//       await fs.unlink(tempFilePath);

//       if (!response.transcript) {
//         throw new Error('No transcription returned from SDK');
//       }

//       res.json({ transcript: response.transcript });
//     } catch (sdkError) {
//       console.error('SDK STT error:', sdkError);

//       // Fallback to direct REST API
//       const formData = new FormData();
//       formData.append('file', req.file.buffer, {
//         filename: 'audio.wav',
//         contentType: 'audio/wav',
//       });
//       formData.append('model', 'saarika:v2.5');
//       formData.append('language_code', 'unknown');
//       formData.append('with_timestamps', 'false');
//       formData.append('with_diarization', 'false');

//       const restResponse = await axios.post('https://api.sarvam.ai/speech-to-text', formData, {
//         headers: {
//           'x-api-key': SARVAM_API_KEY,
//           ...formData.getHeaders(),
//         },
//       });

//       await fs.unlink(tempFilePath);

//       if (!restResponse.data.transcript) {
//         throw new Error('No transcription returned from REST API');
//       }

//       res.json({ transcript: restResponse.data.transcript });
//     }
//   } catch (error) {
//     console.error('STT error:', error.message, error.stack);
//     res.status(500).json({ error: `STT failed: ${error.message}` });
//   }
// });

// // TTS Endpoint
// app.post('/api/tts', async (req, res) => {
//   try {
//     const { text } = req.body;
//     if (!text || typeof text !== 'string') {
//       return res.status(400).json({ error: 'Invalid or missing text' });
//     }

//     // Split text into chunks of ≤500 characters
//     const chunks = [];
//     let start = 0;
//     while (start < text.length) {
//       const chunk = text.slice(start, start + 500).trim();
//       if (chunk) chunks.push(chunk); // Skip empty chunks
//       start += 500;
//     }

//     const audios = [];
//     for (const chunk of chunks) {
//       try {
//         const response = await client.textToSpeech.convert({
//           text: chunk,
//           model: 'bulbul:v2',
//           speaker: 'anushka',
//           target_language_code: 'en-IN',
//           pitch: 0,
//           pace: 1.0,
//           loudness: 1.0,
//           speech_sample_rate: 22050,
//           enable_preprocessing: true,
//         });

//         if (!response.audio) {
//           throw new Error('No audio returned for chunk from SDK');
//         }
//         audios.push(response.audio);
//       } catch (sdkError) {
//         console.error('SDK TTS error for chunk:', sdkError);

//         // Fallback to direct REST API
//         const restResponse = await axios.post('https://api.sarvam.ai/text-to-speech', {
//           inputs: [chunk],
//           model: 'bulbul:v2',
//           speaker: 'anushka',
//           target_language_code: 'en-IN',
//           pitch: 0,
//           pace: 1.0,
//           loudness: 1.0,
//           speech_sample_rate: 22050,
//           enable_preprocessing: true,
//         }, {
//           headers: {
//             'x-api-key': SARVAM_API_KEY,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!restResponse.data.audios || !restResponse.data.audios[0]) {
//           throw new Error('No audio returned for chunk from REST API');
//         }
//         audios.push(restResponse.data.audios[0]);
//       }
//     }

//     res.json({ audios });
//   } catch (error) {
//     console.error('TTS error:', error.message, error.stack);
//     res.status(500).json({ error: `TTS failed: ${error.message}` });
//   }
// });

// app.get('/health', (req, res) => res.json({ status: 'ok' }));

// app.listen(port, () => console.log(`Server running on port ${port}`));


const getTranslate = async () => {
  try {
    const response = await fetch('https://api.sarvam.ai/translate', {
      method: 'POST',
      headers: {
        'api-subscription-key': "sk_9hxc0y4c_BPOUXUh2Fc5bbjzk4VLggBd1",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: 'Hello, how are you?',
        source_language_code: 'en-IN',
        target_language_code: 'hi-IN', // change to any supported target
      }),
    });

    const result = await response.json();
    console.log("Translation result:", result);
    return result;
  } catch (err) {
    console.error("Error:", err);
  }
};

getTranslate().then((ans) => {
  console.log("Translation output (from .then):", ans);
});
