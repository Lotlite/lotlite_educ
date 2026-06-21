const express = require('express');
const router = express.Router();
const seoBlogController = require('../controllers/seoBlogController');

// POST /api/generate-blog
router.post('/', seoBlogController.generateBlog);

module.exports = router;
