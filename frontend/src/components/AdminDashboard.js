import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  LogOut, 
  ArrowLeft,
  Star,
  MessageSquare,
  User,
  Mail,
  Calendar,
  FileText,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import FeedbackTypeManager from './FeedbackTypeManager';

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    rating: '',
    search: ''
  });
  const [feedbackTypes, setFeedbackTypes] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    hasNext: false,
    hasPrev: false
  });
  const [activeTab, setActiveTab] = useState('dashboard');

  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchFeedbackTypes = async () => {
    try {
      const response = await axios.get('/api/feedback-types/admin');
      setFeedbackTypes(response.data);
    } catch (error) {
      console.error('Error fetching feedback types:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid, redirect to login
        logout();
        navigate('/admin/login');
      }
    }
  };

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current,
        limit: 10,
        ...filters
      });

      const response = await axios.get(`/api/feedback?${params}`);
      setFeedbacks(response.data.feedbacks);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Failed to fetch feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/feedback/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    fetchFeedbacks();
    fetchStats();
    fetchFeedbackTypes();
  }, [isAuthenticated, navigate, filters, pagination.current]);
    try {
      const response = await axios.get('/api/feedback-types/admin');
      setFeedbackTypes(response.data);
    } catch (error) {
      console.error('Error fetching feedback types:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid, redirect to login
        logout();
        navigate('/admin/login');
      }
    }
  };

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current,
        limit: 10,
        ...filters
      });

      const response = await axios.get(`/api/feedback?${params}`);
      setFeedbacks(response.data.feedbacks);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Failed to fetch feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/feedback/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/feedback/${id}`);
      toast.success('Feedback deleted successfully');
      fetchFeedbacks();
      fetchStats();
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Failed to delete feedback');
    }
  };

  const handleExport = async (format) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await axios.get(`/api/admin/export/${format}?${params}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `feedback-export.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`${format.toUpperCase()} export successful`);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Feedback Form
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </div>
            </button>
            <button
              onClick={() => setActiveTab('types')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'types'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Feedback Types
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'types' ? (
          <FeedbackTypeManager />
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalFeedback || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Average Rating</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.averageRating || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Types</p>
                    <p className="text-2xl font-semibold text-gray-900">{feedbackTypes.filter(t => t.isActive).length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.monthlyFeedback?.find(m => 
                        m._id.year === new Date().getFullYear() && 
                        m._id.month === new Date().getMonth() + 1
                      )?.count || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => handleExport('csv')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Search className="w-4 h-4 inline mr-1" />
                      Search
                    </label>
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Search feedback..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Filter className="w-4 h-4 inline mr-1" />
                      Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">All Types</option>
                      {feedbackTypes.map((type) => (
                        <option key={type._id} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Star className="w-4 h-4 inline mr-1" />
                      Rating
                    </label>
                    <select
                      value={filters.rating}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">All Ratings</option>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFilters({ type: '', rating: '', search: '' });
                        setPagination(prev => ({ ...prev, current: 1 }));
                      }}
                      className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Feedback</h2>
              </div>
              {loading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                </div>
              ) : feedbacks.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No feedback found. {filters.search || filters.type || filters.rating ? 'Try adjusting your filters.' : 'Start by creating some feedback types.'}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {feedbacks.map((feedback) => (
                    <div key={feedback._id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {feedback.feedbackTypeId?.name || feedback.type}
                            </span>
                            <div className="flex items-center">
                              {getRatingStars(feedback.rating)}
                            </div>
                          </div>
                          <p className="text-gray-900 mb-2">{feedback.message}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {feedback.name && (
                              <span className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {feedback.name}
                              </span>
                            )}
                            {feedback.email && (
                              <span className="flex items-center">
                                <Mail className="w-4 h-4 mr-1" />
                                {feedback.email}
                              </span>
                            )}
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(feedback.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteFeedback(feedback._id)}
                          className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.total > 1 && (
              <div className="mt-6 flex justify-center">
                <nav className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.current - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-700">
                    Page {pagination.current} of {pagination.total}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.current + 1)}
                    disabled={!pagination.hasNext}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 