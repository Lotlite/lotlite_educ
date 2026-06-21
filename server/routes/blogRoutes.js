const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Define routes
router.post('/generate', blogController.generateBlog);
router.post('/save', blogController.saveBlog);
router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getBlogById);
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
