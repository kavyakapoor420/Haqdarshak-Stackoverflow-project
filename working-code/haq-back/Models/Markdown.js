const mongoose = require('mongoose');

const markdownSchema = new mongoose.Schema({
  scheme_name: { type: String, required: true, unique: true },
  markdown_content: { type: String, required: true },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Markdown', markdownSchema);
