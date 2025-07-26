import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Send, 
  MessageSquare, 
  User, 
  Mail, 
  FileText, 
  Heart,
  Users,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Zap,
  Sparkles,
  Target,
  Globe,
  Award,
  ThumbsUp,
  Search
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: '',
    message: '',
    rating: 0
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackTypes, setFeedbackTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [typeSearch, setTypeSearch] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  useEffect(() => {
    fetchFeedbackTypes();
  }, []);

  // Show loading state while fetching types
  if (loadingTypes) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading feedback form...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const fetchFeedbackTypes = async () => {
    try {
      const response = await axios.get('/api/feedback-types');
      setFeedbackTypes(response.data);
      if (response.data.length > 0 && !formData.type) {
        setFormData(prev => ({ ...prev, type: response.data[0].name }));
      }
    } catch (error) {
      console.error('Error fetching feedback types:', error);
      // Fallback to default types if API fails
      setFeedbackTypes([
        { name: 'Product', description: 'Product feedback' },
        { name: 'Event', description: 'Event feedback' },
        { name: 'Website', description: 'Website feedback' },
        { name: 'Support', description: 'Support feedback' },
        { name: 'Feature Request', description: 'Feature request feedback' }
      ]);
      // Set default type
      setFormData(prev => ({ ...prev, type: 'Product' }));
    } finally {
      setLoadingTypes(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleTypeSelect = (typeName) => {
    setFormData(prev => ({
      ...prev,
      type: typeName
    }));
    setTypeSearch('');
    setShowTypeDropdown(false);
  };

  const filteredTypes = feedbackTypes.filter(type =>
    type.name.toLowerCase().includes(typeSearch.toLowerCase())
  );

  const validateForm = () => {
    const newErrors = {};

    if (formData.name && formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.type) {
      newErrors.type = 'Please select a feedback type';
    }

    if (!formData.message || formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    if (!formData.rating || formData.rating < 1) {
      newErrors.rating = 'Please select a rating';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form data:', formData);
    
    if (!validateForm()) {
      console.log('Validation failed');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting feedback...');
      await axios.post('/api/feedback', formData);
      console.log('Response received');
      toast.success('Feedback submitted successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        type: feedbackTypes.length > 0 ? feedbackTypes[0].name : '',
        message: '',
        rating: 0
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit feedback';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      content: "The feedback system has transformed how we understand our users. It's intuitive and provides valuable insights.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "UX Designer",
      content: "Clean interface and powerful features. This feedback collector has everything we need for user research.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Success",
      content: "Our customer satisfaction has improved significantly since implementing this feedback system.",
      rating: 5,
      avatar: "ER"
    }
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your feedback is protected with enterprise-grade security"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-time Processing",
      description: "Get instant insights as feedback comes in"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "Comprehensive analytics to track trends and patterns"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Share insights with your team seamlessly"
    }
  ];

  const stats = [
    { number: "10K+", label: "Feedback Collected", icon: <MessageSquare className="w-5 h-5" /> },
    { number: "98%", label: "Satisfaction Rate", icon: <ThumbsUp className="w-5 h-5" /> },
    { number: "24/7", label: "Support Available", icon: <Clock className="w-5 h-5" /> },
    { number: "50+", label: "Happy Organizations", icon: <Award className="w-5 h-5" /> }
  ];

  const benefits = [
    "Improve product quality",
    "Enhance user experience",
    "Make data-driven decisions",
    "Build customer loyalty"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Feedback Collector</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Powered by advanced analytics</p>
              </div>
            </div>
            <Link
              to="/admin/login"
              className="inline-flex items-center px-3 sm:px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="hidden sm:inline">Admin Login</span>
              <span className="sm:hidden">Admin</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-xl">
            <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Feedback</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 px-4">
            Your voice matters! Help us improve by sharing your thoughts, suggestions, and experiences. 
            Every piece of feedback helps us create better products and services.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center mb-2 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Share Your Thoughts</h2>
                  <p className="text-gray-600 text-sm sm:text-base">We'd love to hear from you!</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Name Field */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 mr-2" />
                      Name (Optional)
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 mr-2" />
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Feedback Type with Search */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 mr-2" />
                    Feedback Type
                  </label>
                  {loadingTypes ? (
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50">
                      <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="relative">
                        <input
                          type="text"
                          value={typeSearch}
                          onChange={(e) => {
                            setTypeSearch(e.target.value);
                            setShowTypeDropdown(true);
                          }}
                          onFocus={() => setShowTypeDropdown(true)}
                          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          placeholder="Search feedback types..."
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                      
                      {showTypeDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                          {filteredTypes.length > 0 ? (
                            filteredTypes.map((type) => (
                              <button
                                key={type._id || type.name}
                                type="button"
                                onClick={() => handleTypeSelect(type.name)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                              >
                                <div className="font-medium text-gray-900">{type.name}</div>
                                {type.description && (
                                  <div className="text-sm text-gray-600">{type.description}</div>
                                )}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-500 text-center">
                              No feedback types found
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Selected Type Display */}
                      {formData.type && (
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-900">Selected: {formData.type}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, type: '' }));
                                setTypeSearch('');
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                  )}
                </div>

                {/* Rating */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                    <Star className="w-4 h-4 mr-2" />
                    Rating
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className={`p-2 rounded-xl transition-all duration-200 transform hover:scale-110 ${
                          (hoveredRating >= star || formData.rating >= star)
                            ? 'text-yellow-400 hover:text-yellow-500'
                            : 'text-gray-300 hover:text-gray-400'
                        }`}
                      >
                        <Star className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
                      </button>
                    ))}
                    <span className="ml-4 text-sm text-gray-600">
                      {formData.rating > 0 && `${formData.rating} out of 5`}
                    </span>
                  </div>
                  {errors.rating && (
                    <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Your Feedback
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tell us about your experience, suggestions, or any issues you've encountered..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum 10 characters required
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Send className="w-5 h-5 mr-2" />
                      Submit Feedback
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                Why Choose Us?
              </h3>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 group">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors duration-200">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Benefits
              </h3>
              <div className="space-y-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                What People Say
              </h3>
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">"{testimonial.content}"</p>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{testimonial.name}</p>
                        <p className="text-xs text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-white" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Thank You for Your Feedback!</h2>
            <p className="text-base sm:text-lg mb-6 opacity-90">
              Every piece of feedback helps us improve and create better experiences for everyone.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm sm:text-base">Your feedback is secure and confidential</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm; 