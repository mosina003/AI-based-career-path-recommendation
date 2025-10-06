import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import Navbar from '../components/Navbar';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const authenticated = authService.isAuthenticated();

  const handleGetStarted = () => {
    if (authenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze your skills and interests to provide accurate career predictions.'
    },
    {
      icon: '📊',
      title: 'Comprehensive Assessment',
      description: 'Three-dimensional evaluation covering technical skills, interests, and problem-solving abilities.'
    },
    {
      icon: '🗺️',
      title: 'Personalized Roadmap',
      description: 'Get detailed learning paths with resources, projects, and milestones for your chosen career.'
    },
    {
      icon: '⚡',
      title: 'Instant Results',
      description: 'Receive immediate career recommendations with confidence scores and detailed explanations.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Computer Science Student',
      content: 'This AI career predictor helped me discover my passion for data science. The roadmap was incredibly detailed!',
      rating: 5
    },
    {
      name: 'Mike Johnson',
      role: 'Career Changer',
      content: 'I was confused about switching careers. The assessment gave me clarity and confidence in my decision.',
      rating: 5
    },
    {
      name: 'Priya Patel',
      role: 'Recent Graduate',
      content: 'The personalized learning roadmap helped me land my dream job as a full-stack developer!',
      rating: 5
    }
  ];

  return (
    <div className="home-container">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Discover Your Perfect
              <span className="gradient-text"> Career Path</span>
              <br />with AI Intelligence 🚀
            </h1>
            <p className="hero-description">
              Get personalized career recommendations and detailed learning roadmaps 
              powered by advanced AI analysis of your skills, interests, and goals.
            </p>
            
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Accuracy Rate</span>
              </div>
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Students Helped</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Career Paths</span>
              </div>
            </div>

            <div className="hero-actions">
              <button 
                className="cta-button primary"
                onClick={handleGetStarted}
              >
                {authenticated ? 'Go to Dashboard' : 'Get Started Free'} →
              </button>
              {!authenticated && (
                <Link to="/login" className="cta-button secondary">
                  Sign In
                </Link>
              )}
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="ai-animation">
              <div className="brain-icon">🧠</div>
              <div className="processing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="career-icons">
                <div className="career-icon">💻</div>
                <div className="career-icon">📊</div>
                <div className="career-icon">🎨</div>
                <div className="career-icon">🔬</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Three simple steps to discover your ideal career path
          </p>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Choose Your Assessment</h3>
                <p>
                  Select between quick manual entry for experienced users or 
                  comprehensive quiz for detailed evaluation.
                </p>
              </div>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>AI Analysis</h3>
                <p>
                  Our advanced AI engine analyzes your responses using machine 
                  learning algorithms trained on thousands of career outcomes.
                </p>
              </div>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Get Your Roadmap</h3>
                <p>
                  Receive personalized career recommendations with detailed 
                  learning paths, resources, and milestone tracking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Our AI Career Predictor?</h2>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Types */}
      <section className="assessment-types" id="assessment-types" data-section="assessment">
        <div className="container">
          <h2 className="section-title">Two Assessment Paths</h2>
          
          <div className="assessment-grid">
            <div className="assessment-card">
              <div className="assessment-header">
                <div className="assessment-icon">💼</div>
                <h3>Manual Skills Entry</h3>
                <div className="time-badge">5-10 min</div>
              </div>
              <p className="assessment-description">
                Perfect for experienced students who can clearly describe their 
                technical skills and career interests.
              </p>
              <ul className="assessment-features">
                <li>✅ Quick assessment</li>
                <li>✅ Direct skills input</li>
                <li>✅ Instant AI analysis</li>
                <li>✅ Immediate results</li>
              </ul>
            </div>
            
            <div className="assessment-card featured">
              <div className="assessment-header">
                <div className="assessment-icon">🧭</div>
                <h3>Comprehensive Quiz</h3>
                <div className="time-badge recommended">15-20 min</div>
              </div>
              <p className="assessment-description">
                Comprehensive three-part assessment covering technical abilities, 
                interests, and problem-solving skills.
              </p>
              <ul className="assessment-features">
                <li>✅ TechQuiz - Programming aptitude</li>
                <li>✅ InterestProfile - Career alignment</li>
                <li>✅ ScenarioSolver - Analytical thinking</li>
                <li>✅ Multi-dimensional analysis</li>
              </ul>
              <div className="featured-badge">Most Popular</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Students Say</h2>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <div className="rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="star">⭐</span>
                    ))}
                  </div>
                  <p className="testimonial-text">"{testimonial.content}"</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="author-info">
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-role">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Contact Info */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Discover Your Career Path?</h2>
            <p className="cta-description">
              Join thousands of students who have found their perfect career 
              match with our AI-powered assessment.
            </p>
            
            <div className="cta-actions">
              <button 
                className="cta-button large primary"
                onClick={handleGetStarted}
              >
                {authenticated ? 'Go to Dashboard' : 'Start Free Assessment'} 🚀
              </button>
            </div>
            
            <div className="cta-note">
              
            </div>

            {/* ✅ Contact Information */}
            <div className="contact-info" id="contact" data-section="contact">
              <div className="contact-divider">
                <span>Need Help?</span>
              </div>
              
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <div className="contact-text">
                    <span className="contact-label">Email us at</span>
                    <a href="mailto:smosina003@gmail.com" className="contact-link">
                      smosina003@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="contact-item">
                  <span className="contact-icon">📱</span>
                  <div className="contact-text">
                    <span className="contact-label">Call us at</span>
                    <a href="tel:+919123582088" className="contact-link">
                      +91 9123582088
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="contact-support">
                <span>💬 24/7 Support Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;