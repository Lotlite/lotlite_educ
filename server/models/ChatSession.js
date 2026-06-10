const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  sender: { type: String, enum: ['bot', 'user'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, required: true },
  status: { type: String, enum: ['success', 'error'] },
  isContactForm: { type: Boolean }
}, { _id: false });

const ChatSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  },
  messages: [MessageSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('ChatSession', ChatSessionSchema);
