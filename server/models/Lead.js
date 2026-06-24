const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    default: () => `lead-${Date.now()}-${Math.floor(Math.random() * 10000)}`
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  programCategory: {
    type: String,
    trim: true
  },
  programSpecialization: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    default: 'Apply Now Button'
  },
  lead_tags: {
    type: [String],
    default: ['Loteleite SIEC']
  },
  callyzerStatus: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  callyzerResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  errorDetail: {
    type: String
  },

  // ── Dograh AI Call fields ───────────────────────────────────────────────────
  dograhCallOutcome: {
    type: String,
    trim: true
  },
  dograhLastCallAt: {
    type: Date
  },
  // ────────────────────────────────────────────────────────────────────────────

  // ── WhatsApp Chatbot fields ─────────────────────────────────────────────────
  city: {
    type: String,
    trim: true
  },
  whatsappLastMessage: {
    type: String,
    trim: true
  },
  whatsappAriaResponse: {
    type: String,
    trim: true
  },
  whatsappLastActive: {
    type: Date
  },
  chatbotProcessed: {
    type: Boolean,
    default: false
  },
  chatbotProcessedAt: {
    type: Date
  }
  // ────────────────────────────────────────────────────────────────────────────
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', LeadSchema);
