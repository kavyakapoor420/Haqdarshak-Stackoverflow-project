const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const authMiddleware = require('../Middlewares/authMiddleware');

router.get('/notifications', authMiddleware, userController.getNotifications);
router.get('/user/stats', authMiddleware, userController.getUserStats);
router.get('/user/profile', authMiddleware, userController.getUserProfile);
router.get('/user/badges', authMiddleware, userController.getUserBadges);
router.get('/user/activity', authMiddleware, userController.getUserActivity);
router.get('/user/posts', authMiddleware, userController.getUserPosts);

module.exports = router;