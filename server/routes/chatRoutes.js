const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/chat/sync', chatController.syncChatSession);
router.get('/chat/logs', chatController.getChatLogs);

module.exports = router;
