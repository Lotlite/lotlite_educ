const ChatSession = require('../models/ChatSession');

const syncChatSession = async (req, res) => {
  try {
    const { sessionId, messages, leadId } = req.body;

    if (!sessionId || !messages) {
      return res.status(400).json({ success: false, error: 'sessionId and messages are required' });
    }

    // Upsert the chat session
    const updateData = { messages };
    if (leadId) {
      updateData.leadId = leadId;
    }

    const session = await ChatSession.findOneAndUpdate(
      { sessionId },
      { $set: updateData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ success: true, message: 'Chat synced successfully' });
  } catch (error) {
    console.error('[Chat Controller] Error syncing chat session:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

module.exports = {
  syncChatSession
};
