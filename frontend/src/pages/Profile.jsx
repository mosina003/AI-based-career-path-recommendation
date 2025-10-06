import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { saveUserProfile, getUserProfile } from '../services/api';
import Navbar from '../components/Navbar';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phoneNumber: '',
    university: '',
    course: '',
    skills: '',
    interests: ''
  });
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Get user from auth service
      const userData = authService.getUser();
      console.log('User data from authService:', userData);
      setUser(userData);
      
      if (!userData) {
        navigate('/login');
        return;
      }

      // ✅ TRY TO LOAD PROFILE FROM MYSQL DATABASE
      try {
        const profile = await getUserProfile();
        console.log('Profile loaded from MySQL:', profile);
        
        setFormData({
          name: profile.name || '',
          age: profile.age || '',
          phoneNumber: profile.phoneNumber || '',
          university: profile.university || '',
          course: profile.course || '',
          skills: profile.skills || '',
          interests: profile.interests || ''
        });
        setHasProfile(true);
        setEditing(false);
        
      } catch (error) {
        console.log('No profile found in database, starting in creation mode');
        setHasProfile(false);
        setEditing(true);
      }
      
    } catch (error) {
      console.error('Error loading user data:', error);
      setErrors({ submit: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

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

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (formData.age && (formData.age < 16 || formData.age > 100)) {
      newErrors.age = 'Please enter a valid age between 16 and 100';
    }

    if (formData.phoneNumber && !/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // ✅ SAVE TO MYSQL DATABASE
      const profileData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        email: user?.email // Include email for backend identification
      };

      console.log('💾 Saving profile to MySQL database:', profileData);

      const savedProfile = await saveUserProfile(profileData);
      console.log('✅ Profile saved to MySQL:', savedProfile);
      
      // Update form with saved data
      setFormData({
        name: savedProfile.name || '',
        age: savedProfile.age || '',
        phoneNumber: savedProfile.phoneNumber || '',
        university: savedProfile.university || '',
        course: savedProfile.course || '',
        skills: savedProfile.skills || '',
        interests: savedProfile.interests || ''
      });
      
      if (hasProfile) {
        setSuccessMessage('Profile updated successfully in database!');
      } else {
        setSuccessMessage('Profile created successfully in database!');
        setHasProfile(true);
      }
      
      // Switch back to view mode
      setEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('❌ Error saving profile to database:', error);
      setErrors({ submit: error.message || 'Failed to save profile to database' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setSuccessMessage('');
    setErrors({});
  };

  const handleCancel = () => {
    // Reset form data to original values
    loadUserData();
    setEditing(false);
    setErrors({});
    setSuccessMessage('');
  };

  const handleSkipToAssessment = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <Navbar />
        <div className="loading-state">
          <div className="loading-spinner-large"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Navbar />
      
      <div className="profile-content">
        <div className="profile-header">
          <h1>
            {hasProfile ? 'My Profile' : 'Complete Your Profile'}
          </h1>
          <p>
            {hasProfile 
              ? 'View and manage your account information' 
              : 'Help us personalize your career recommendations'
            }
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="success-message">
            <span>✅</span>
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="error-message">
            <span>❌</span>
            {errors.submit}
          </div>
        )}

        <div className="profile-card">
          {/* User Info Header */}
          <div className="user-info-header">
            <div className="user-avatar-large">
              {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-basic-info">
              <h2>{user?.username || 'User'}</h2>
              <p className="user-email">{user?.email}</p>
            </div>
            
            {hasProfile && !editing && (
              <button onClick={handleEdit} className="edit-profile-btn">
                <span>✏️</span> Edit Profile
              </button>
            )}
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-grid">
              {/* Name */}
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">👤</span>
                  Full Name *
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter your full name"
                    required
                  />
                ) : (
                  <div className="form-display">
                    {formData.name || 'Not provided'}
                  </div>
                )}
                {errors.name && (
                  <div className="field-error">
                    <span className="field-error-icon">⚠️</span>
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Age */}
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">🎂</span>
                  Age
                </label>
                {editing ? (
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className={`form-input ${errors.age ? 'error' : ''}`}
                    placeholder="Your age"
                    min="16"
                    max="100"
                  />
                ) : (
                  <div className="form-display">
                    {formData.age || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">📱</span>
                  Phone Number
                </label>
                {editing ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                    placeholder="+1 (555) 123-4567"
                  />
                ) : (
                  <div className="form-display">
                    {formData.phoneNumber || 'Not provided'}
                  </div>
                )}
              </div>

              {/* University */}
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">🏫</span>
                  University/College
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., MIT, Stanford University"
                  />
                ) : (
                  <div className="form-display">
                    {formData.university || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Course */}
              <div className="form-group full-width">
                <label className="form-label">
                  <span className="label-icon">📚</span>
                  Course/Major
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., Computer Science, Business"
                  />
                ) : (
                  <div className="form-display">
                    {formData.course || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Skills */}
              <div className="form-group full-width">
                <label className="form-label">
                  <span className="label-icon">⚡</span>
                  Skills & Technologies
                </label>
                {editing ? (
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="e.g., Python, Java, React, Machine Learning"
                    rows="3"
                  />
                ) : (
                  <div className="form-display multiline">
                    {formData.skills || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Interests */}
              <div className="form-group full-width">
                <label className="form-label">
                  <span className="label-icon">💡</span>
                  Career Interests
                </label>
                {editing ? (
                  <textarea
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="e.g., AI, Web Development, Data Science"
                    rows="3"
                  />
                ) : (
                  <div className="form-display multiline">
                    {formData.interests || 'Not provided'}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {editing && (
              <div className="form-actions">
                {hasProfile ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn btn-secondary"
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <div className="loading-spinner"></div>
                          Saving to Database...
                        </>
                      ) : (
                        '💾 Save to Database'
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleSkipToAssessment}
                      className="btn btn-secondary"
                      disabled={saving}
                    >
                      Skip for Now
                    </button>
                    
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <div className="loading-spinner"></div>
                          Creating Profile in Database...
                        </>
                      ) : (
                        '🚀 Save to Database'
                      )}
                    </button>
                  </>
                )}
              </div>
            )}
          </form>

          {/* Assessment Actions */}
          {hasProfile && !editing && (
            <div className="assessment-actions">
              <h3>Ready for Assessment?</h3>
              <p>Your profile is complete! Take an assessment to get personalized career recommendations.</p>
              <div className="action-buttons">
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="btn btn-primary"
                >
                  📊 Go to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;