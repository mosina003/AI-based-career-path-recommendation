import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CareerCard from '../components/CareerCard';
import QuizCard from '../components/QuizCard';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import { getCurrentUser, getDashboardStats, getUserActivity } from '../services/api'; // ✅ ADD IMPORTS
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [savedCareers, setSavedCareers] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // ✅ Get current user from localStorage
      const currentUser = getCurrentUser();
      setUser(currentUser);

      // ✅ Get dashboard stats (simple function, no backend call)
      const dashboardStats = getDashboardStats();
      setStats(dashboardStats);

      // ✅ Get user activity (simple function, no backend call)
      const activity = getUserActivity();
      setRecentActivity(activity.data?.recentActivities || []);

      // ✅ Skip saved careers for now (no backend endpoint)
      setSavedCareers([]);

    } catch (error) {
      console.error('Error loading dashboard:', error);
      
      // ✅ FALLBACK DATA TO ENSURE DASHBOARD LOADS
      const fallbackUser = getCurrentUser();
      setUser(fallbackUser);
      setStats({ data: { userName: fallbackUser?.name || 'User' } });
      setRecentActivity([]);
      setSavedCareers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizPath = () => {
    navigate('/quiz');
  };

  const handleManualPath = () => {
    navigate('/manual-prediction');
  };

  const handleViewResults = () => {
    navigate('/results');
  };

  if (loading) {
    return <Loader message="Loading your dashboard..." />;
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className="dashboard-content">
        {/* Hero Section */}
        <div className="dashboard-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome back, <span className="user-name">{user?.name || user?.username || 'Student'}!</span> 🎯
            </h1>
            <p className="hero-subtitle">
              Ready to discover your perfect career path with AI-powered insights?
            </p>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">AI</div>
              <div className="stat-label">Powered</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">3</div>
              <div className="stat-label">Assessment Types</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">95%</div>
              <div className="stat-label">Accuracy</div>
            </div>
          </div>
        </div>

        {/* Prediction Methods */}
        <div className="prediction-section">
          <h2 className="section-title">Choose Your Career Discovery Method</h2>
          <p className="section-subtitle">
            Select the approach that best fits your current knowledge and experience level
          </p>

          <div className="prediction-methods">
            {/* Method 1: Manual Skills Entry */}
            <div className="method-card manual-method">
              <div className="method-header">
                <div className="method-icon">💼</div>
                <div className="method-badge">Quick Path</div>
              </div>
              
              <div className="method-content">
                <h3 className="method-title">I Know My Skills</h3>
                <p className="method-description">
                  Perfect for experienced students who can clearly describe their abilities and interests
                </p>
                
                <div className="method-features">
                  <div className="feature-item">
                    <span className="feature-icon">⚡</span>
                    <span>Quick & Direct Assessment</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🎯</span>
                    <span>Instant AI Analysis</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🗺️</span>
                    <span>Personalized Roadmap</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">⏱️</span>
                    <span>5-10 Minutes</span>
                  </div>
                </div>
              </div>
              
              <div className="method-actions">
                <button 
                  className="method-btn primary"
                  onClick={handleManualPath}
                >
                  Enter My Skills →
                </button>
                <div className="method-note">
                  Best for students with programming experience
                </div>
              </div>
            </div>

            {/* Method 2: Quiz Assessment */}
            <div className="method-card quiz-method">
              <div className="method-header">
                <div className="method-icon">🧭</div>
                <div className="method-badge recommended">Recommended</div>
              </div>
              
              <div className="method-content">
                <h3 className="method-title">Help Me Discover</h3>
                <p className="method-description">
                  Perfect for students exploring their potential through comprehensive assessment
                </p>
                
                <div className="method-features">
                  <div className="feature-item">
                    <span className="feature-icon">📊</span>
                    <span>5 Assessment Categories</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🤖</span>
                    <span>AI-Powered Analysis</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🎯</span>
                    <span>25 Comprehensive Questions</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">⏱️</span>
                    <span>25-30 Minutes</span>
                  </div>
                </div>
              </div>
              
              <div className="method-actions">
                <button 
                  className="method-btn secondary"
                  onClick={handleQuizPath}
                >
                  Take Assessment →
                </button>
                <div className="method-note">
                  Comprehensive evaluation for all skill levels
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity - Only show if data exists */}
        {recentActivity && recentActivity.length > 0 && (
          <div className="recent-activity">
            <h3 className="activity-title">Your Recent Activity</h3>
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-card">
                <div className="activity-content">
                  <div className="activity-icon">🎯</div>
                  <div className="activity-info">
                    <h4>{activity.type === 'prediction' ? 'Latest Career Prediction' : 'Profile Update'}</h4>
                    <p>{activity.message}</p>
                    <span className="activity-date">
                      {new Date(activity.date || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Getting Started */}
        <div className="getting-started">
          <div className="getting-started-content">
            <h3>🚀 Getting Started</h3>
            <p>
              Not sure which path to choose? Here's a quick guide to help you decide:
            </p>
            
            <div className="guide-items">
              <div className="guide-item">
                <div className="guide-icon">💡</div>
                <div className="guide-text">
                  <strong>Choose Manual Entry</strong> if you have programming experience 
                  or clear knowledge of your technical skills
                </div>
              </div>
              <div className="guide-item">
                <div className="guide-icon">🔍</div>
                <div className="guide-text">
                  <strong>Choose Quiz Assessment</strong> if you're exploring career options 
                  or want a comprehensive skill evaluation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;