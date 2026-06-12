const express = require('express');
const router = express.Router();
const websiteDataController = require('../controllers/websiteDataController');

router.get('/:key', websiteDataController.getWebsiteData);
router.put('/:key', websiteDataController.updateWebsiteData);

module.exports = router;
