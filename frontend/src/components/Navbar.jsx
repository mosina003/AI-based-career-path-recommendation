import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // ✅ SAFE USER RETRIEVAL
  let user = null;
  try {
    user = authService.getUser();
  } catch (error) {
    console.error('Error getting current user:', error);
  }

  const authenticated = authService.isAuthenticated();

  const handleLogout = () => {
    try {
      authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
      // Force logout anyway
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // ✅ Handle Home click - prevent reload if already on home
  const handleHomeClick = (e) => {
    // If already on home page, prevent navigation
    if (location.pathname === '/home' || location.pathname === '/') {
      e.preventDefault();
      // Optionally scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    // Otherwise, allow normal navigation
  };

  // ✅ Handle About scroll to assessment types section
  const handleAboutClick = (e) => {
    e.preventDefault();
    
    // If not on home page, navigate to home first
    if (location.pathname !== '/home' && location.pathname !== '/') {
      navigate('/home');
      // Wait for navigation then scroll
      setTimeout(() => {
        scrollToAssessmentTypes();
      }, 300);
    } else {
      // Already on home page, just scroll
      scrollToAssessmentTypes();
    }
  };

  // ✅ Handle Contact scroll to contact section
  const handleContactClick = (e) => {
    e.preventDefault();
    
    // If not on home page, navigate to home first
    if (location.pathname !== '/home' && location.pathname !== '/') {
      navigate('/home');
      // Wait for navigation then scroll
      setTimeout(() => {
        scrollToContact();
      }, 300);
    } else {
      // Already on home page, just scroll
      scrollToContact();
    }
  };

  const scrollToAssessmentTypes = () => {
    const assessmentSection = document.querySelector('.assessment-types');
    if (assessmentSection) {
      assessmentSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const scrollToContact = () => {
    // Try multiple selectors for contact
    const targets = [
      '.contact-info',
      '#contact',
      '[data-section="contact"]'
    ];
    
    for (const selector of targets) {
      const element = document.querySelector(selector);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        console.log(`Scrolled to: ${selector}`); // Debug log
        return;
      }
    }
    console.log('Contact section not found'); // Debug log
  };

  const isActivePage = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const navLinks = authenticated ? [
    { path: '/dashboard', label: 'Dashboard', icon: '🎯' },
    { path: '/quiz', label: 'Take Quiz', icon: '📝' },
    { path: '/manual-prediction', label: 'Manual Entry', icon: '✍️' },
    { path: '/results', label: 'Results', icon: '📊' }
  ] : [
    { path: '/home', label: 'Home', icon: '🏠', onClick: handleHomeClick }, // ✅ Add onClick for Home
    { path: '#about', label: 'About', icon: 'ℹ️', onClick: handleAboutClick },
    { path: '#contact', label: 'Contact', icon: '📞', onClick: handleContactClick }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo - Also handle smart navigation */}
        <Link 
          to={authenticated ? "/dashboard" : "/home"} 
          className="navbar-logo"
          onClick={(e) => {
            if (!authenticated && (location.pathname === '/home' || location.pathname === '/')) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <div className="logo-icon">🎓</div>
          <span className="logo-text">AI Career Path</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-menu">
          {navLinks.map((link) => (
            link.onClick ? (
              // ✅ Handle buttons with onClick (Home, About, Contact)
              <button
                key={link.path}
                onClick={link.onClick}
                className={`navbar-link navbar-button ${link.path === '/home' && (location.pathname === '/home' || location.pathname === '/') ? 'active' : ''}`}
              >
                <span className="link-icon">{link.icon}</span>
                {link.label}
              </button>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar-link ${isActivePage(link.path)}`}
              >
                <span className="link-icon">{link.icon}</span>
                {link.label}
              </Link>
            )
          ))}
        </div>

        {/* User Section */}
        <div className="navbar-user">
          {authenticated ? (
            <div className="user-menu">
              <button 
                className="user-avatar"
                onClick={toggleUserMenu}
              >
                <div className="avatar-circle">
                  {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="user-name">{user?.username || 'User'}</span>
                <span className="dropdown-arrow">▼</span>
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="user-info">
                      <div className="user-avatar-large">
                        {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="user-name-large">{user?.username || 'User'}</div>
                        <div className="user-email">{user?.email || 'user@example.com'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">
                      <span>👤</span> Profile
                    </Link>
                    <Link to="/results" className="dropdown-item">
                      <span>📊</span> My Results
                    </Link>
                   
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <span>🚪</span> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {navLinks.map((link) => (
              link.onClick ? (
                <button
                  key={link.path}
                  onClick={(e) => {
                    link.onClick(e);
                    setIsMenuOpen(false);
                  }}
                  className={`mobile-link mobile-button ${link.path === '/home' && (location.pathname === '/home' || location.pathname === '/') ? 'active' : ''}`}
                >
                  <span className="link-icon">{link.icon}</span>
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`mobile-link ${isActivePage(link.path)}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="link-icon">{link.icon}</span>
                  {link.label}
                </Link>
              )
            ))}
            
            {authenticated && (
              <>
                <div className="mobile-divider"></div>
                <div className="mobile-user-info">
                  <div className="mobile-avatar">
                    {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span>{user?.username || 'User'}</span>
                </div>
                <Link to="/profile" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                  👤 Profile
                </Link>
                <button onClick={handleLogout} className="mobile-logout">
                  🚪 Logout
                </button>
              </>
            )}
            
            {!authenticated && (
              <>
                <div className="mobile-divider"></div>
                <Link to="/login" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="mobile-link primary" onClick={() => setIsMenuOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;