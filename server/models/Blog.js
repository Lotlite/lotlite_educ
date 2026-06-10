const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  slug: { type: String },
  audience: { type: String },
  industry: { type: String },
  keywords: { type: String },
  language: { type: String },
  length: { type: String },
  style: { type: String },
  image_option: { type: String },
  
  success: { type: Boolean, default: true },
  article: { type: String },
  markdown: { type: String },
  seoTitle: { type: String },
  imageUrl: { type: String },
  wordCount: { type: Number },
  plagiarismCheck: { type: String },
  
  backlinkAnalysis: {
    insertedLinks: [String],
    suggestedLinks: [String],
    topicalCluster: { type: String },
    authorityScore: { type: Number }
  },
  
  isPublished: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', BlogSchema);
