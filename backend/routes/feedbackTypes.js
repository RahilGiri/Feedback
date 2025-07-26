const express = require('express');
const { body, validationResult } = require('express-validator');
const FeedbackType = require('../models/FeedbackType');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all active feedback types (public)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    
    let query = { isActive: true };
    
    // Add search functionality
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const feedbackTypes = await FeedbackType.find(query)
      .populate('createdBy', 'username')
      .sort({ name: 1 });
    
    res.json(feedbackTypes);
  } catch (error) {
    console.error('Error fetching feedback types:', error);
    res.status(500).json({ message: 'Error fetching feedback types' });
  }
});

// Get all feedback types (admin only) - filtered by admin's created types
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const { search } = req.query;
    
    let query = { createdBy: req.user._id };
    
    // Add search functionality
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const feedbackTypes = await FeedbackType.find(query)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    
    res.json(feedbackTypes);
  } catch (error) {
    console.error('Error fetching admin feedback types:', error);
    res.status(500).json({ message: 'Error fetching feedback types' });
  }
});

// Create new feedback type (admin only)
router.post('/', adminAuth, [
  body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description').optional().trim(),
  body('color').optional().isHexColor().withMessage('Color must be a valid hex color'),
  body('icon').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, color, icon } = req.body;

    // Check if type already exists (case-insensitive)
    const existingType = await FeedbackType.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    if (existingType) {
      return res.status(400).json({ message: 'Feedback type with this name already exists' });
    }

    const feedbackType = new FeedbackType({
      name,
      description: description || '',
      color: color || '#3B82F6',
      icon: icon || 'FileText',
      createdBy: req.user._id
    });

    await feedbackType.save();
    
    res.status(201).json({
      message: 'Feedback type created successfully',
      feedbackType
    });
  } catch (error) {
    console.error('Error creating feedback type:', error);
    res.status(500).json({ message: 'Error creating feedback type' });
  }
});

// Update feedback type (admin only) - only if created by this admin
router.put('/:id', adminAuth, [
  body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description').optional().trim(),
  body('color').optional().isHexColor().withMessage('Color must be a valid hex color'),
  body('icon').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, color, icon } = req.body;

    // Find feedback type created by this admin
    const feedbackType = await FeedbackType.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!feedbackType) {
      return res.status(404).json({ message: 'Feedback type not found' });
    }

    // Check if new name conflicts with existing types (excluding current one)
    const existingType = await FeedbackType.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: req.params.id }
    });
    if (existingType) {
      return res.status(400).json({ message: 'Feedback type with this name already exists' });
    }

    feedbackType.name = name;
    feedbackType.description = description || '';
    feedbackType.color = color || '#3B82F6';
    feedbackType.icon = icon || 'FileText';

    await feedbackType.save();
    
    res.json({
      message: 'Feedback type updated successfully',
      feedbackType
    });
  } catch (error) {
    console.error('Error updating feedback type:', error);
    res.status(500).json({ message: 'Error updating feedback type' });
  }
});

// Delete feedback type (admin only) - only if created by this admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const feedbackType = await FeedbackType.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!feedbackType) {
      return res.status(404).json({ message: 'Feedback type not found' });
    }

    await feedbackType.remove();
    
    res.json({ message: 'Feedback type deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback type:', error);
    res.status(500).json({ message: 'Error deleting feedback type' });
  }
});

// Toggle feedback type status (admin only) - only if created by this admin
router.patch('/:id/toggle', adminAuth, async (req, res) => {
  try {
    const feedbackType = await FeedbackType.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!feedbackType) {
      return res.status(404).json({ message: 'Feedback type not found' });
    }

    feedbackType.isActive = !feedbackType.isActive;
    await feedbackType.save();
    
    res.json({
      message: `Feedback type ${feedbackType.isActive ? 'activated' : 'deactivated'} successfully`,
      feedbackType
    });
  } catch (error) {
    console.error('Error toggling feedback type:', error);
    res.status(500).json({ message: 'Error toggling feedback type' });
  }
});

module.exports = router; 