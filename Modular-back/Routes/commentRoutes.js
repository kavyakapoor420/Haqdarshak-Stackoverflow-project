const express = require('express');
const router = express.Router();
const commentController = require('../Controllers/commentController');
const authMiddleware = require('../Middlewares/authMiddleware');

router.post('/posts/:postId/comments', authMiddleware, commentController.addComment);
router.post('/comments/:commentId/vote', authMiddleware, commentController.voteComment);
router.post('/comments/:commentId/replies', authMiddleware, commentController.addReply);

module.exports = router;