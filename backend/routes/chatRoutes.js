const express = require('express');
const router = express.Router();
const { orchestrator } = require('../agent/orchestrator');

router.post('/', async (req, res) => {
  try {
    const { message, sessionId = 'default_session', conversationHistory = [], userProfile = null } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const result = await orchestrator.handleMessage({
      message,
      sessionId,
      conversationHistory,
      userProfile,
    });

    return res.json({
      success: true,
      reply: result.reply,
      sessionState: result.sessionState,
      uiCard: result.uiCard,
      source: result.source || 'ai-agent',
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message',
      reply: 'The Guest Assistant encountered an unexpected error. Please contact the Warden office at +91 651 2275444.',
    });
  }
});

module.exports = router;
