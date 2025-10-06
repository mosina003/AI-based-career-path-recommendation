import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authLogin } from '../services/api';
import { authService } from '../services/auth';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await authLogin(formData);
      
      // Store auth data
      authService.setToken(response.token);
      authService.setUser(response.user);
      
      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      setErrors({ submit: error.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="bg-pattern"></div>
      </div>

      <div className="login-content">
        {/* Left Side - Branding */}
        <div className="login-branding">
          <div className="brand-content">
            <div className="brand-logo">
              <div className="logo-icon">🎓</div>
              <div className="logo-text">AI Career Path</div>
            </div>

            <h1 className="brand-title">Welcome Back! 👋</h1>
            <p className="brand-description">
              Continue your journey to discovering the perfect career path with our AI-powered career predictor.
            </p>

            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">🤖</span>
                <span>AI-Powered Analysis</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Detailed Career Insights</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🗺️</span>
                <span>Personalized Roadmaps</span>
              </div>
            </div>

            <div className="testimonial">
              <div className="testimonial-content">
                <p>"This platform helped me find my passion for data science!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">S</div>
                <div>
                  <div className="author-name">Sarah Chen</div>
                  <div className="author-role">Data Science Student</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Clean Form */}
        <div className="login-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Sign In to Your Account</h2>
              <p>Enter your credentials to access your dashboard</p>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span>{errors.submit}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'error' : formData.email ? 'success' : ''}`}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                  <div className="input-icon">
                    {errors.email ? '⚠️' : formData.email ? '✅' : '📧'}
                  </div>
                </div>
                {errors.email && (
                  <div className="field-error">
                    <span className="field-error-icon">⚠️</span>
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input ${errors.password ? 'error' : formData.password ? 'success' : ''}`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && (
                  <div className="field-error">
                    <span className="field-error-icon">⚠️</span>
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Form Options */}
              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Clean Sign Up Link */}
            <div className="signup-link">
              Don't have an account? 
              <Link to="/register">Sign up for free</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;