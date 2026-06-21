const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');

router.get('/', authorController.getAuthor);
router.get('/all', authorController.getAllAuthors);
router.post('/save', authorController.saveAuthor);
router.delete('/:id', authorController.deleteAuthor);

module.exports = router;
