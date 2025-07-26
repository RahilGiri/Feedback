const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  feedbackTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeedbackType',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

// Index for better query performance
feedbackSchema.index({ type: 1 });
feedbackSchema.index({ rating: 1 });
feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ feedbackTypeId: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema); 