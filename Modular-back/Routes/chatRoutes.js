const express = require('express');
const router = express.Router();
const chatController = require('../Controllers/chatController');
const authMiddleware = require('../Middlewares/authMiddleware');

router.get('/chats', authMiddleware, chatController.getChats);
router.post('/chats', authMiddleware, chatController.createChat);
router.put('/chats/:chatId', authMiddleware, chatController.updateChat);

module.exports = router;