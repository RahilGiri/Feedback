# Feedback Collector

A complete MERN stack web application for collecting and managing feedback. Built with React, Express, MongoDB, and Node.js.

## 🚀 Features

### Frontend (React + Tailwind CSS)
- **Responsive Design**: Clean, modern UI that works on all devices
- **Feedback Form**: 
  - Name (optional)
  - Email (optional)
  - Feedback Type (Product, Event, Website)
  - Message (required, minimum 10 characters)
  - Star Rating (1-5 stars)
- **Form Validation**: Real-time validation with error messages
- **Admin Authentication**: Secure login/registration system
- **Admin Dashboard**:
  - View all feedback with pagination
  - Filter by type, rating, or search keywords
  - Delete feedback entries
  - Export data to CSV and PDF formats
  - Statistics overview

### Backend (Express + MongoDB)
- **RESTful API**: Complete CRUD operations
- **JWT Authentication**: Secure admin authentication
- **MongoDB Integration**: Mongoose ODM with proper indexing
- **Data Export**: CSV and PDF export functionality
- **Input Validation**: Express-validator for data validation
- **Error Handling**: Comprehensive error handling and logging

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd feedback-collector
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the backend directory:
   ```bash
   cd backend
   cp config.env .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/feedback-collector
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # Start MongoDB service
   mongod
   ```

## 🚀 Running the Application

### Development Mode

1. **Start both frontend and backend simultaneously**
   ```bash
   npm run dev
   ```

2. **Or start them separately**
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

### Production Mode

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd backend
   npm start
   ```

## 📱 Usage

### For Users
1. Visit `http://localhost:3000`
2. Fill out the feedback form
3. Submit your feedback (anonymously or with contact info)

### For Admins
1. Visit `http://localhost:3000/admin/login`
2. Register a new account or login
3. Access the dashboard at `http://localhost:3000/admin/dashboard`
4. View, filter, and manage feedback
5. Export data as needed

## 🔧 API Endpoints

### Public Endpoints
- `POST /api/feedback` - Submit feedback
- `GET /api/health` - Health check

### Authentication Endpoints
- `POST /api/auth/register` - Register admin user
- `POST /api/auth/login` - Login admin user
- `GET /api/auth/me` - Get current user profile

### Admin Endpoints (Protected)
- `GET /api/feedback` - Get all feedback (with filters)
- `GET /api/feedback/stats` - Get feedback statistics
- `DELETE /api/admin/feedback/:id` - Delete feedback
- `GET /api/admin/export/csv` - Export as CSV
- `GET /api/admin/export/pdf` - Export as PDF

## 🗄️ Database Schema

### Feedback Model
```javascript
{
  name: String,           // Optional
  email: String,          // Optional
  type: String,           // "Product" | "Event" | "Website"
  message: String,        // Required, min 10 chars
  rating: Number,         // 1-5
  submittedAt: Date       // Auto-generated
}
```

### User Model
```javascript
{
  username: String,       // Required, unique
  email: String,          // Required, unique
  password: String,       // Hashed
  role: String           // "admin" | "user"
}
```

## 🎨 Customization

### Styling
The application uses Tailwind CSS. You can customize the design by:
- Modifying `frontend/tailwind.config.js`
- Updating color schemes in the components
- Adding custom CSS in `frontend/src/index.css`

### Configuration
- Update environment variables in `backend/.env`
- Modify MongoDB connection settings
- Adjust JWT token expiration
- Change server port and proxy settings

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Server-side validation with express-validator
- **CORS Protection**: Configured for development and production
- **Environment Variables**: Sensitive data stored in environment files

## 📊 Features in Detail

### Feedback Collection
- Anonymous feedback support
- Optional contact information
- Multiple feedback types
- Star rating system
- Real-time form validation

### Admin Dashboard
- **Statistics Overview**:
  - Total feedback count
  - Average rating
  - Monthly feedback count
  - Quick export buttons

- **Advanced Filtering**:
  - Search by name, email, or message content
  - Filter by feedback type
  - Filter by rating
  - Clear all filters

- **Data Management**:
  - Paginated feedback list
  - Delete individual feedback
  - Export filtered data

- **Export Options**:
  - CSV export with all feedback data
  - PDF export with formatted report
  - Filtered exports based on current filters

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify database permissions

2. **Port Already in Use**
   - Change port in `.env` file
   - Kill existing processes on the port

3. **Frontend Not Loading**
   - Check if backend is running
   - Verify proxy settings in `package.json`
   - Clear browser cache

4. **Authentication Issues**
   - Check JWT secret in `.env`
   - Verify token expiration settings
   - Clear browser localStorage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ using the MERN stack** 