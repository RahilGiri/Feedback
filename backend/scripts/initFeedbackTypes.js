const mongoose = require('mongoose');
const FeedbackType = require('../models/FeedbackType');
const User = require('../models/User');
require('dotenv').config({ path: './.env' });

const defaultTypes = [
  {
    name: 'Product',
    description: 'Feedback about our products and services',
    color: '#3B82F6',
    icon: 'Package'
  },
  {
    name: 'Event',
    description: 'Feedback about events and activities',
    color: '#10B981',
    icon: 'Calendar'
  },
  {
    name: 'Website',
    description: 'Feedback about website functionality and design',
    color: '#F59E0B',
    icon: 'Globe'
  },
  {
    name: 'Support',
    description: 'Feedback about customer support experience',
    color: '#EF4444',
    icon: 'Headphones'
  },
  {
    name: 'Feature Request',
    description: 'Suggestions for new features or improvements',
    color: '#8B5CF6',
    icon: 'Lightbulb'
  }
];

async function initializeFeedbackTypes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/feedback-collector');
    console.log('Connected to MongoDB');

    // Get the first admin user or create one
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    console.log('Initializing feedback types...');

    for (const typeData of defaultTypes) {
      const existingType = await FeedbackType.findOne({ name: typeData.name });
      
      if (!existingType) {
        const feedbackType = new FeedbackType({
          ...typeData,
          createdBy: adminUser._id
        });
        
        await feedbackType.save();
        console.log(`✅ Created feedback type: ${typeData.name}`);
      } else {
        console.log(`⏭️  Feedback type already exists: ${typeData.name}`);
      }
    }

    console.log('\n🎉 Feedback types initialization completed!');
    
    // Display all feedback types
    const allTypes = await FeedbackType.find().sort({ name: 1 });
    console.log('\n📋 Current feedback types:');
    allTypes.forEach(type => {
      console.log(`  - ${type.name} (${type.isActive ? 'Active' : 'Inactive'})`);
    });

  } catch (error) {
    console.error('Error initializing feedback types:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the initialization
initializeFeedbackTypes(); 