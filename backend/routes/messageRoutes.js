const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { sendMessage, getMessages, getConversations } = require('../controllers/messageController');

router.post('/send', authMiddleware, sendMessage);
router.get('/conversations', authMiddleware, getConversations);
router.get('/:userId', authMiddleware, getMessages);

module.exports = router;
