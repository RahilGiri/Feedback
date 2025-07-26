const express = require('express');
const PDFDocument = require('pdfkit');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const Feedback = require('../models/Feedback');
const FeedbackType = require('../models/FeedbackType');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Delete feedback (admin only) - only if it belongs to admin's types
router.delete('/feedback/:id', adminAuth, async (req, res) => {
  try {
    // Get feedback types created by this admin
    const adminFeedbackTypes = await FeedbackType.find({ 
      createdBy: req.user._id,
      isActive: true 
    }).select('_id');

    const adminTypeIds = adminFeedbackTypes.map(ft => ft._id);

    // Find feedback that belongs to admin's types
    const feedback = await Feedback.findOne({
      _id: req.params.id,
      feedbackTypeId: { $in: adminTypeIds }
    });
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found or access denied' });
    }

    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Error deleting feedback' });
  }
});

// Export feedback as CSV (admin only) - filtered by admin's types
router.get('/export/csv', adminAuth, async (req, res) => {
  try {
    const { type, rating, search } = req.query;
    
    // Get feedback types created by this admin
    const adminFeedbackTypes = await FeedbackType.find({ 
      createdBy: req.user._id,
      isActive: true 
    }).select('_id name');

    if (adminFeedbackTypes.length === 0) {
      return res.status(404).json({ message: 'No feedback types found for this admin' });
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

    const feedbacks = await Feedback.find(query)
      .populate('feedbackTypeId', 'name')
      .sort({ createdAt: -1 });

    const csvWriter = createCsvWriter({
      path: 'feedback-export.csv',
      header: [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'type', title: 'Type' },
        { id: 'message', title: 'Message' },
        { id: 'rating', title: 'Rating' },
        { id: 'createdAt', title: 'Submitted At' }
      ]
    });

    const records = feedbacks.map(feedback => ({
      name: feedback.name || 'Anonymous',
      email: feedback.email || 'No email',
      type: feedback.feedbackTypeId?.name || feedback.type,
      message: feedback.message,
      rating: feedback.rating,
      createdAt: feedback.createdAt.toISOString()
    }));

    await csvWriter.writeRecords(records);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=feedback-export.csv');
    
    // Read and send the file
    const fs = require('fs');
    const fileContent = fs.readFileSync('feedback-export.csv');
    res.send(fileContent);
    
    // Clean up the temporary file
    fs.unlinkSync('feedback-export.csv');
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ message: 'Error exporting CSV' });
  }
});

// Export feedback as PDF (admin only) - filtered by admin's types
router.get('/export/pdf', adminAuth, async (req, res) => {
  try {
    const { type, rating, search } = req.query;
    
    // Get feedback types created by this admin
    const adminFeedbackTypes = await FeedbackType.find({ 
      createdBy: req.user._id,
      isActive: true 
    }).select('_id name');

    if (adminFeedbackTypes.length === 0) {
      return res.status(404).json({ message: 'No feedback types found for this admin' });
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

    const feedbacks = await Feedback.find(query)
      .populate('feedbackTypeId', 'name')
      .sort({ createdAt: -1 });

    const doc = new PDFDocument();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=feedback-export.pdf');
    
    doc.pipe(res);

    // Add title
    doc.fontSize(20).text('Feedback Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    // Add feedback entries
    feedbacks.forEach((feedback, index) => {
      doc.fontSize(14).text(`Feedback #${index + 1}`, { underline: true });
      doc.fontSize(10);
      doc.text(`Name: ${feedback.name || 'Anonymous'}`);
      doc.text(`Email: ${feedback.email || 'No email'}`);
      doc.text(`Type: ${feedback.feedbackTypeId?.name || feedback.type}`);
      doc.text(`Rating: ${feedback.rating}/5`);
      doc.text(`Submitted: ${feedback.createdAt.toLocaleDateString()}`);
      doc.moveDown();
      doc.text('Message:');
      doc.text(feedback.message, { indent: 20 });
      doc.moveDown(2);
    });

    doc.end();
  } catch (error) {
    console.error('Error exporting PDF:', error);
    res.status(500).json({ message: 'Error exporting PDF' });
  }
});

module.exports = router; 