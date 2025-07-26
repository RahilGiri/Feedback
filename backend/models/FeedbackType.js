const mongoose = require('mongoose');

const feedbackTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: '#3B82F6' // Default blue color
  },
  icon: {
    type: String,
    default: 'FileText' // Default icon
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
feedbackTypeSchema.index({ name: 1 });
feedbackTypeSchema.index({ isActive: 1 });
feedbackTypeSchema.index({ createdBy: 1 });

module.exports = mongoose.model('FeedbackType', feedbackTypeSchema); 