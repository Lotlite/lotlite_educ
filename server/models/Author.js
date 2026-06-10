const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String },
  bio: { type: String },
  avatar: { type: String }, // base64 or URL
  email: { type: String },
  linkedin: { type: String },
  twitter: { type: String },
  website: { type: String },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Author', AuthorSchema);
