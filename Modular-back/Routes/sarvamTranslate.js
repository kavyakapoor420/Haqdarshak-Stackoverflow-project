const { SarvamAI } = require('@sarvam.ai/sdk');

const sarvam = new SarvamAI({
  apiKey: process.env.SARVAM_AI_API_KEY 
});

// Translation API Route
app.post('/api/translate', async (req, res) => {
  try {
    const { text, source_language = "hi-IN", target_language = "en-IN" } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const response = await sarvam.translation.translate({
      input: text,
      source_language_code: source_language,
      target_language_code: target_language,
      speaker_gender: "Male", // optional
      mode: "formal",         // optional
      model: "hindi:1",       // optional, check Sarvam docs
      enable_preprocessing: true
    });

    res.json({
      success: true,
      translated_text: response.translated_text || response.output,
      source_language,
      target_language
    });

  } catch (error) {
    console.error("Sarvam Translation Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Translation failed"
    });
  }
});