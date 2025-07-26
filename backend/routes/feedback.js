const express = require('express');
const { body, validationResult } = require('express-validator');
const Feedback = require('../models/Feedback');
const FeedbackType = require('../models/FeedbackType');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Submit feedback
router.post('/', [
  body('name').optional().trim().custom((value) => {
    if (value && value.length > 0 && value.length < 2) {
      throw new Error('Name must be at least 2 characters if provided');
    }
    return true;
  }),
  body('email').optional().custom((value) => {
    if (value && value.length > 0 && !/\S+@\S+\.\S+/.test(value)) {
      throw new Error('Please provide a valid email if provided');
    }
    return true;
  }),
  body('type').notEmpty().withMessage('Feedback type is required'),
  body('message').isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, type, message, rating } = req.body;

    // Validate that the feedback type exists and is active
    const feedbackType = await FeedbackType.findOne({
      name: { $regex: new RegExp(`^${type}$`, 'i') }, // Case-insensitive search
      isActive: true
    });
    
    if (!feedbackType) {
      return res.status(400).json({ message: 'Invalid or inactive feedback type' });
    }

    const feedback = new Feedback({
      name: name || undefined,
      email: email || undefined,
      type,
      feedbackTypeId: feedbackType._id,
      message,
      rating
    });

    await feedback.save();

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Error submitting feedback' });
  }
});

// Get all feedback (admin only) - filtered by admin's created types
router.get('/', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, rating, search } = req.query;
    const skip = (page - 1) * limit;

    // Get feedback types created by this admin
    const adminFeedbackTypes = await FeedbackType.find({ 
      createdBy: req.user._id,
      isActive: true 
    }).select('_id name');

    if (adminFeedbackTypes.length === 0) {
      return res.json({
        feedbacks: [],
        pagination: {
          current: parseInt(page),
          total: 0,
          hasNext: false,
          hasPrev: false
        }
      });
    }

    const adminTypeIds = adminFeedbackTypes.map(ft => ft._id);

    // Build query
    let query = { feedbackTypeId: { $in: adminTypeIds } };

    if (type) {
      const typeIds = adminFeedbackTypes
        .filter(ft => ft.name.toLowerCase().includes(type.toLowerCase()))
        .map(ft => ft._id);
      query.feedbackTypeId = { $in: typeIds };
    }

    if (rating) {
      query.rating = parseInt(rating);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Feedback.countDocuments(query);
    const feedbacks = await Feedback.find(query)
      .populate('feedbackTypeId', 'name color icon')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      feedbacks,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + feedbacks.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Error fetching feedback' });
  }
});

// Get feedback statistics (admin only) - filtered by admin's created types
router.get('/stats', adminAuth, async (req, res) => {
  try {
    // Get feedback types created by this admin
    const adminFeedbackTypes = await FeedbackType.find({ 
      createdBy: req.user._id,
      isActive: true 
    }).select('_id name');

    if (adminFeedbackTypes.length === 0) {
      return res.json({
        totalFeedback: 0,
        averageRating: 0,
        monthlyFeedback: [],
        typeDistribution: []
      });
    }

    const adminTypeIds = adminFeedbackTypes.map(ft => ft._id);

    const totalFeedback = await Feedback.countDocuments({ 
      feedbackTypeId: { $in: adminTypeIds } 
    });

    const avgRatingResult = await Feedback.aggregate([
      { $match: { feedbackTypeId: { $in: adminTypeIds } } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ]);

    const averageRating = avgRatingResult.length > 0 ? avgRatingResult[0].averageRating : 0;

    // Monthly feedback for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyFeedback = await Feedback.aggregate([
      { $match: { 
        feedbackTypeId: { $in: adminTypeIds },
        createdAt: { $gte: sixMonthsAgo }
      }},
      { $group: {
        _id: { 
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Type distribution
    const typeDistribution = await Feedback.aggregate([
      { $match: { feedbackTypeId: { $in: adminTypeIds } } },
      { $group: {
        _id: '$feedbackTypeId',
        count: { $sum: 1 }
      }},
      { $lookup: {
        from: 'feedbacktypes',
        localField: '_id',
        foreignField: '_id',
        as: 'feedbackType'
      }},
      { $unwind: '$feedbackType' },
      { $project: {
        name: '$feedbackType.name',
        count: 1,
        color: '$feedbackType.color'
      }}
    ]);

    res.json({
      totalFeedback,
      averageRating: Math.round(averageRating * 10) / 10,
      monthlyFeedback,
      typeDistribution
    });
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    res.status(500).json({ message: 'Error fetching feedback statistics' });
  }
});

module.exports = router; 