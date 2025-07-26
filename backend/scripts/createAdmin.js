const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: './.env' });

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/feedback-collector');
    console.log('Connected to MongoDB');

    // Check if admin users already exist
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount > 0) {
      console.log('⚠️  Admin users already exist. Use the registration form with the admin code instead.');
      console.log(`Admin invitation code: ${process.env.ADMIN_INVITATION_CODE || 'SUPER_ADMIN_2024'}`);
      process.exit(0);
    }

    // Get admin details from command line arguments or use defaults
    const username = process.argv[2] || 'admin';
    const email = process.argv[3] || 'admin@company.com';
    const password = process.argv[4] || 'admin123456';

    // Validate email domain if restrictions are set
    const allowedDomains = process.env.ALLOWED_EMAIL_DOMAINS ? 
      process.env.ALLOWED_EMAIL_DOMAINS.split(',').map(d => d.trim()) : [];
    
    if (allowedDomains.length > 0) {
      const emailDomain = email.split('@')[1].toLowerCase();
      if (!allowedDomains.includes(emailDomain)) {
        console.error(`❌ Email domain '${emailDomain}' not allowed. Allowed domains: ${allowedDomains.join(', ')}`);
        process.exit(1);
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      console.error('❌ User with this email or username already exists');
      process.exit(1);
    }

    // Create admin user
    const adminUser = new User({
      username,
      email,
      password,
      role: 'admin'
    });

    await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log('Role: admin');
    console.log('\n🔐 Security Recommendations:');
    console.log('1. Change the default password immediately');
    console.log('2. Update the JWT_SECRET in your environment variables');
    console.log('3. Set ADMIN_REGISTRATION_ENABLED=false to prevent unauthorized registrations');
    console.log('4. Configure ALLOWED_EMAIL_DOMAINS for additional security');
    console.log(`\n📝 Admin invitation code: ${process.env.ADMIN_INVITATION_CODE || 'SUPER_ADMIN_2024'}`);

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
createAdminUser(); 