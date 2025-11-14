const Chat = require('../Models/Chat');

exports.getChats = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required to view chats' });
    const chats = await Chat.find({ userId: req.user._id })
      .select('title messages createdAt updatedAt')
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching chats', error: error.message });
  }
};

exports.createChat = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required to create chat' });
    const { title, messages } = req.body;
    if (!title || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Title and messages are required' });
    }
    const chat = new Chat({
      userId: req.user._id,
      title: title.trim(),
      messages,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await chat.save();
    res.status(201).json({ message: 'Chat created successfully', chat });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating chat', error: error.message });
  }
};

exports.updateChat = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required to update chat' });
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Messages are required' });
    }
    const chat = await Chat.findOne({ _id: req.params.chatId, userId: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found or unauthorized' });
    chat.messages = messages;
    chat.updatedAt = new Date();
    await chat.save();
    res.json({ message: 'Chat updated successfully', chat });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating chat', error: error.message });
  }
};