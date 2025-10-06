import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authRegister } from '../services/api';
import { authService } from '../services/auth'; // ✅ Add this import
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authRegister({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      // Store auth data
      authService.setToken(response.token);
      authService.setUser(response.user);
      
      // ✅ Redirect to unified profile page (not profile-setup)
      navigate('/profile');
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Join us and discover your perfect career path</p>
        </div>
        
        {error && (
          <div className="error">
            <span>❌</span>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="form-input"
              required
            />
          </div>
          
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Creating Account...
              </>
            ) : (
              '🚀 Create Account'
            )}
          </button>
        </form>
        
        <div className="login-link">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;