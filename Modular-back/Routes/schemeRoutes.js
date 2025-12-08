const express = require('express');
const router = express.Router();
const schemeController = require('../Controllers/schemeController');
const authMiddleware = require('../Middlewares/authMiddleware');
const adminMiddleware = require('../Middlewares/adminMiddleware');

router.get('/scheme-names', schemeController.getSchemeNames);
router.get('/posts/by-scheme/:schemeName', authMiddleware, schemeController.getPostsByScheme);
router.put('/markdown/update/:schemeName', authMiddleware, adminMiddleware, schemeController.updateMarkdown);

module.exports = router;