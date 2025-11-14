const schemeNameData = require('../SchemeNameData/schemeNameData.json')

const Markdown = require('../Models/Markdown');

exports.getSchemeNames = (req, res) => {
  res.json(schemeNameData);
};

exports.getPostsByScheme = async (req, res) => {
  try {
    const schemeName = req.params.schemeName.trim();
    const posts = await Post.find({ schemeName, status: 'accepted' }).select('title description schemeName');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching posts by scheme', error: error.message });
  }
};

exports.updateMarkdown = async (req, res) => {
  try {
    const schemeName = req.params.schemeName.trim();
    const markdownDoc = await Markdown.findOne({ scheme_name: schemeName });
    if (!markdownDoc) {
      return res.status(404).json({ message: 'Markdown document not found for this scheme' });
    }
    const posts = await Post.find({ schemeName, status: 'accepted' }).select('title description schemeName');
    if (posts.length === 0) {
      return res.json({ message: 'No approved posts to append', markdown_content: markdownDoc.markdown_content });
    }
    let updatedMarkdownContent = markdownDoc.markdown_content;
    posts.forEach(post => {
      updatedMarkdownContent += `\n\n## User Post: ${post.title}\n\n**Scheme Name:** ${post.schemeName}\n\n**Description:** ${post.description}\n`;
    });
    const result = await Markdown.updateOne(
      { _id: markdownDoc._id },
      { $set: { markdown_content: updatedMarkdownContent, updated_at: new Date() } }
    );
    if (result.modifiedCount === 0) {
      return res.status(500).json({ message: 'Failed to update markdown content' });
    }
    res.json({ message: 'Markdown content updated with approved posts', markdown_content: updatedMarkdownContent });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating markdown content', error: error.message });
  }
};