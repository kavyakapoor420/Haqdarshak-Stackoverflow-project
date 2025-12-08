const express = require('express');
const router = express.Router();
const postController = require('../Controllers/postController');
const authMiddleware = require('../Middlewares/authMiddleware');
const adminMiddleware = require('../Middlewares/adminMiddleware');

router.post('/posts', authMiddleware, postController.createPost);
router.get('/posts/approved', postController.getApprovedPosts);
router.get('/posts/:postId', postController.getPostById);
router.post('/posts/:postId/vote', authMiddleware, postController.votePost);
router.get('/admin/posts', authMiddleware, adminMiddleware, postController.getAdminPosts);
router.put('/admin/posts/:postId', authMiddleware, adminMiddleware, postController.updatePostStatus);

module.exports = router;