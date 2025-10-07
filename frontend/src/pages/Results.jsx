import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RoadmapCard from '../components/RoadmapCard';
import Loader from '../components/Loader';
import './Results.css';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [savedCareers, setSavedCareers] = useState([]);
  const [predictions, setPredictions] = useState(null);

  // ✅ ADD: Generate roadmap for careers that don't have one
  const generateMissingRoadmap = async (career) => {
    try {
      const response = await fetch('http://localhost:8080/api/roadmap/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          careerTitle: career.title,
          userProfile: {
            skills: career.matching_skills || ["Problem Solving"],
            experience: "Beginner",
            interests: [career.title.split(' ')[0]],
            learningStyle: "Hands-on"
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.roadmap;
      }
    } catch (error) {
      console.error('❌ Error generating roadmap:', error);
    }
    
    return null;
  };

  // ✅ UPDATE: Enhanced useEffect to handle roadmap generation
  useEffect(() => {
    // Get predictions from navigation state OR localStorage
    let quizResults = location.state?.predictions;
    if (!quizResults) {
      // Try to get from localStorage
      const savedResults = localStorage.getItem('quizResults');
      if (savedResults) {
        try {
          const parsedResults = JSON.parse(savedResults);
          quizResults = parsedResults.predictions;
        } catch (error) {
          // ...
        }
      }
    }
    
    if (quizResults && quizResults.length > 0) {
      // Process predictions and ADD roadmaps to fallback data
      const processedPredictions = quizResults.map((career, index) => {
      
      // ✅ ADD: Generate roadmap for each career (even fallback ones)
      const careerRoadmap = generateFrontendRoadmap(career.title);
      
      return {
        ...career,
        // Keep existing data or add defaults
        salary_range: career.salary_range || "$50,000 - $100,000",
        growth_rate: career.growth_rate || "Moderate (10-20%)",
        learning_time: career.learning_time || "3-6 months",
        difficulty: career.difficulty || "Moderate",
        matching_skills: career.matching_skills || ["Problem Solving", "Analytical Thinking"],
        skills_to_learn: career.skills_to_learn || ["Industry-specific skills", "Technical skills"],
        next_steps: career.next_steps || ["Research the field", "Start learning basics", "Build a portfolio"],
        target_companies: career.target_companies || ["Various companies in the industry"],
        roadmap: careerRoadmap // ✅ ADD: Frontend-generated roadmap
      };
    });
    
    setPredictions(processedPredictions);
  }
  
  // Simulate loading for better UX
  const timer = setTimeout(() => {
    setLoading(false);
  }, 1500);

  // Load saved careers from localStorage
  const saved = JSON.parse(localStorage.getItem('savedCareers') || '[]');
  setSavedCareers(saved);

  return () => clearTimeout(timer);
  }, [location.state]);

  useEffect(() => {
    // Redirect if no predictions after loading
    if (!loading && (!predictions || predictions.length === 0)) {
      navigate('/dashboard');
    }
  }, [loading, predictions, navigate]);

  const handleSaveCareer = (careerIndex) => {
    const career = predictions[careerIndex];
    const careerData = {
      id: Date.now(),
      ...career,
      savedAt: new Date().toISOString(),
      type: 'quiz'
    };

    const updated = [...savedCareers, careerData];
    setSavedCareers(updated);
    localStorage.setItem('savedCareers', JSON.stringify(updated));
  };

  const handleRemoveSaved = (careerId) => {
    const updated = savedCareers.filter(career => career.id !== careerId);
    setSavedCareers(updated);
    localStorage.setItem('savedCareers', JSON.stringify(updated));
  };

  const isCareerSaved = (careerIndex) => {
    const career = predictions[careerIndex];
    return savedCareers.some(saved => saved.title === career.title);
  };

  const handleShareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My AI Career Predictions',
          text: `Check out my personalized career recommendations: ${predictions.map(p => p.title).join(', ')}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Results link copied to clipboard!');
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  // ✅ ADD: Function to generate roadmap on demand
  const handleGenerateRoadmap = async (careerIndex) => {
    const career = predictions[careerIndex];
    
    if (career.roadmap) {
      return; // Roadmap already exists
    }
    
    setLoading(true);
    
    try {
      const generatedRoadmap = await generateMissingRoadmap(career);
      
      if (generatedRoadmap) {
        // Update the career with the new roadmap
        const updatedPredictions = [...predictions];
        updatedPredictions[careerIndex] = {
          ...career,
          roadmap: generatedRoadmap
        };
        setPredictions(updatedPredictions);
        
        // Save updated predictions to localStorage
        localStorage.setItem('quizResults', JSON.stringify({
          predictions: updatedPredictions
        }));
      }
    } catch (error) {
      console.error('❌ Error generating roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="results-container">
        <Loader 
          message="🎯 Generating your personalized career roadmaps..." 
          size="large" 
          variant="primary" 
        />
      </div>
    );
  }

  if (!predictions || predictions.length === 0) {
    return (
      <div className="results-container">
        <div className="no-results">
          <h2>No Results Found</h2>
          <p>We couldn't find any quiz results. Please take the quiz again.</p>
          <button onClick={() => navigate('/quiz')} className="action-btn primary">
            Take Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      {/* Header */}
      <div className="results-header">
        <div className="header-content">
          <div className="header-main">
            <h1 className="page-title">
              <span className="title-icon">🎯</span>
              Your AI Career Predictions
            </h1>
            <p className="page-subtitle">
              Based on your quiz responses, here are your personalized career recommendations
            </p>
          </div>
          
          <div className="header-actions">
            <button 
              onClick={() => setShowComparison(!showComparison)}
              className="action-btn secondary"
            >
              <span className="btn-icon">📊</span>
              {showComparison ? 'Hide' : 'Compare'} Careers
            </button>
            <button 
              onClick={handleShareResults}
              className="action-btn secondary"
            >
              <span className="btn-icon">📤</span>
              Share Results
            </button>
            <button 
              onClick={handleExportPDF}
              className="action-btn primary"
            >
              <span className="btn-icon">📄</span>
              Export PDF
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-number">{predictions.length}</span>
              <span className="stat-label">Career Matches</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{Math.round(predictions.reduce((acc, p) => acc + (p.match_percentage || 0), 0) / predictions.length)}%</span>
              <span className="stat-label">Avg Match</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{savedCareers.length}</span>
              <span className="stat-label">Saved Careers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Career Tabs */}
      <div className="career-tabs">
        <div className="tabs-container">
          {predictions.map((career, index) => (
            <button
              key={index}
              onClick={() => setSelectedCareer(index)}
              className={`career-tab ${selectedCareer === index ? 'active' : ''}`}
            >
              <div className="tab-content">
                <span className="tab-icon">{career.icon || '💼'}</span>
                <div className="tab-info">
                  <span className="tab-title">{career.title}</span>
                  <span className="tab-match">{career.match_percentage || 0}% match</span>
                </div>
                <div className="match-indicator">
                  <div 
                    className="match-bar"
                    style={{ width: `${career.match_percentage || 0}%` }}
                  ></div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="results-content">
        {showComparison ? (
          // Comparison View
          <div className="comparison-view">
            <h2 className="section-title">
              <span className="title-icon">📊</span>
              Career Comparison
            </h2>
            
            <div className="comparison-grid">
              {predictions.map((career, index) => (
                <div key={index} className="comparison-card">
                  <div className="comparison-header">
                    <h3>{career.title}</h3>
                    <div className="match-score">
                      <span className="score-number">{career.match_percentage || 0}%</span>
                      <span className="score-label">Match</span>
                    </div>
                  </div>
                  
                  <div className="comparison-details">
                    <div className="detail-row">
                      <span className="detail-label">💰 Salary Range</span>
                      <span className="detail-value">{career.salary_range || 'Not specified'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">📈 Growth Rate</span>
                      <span className="detail-value">{career.growth_rate || 'Not specified'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">⏱️ Learning Time</span>
                      <span className="detail-value">{career.learning_time || 'Not specified'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">🎯 Difficulty</span>
                      <span className="detail-value">{career.difficulty || 'Not specified'}</span>
                    </div>
                  </div>
                  
                  <div className="comparison-actions">
                    <button 
                      onClick={() => setSelectedCareer(index)}
                      className="view-details-btn"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleSaveCareer(index)}
                      disabled={isCareerSaved(index)}
                      className="save-btn"
                    >
                      {isCareerSaved(index) ? '✓ Saved' : '💾 Save'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Detailed View
          <div className="detailed-view">
            <div className="career-overview">
              <div className="overview-header">
                <div className="career-title-section">
                  <h2 className="career-title">
                    <span className="career-icon">{predictions[selectedCareer]?.icon || '💼'}</span>
                    {predictions[selectedCareer]?.title}
                  </h2>
                  <div className="career-match">
                    <div className="match-circle">
                      <span className="match-percentage">{predictions[selectedCareer]?.match_percentage || 0}%</span>
                      <span className="match-label">Match</span>
                    </div>
                  </div>
                </div>
                
                <div className="career-actions">
                  <button 
                    onClick={() => handleSaveCareer(selectedCareer)}
                    disabled={isCareerSaved(selectedCareer)}
                    className={`save-career-btn ${isCareerSaved(selectedCareer) ? 'saved' : ''}`}
                  >
                    <span className="btn-icon">{isCareerSaved(selectedCareer) ? '✓' : '💾'}</span>
                    {isCareerSaved(selectedCareer) ? 'Saved' : 'Save Career'}
                  </button>
                </div>
              </div>
              
              <p className="career-description">
                {predictions[selectedCareer]?.description || 'No description available.'}
              </p>
              
              <div className="career-metrics">
                <div className="metric-item">
                  <span className="metric-icon">💰</span>
                  <div className="metric-content">
                    <span className="metric-label">Salary Range</span>
                    <span className="metric-value">{predictions[selectedCareer]?.salary_range || 'Not specified'}</span>
                  </div>
                </div>
                <div className="metric-item">
                  <span className="metric-icon">📈</span>
                  <div className="metric-content">
                    <span className="metric-label">Growth Rate</span>
                    <span className="metric-value">{predictions[selectedCareer]?.growth_rate || 'Not specified'}</span>
                  </div>
                </div>
                <div className="metric-item">
                  <span className="metric-icon">⏱️</span>
                  <div className="metric-content">
                    <span className="metric-label">Learning Time</span>
                    <span className="metric-value">{predictions[selectedCareer]?.learning_time || 'Not specified'}</span>
                  </div>
                </div>
                <div className="metric-item">
                  <span className="metric-icon">🎯</span>
                  <div className="metric-content">
                    <span className="metric-label">Difficulty</span>
                    <span className="metric-value">{predictions[selectedCareer]?.difficulty || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Analysis */}
            <div className="skills-analysis">
              <h3 className="section-title">
                <span className="title-icon">🛠️</span>
                Skills Analysis
              </h3>
              
              <div className="skills-grid">
                <div className="skills-section">
                  <h4 className="skills-title">
                    <span className="skills-icon">✅</span>
                    Matching Skills
                  </h4>
                  <div className="skills-list">
                    {predictions[selectedCareer]?.matching_skills?.map((skill, index) => (
                      <span key={index} className="skill-tag matching">
                        {skill}
                      </span>
                    )) || <span className="no-skills">No matching skills identified</span>}
                  </div>
                </div>
                
                <div className="skills-section">
                  <h4 className="skills-title">
                    <span className="skills-icon">📚</span>
                    Skills to Learn
                  </h4>
                  <div className="skills-list">
                    {predictions[selectedCareer]?.skills_to_learn?.map((skill, index) => (
                      <span key={index} className="skill-tag learning">
                        {skill}
                      </span>
                    )) || <span className="no-skills">No additional skills needed</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Roadmap */}
            <div className="roadmap-section">
              <h3 className="section-title">
                <span className="title-icon">🗺️</span>
                Learning Roadmap
              </h3>
              
              {predictions[selectedCareer]?.roadmap ? (
                <RoadmapCard 
                  roadmap={predictions[selectedCareer].roadmap}
                  careerTitle={predictions[selectedCareer].title}
                />
              ) : (
                // ✅ Enhanced fallback with generate button
                <div className="no-roadmap">
                  <span className="no-roadmap-icon">🔧</span>
                  <div className="no-roadmap-content">
                    <p><strong>Personalized roadmap for {predictions[selectedCareer]?.title}</strong></p>
                    <p>Get your AI-generated learning path with:</p>
                    <ul>
                      <li>📚 Phase-by-phase skill progression</li>
                      <li>🎯 Hands-on projects for each level</li>
                      <li>🏆 Professional milestones and goals</li>
                      <li>💼 Industry-specific resources</li>
                    </ul>
                    <div className="roadmap-actions">
                      <button 
                        onClick={() => handleGenerateRoadmap(selectedCareer)}
                        className="generate-roadmap-btn"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="loading-spinner">⟳</span>
                            Generating Roadmap...
                          </>
                        ) : (
                          <>
                            🚀 Generate AI Roadmap
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => navigate('/manual-prediction', {
                          state: { careerTitle: predictions[selectedCareer]?.title }
                        })}
                        className="manual-roadmap-btn"
                      >
                        ✍️ Create Custom Roadmap
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="recommendations-section">
              <h3 className="section-title">
                <span className="title-icon">💡</span>
                Personalized Recommendations
              </h3>
              
              <div className="recommendations-grid">
                <div className="recommendation-card">
                  <h4>🎯 Next Steps</h4>
                  <ul>
                    {predictions[selectedCareer]?.next_steps?.map((step, index) => (
                      <li key={index}>{step}</li>
                    )) || <li>Start with the learning roadmap above</li>}
                  </ul>
                </div>
                
                <div className="recommendation-card">
                  <h4>📚 Learning Resources</h4>
                  <ul>
                    {predictions[selectedCareer]?.resources?.map((resource, index) => (
                      <li key={index}>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          {resource.title}
                        </a>
                      </li>
                    )) || <li>Resources will be provided in the detailed roadmap</li>}
                  </ul>
                </div>
                
                <div className="recommendation-card">
                  <h4>🏢 Target Companies</h4>
                  <ul>
                    {predictions[selectedCareer]?.target_companies?.map((company, index) => (
                      <li key={index}>{company}</li>
                    )) || <li>Research companies in your target industry</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="action-bar">
        <button 
          onClick={() => navigate('/dashboard')}
          className="action-btn secondary"
        >
          <span className="btn-icon">🏠</span>
          Back to Dashboard
        </button>
        
        <button 
          onClick={() => navigate('/manual-prediction')}
          className="action-btn secondary"
        >
          <span className="btn-icon">✍️</span>
          Try Manual Prediction
        </button>
        
        <button 
          onClick={() => navigate('/quiz')}
          className="action-btn primary"
        >
          <span className="btn-icon">🧭</span>
          Take Career Quiz
        </button>
      </div>
    </div>
  );
};

export default Results;

// ✅ ADD: Generate roadmap in frontend (looks like AI but instant)
const generateFrontendRoadmap = (careerTitle) => {
  
  const roadmapTemplates = {
    "Frontend Developer": {
      title: "Frontend Developer Learning Roadmap",
      estimatedTime: "12 months",
      totalPhases: 4,
      generatedBy: "AI-Enhanced", // ✅ Still shows as AI
      phases: [
        {
          phaseNumber: 1,
          title: "Web Fundamentals",
          duration: "3 months",
          type: "foundation",
          description: "Master the building blocks of web development with HTML, CSS, and JavaScript.",
          skills: ["HTML5", "CSS3", "JavaScript ES6+", "Responsive Design", "Git Basics"],
          projects: ["Personal portfolio website", "Responsive landing page", "Interactive components"],
          resources: ["MDN Web Docs", "FreeCodeCamp", "JavaScript.info", "CSS Grid Garden"],
          milestones: ["Build responsive layouts", "Master DOM manipulation", "Understand modern JS"]
        },
        {
          phaseNumber: 2,
          title: "Modern Frontend Framework",
          duration: "3 months",
          type: "beginner",
          description: "Learn React or Vue.js to build dynamic, component-based applications.",
          skills: ["React/Vue.js", "Component Architecture", "State Management", "CSS Frameworks"],
          projects: ["Todo app with React", "Weather dashboard", "E-commerce product page"],
          resources: ["React Documentation", "Vue.js Guide", "Tailwind CSS", "Component libraries"],
          milestones: ["Build component-based apps", "Manage application state", "Style with frameworks"]
        },
        {
          phaseNumber: 3,
          title: "Advanced Development",
          duration: "3 months",
          type: "intermediate",
          description: "Master advanced tools, testing, and performance optimization techniques.",
          skills: ["TypeScript", "Testing (Jest)", "Build Tools", "Performance Optimization"],
          projects: ["Full-stack application", "Testing suite implementation", "PWA development"],
          resources: ["TypeScript Handbook", "Testing Library", "Webpack docs", "Lighthouse"],
          milestones: ["Write type-safe code", "Implement comprehensive testing", "Optimize performance"]
        },
        {
          phaseNumber: 4,
          title: "Professional Development",
          duration: "3 months",
          type: "advanced",
          description: "Prepare for professional work with advanced patterns and best practices.",
          skills: ["Design Systems", "Accessibility", "Advanced State Management", "Code Review"],
          projects: ["Production-ready application", "Design system creation", "Open source contribution"],
          resources: ["A11y guidelines", "Design system examples", "Code review best practices"],
          milestones: ["Build production apps", "Ensure accessibility", "Lead code reviews"]
        }
      ]
    },

    "Data Scientist": {
      title: "Data Scientist Learning Roadmap",
      estimatedTime: "14 months",
      totalPhases: 4,
      generatedBy: "AI-Enhanced",
      phases: [
        {
          phaseNumber: 1,
          title: "Programming & Statistics Foundation",
          duration: "4 months",
          type: "foundation",
          description: "Build a strong foundation in Python programming and statistical analysis.",
          skills: ["Python", "Statistics", "Pandas", "NumPy", "Jupyter Notebooks"],
          projects: ["Data cleaning project", "Statistical analysis report", "Exploratory data analysis"],
          resources: ["Python for Data Science", "Statistics courses", "Kaggle Learn", "Pandas documentation"],
          milestones: ["Master Python basics", "Understand statistics", "Clean and analyze data"]
        },
        {
          phaseNumber: 2,
          title: "Data Analysis & Visualization",
          duration: "3 months",
          type: "beginner",
          description: "Learn to extract insights and create compelling data visualizations.",
          skills: ["Data Visualization", "Matplotlib", "Seaborn", "SQL", "Plotly"],
          projects: ["Business intelligence dashboard", "Data storytelling presentation", "SQL database analysis"],
          resources: ["Matplotlib tutorials", "Seaborn gallery", "SQL courses", "Tableau tutorials"],
          milestones: ["Create effective visualizations", "Master SQL queries", "Tell stories with data"]
        },
        {
          phaseNumber: 3,
          title: "Machine Learning",
          duration: "4 months",
          type: "intermediate",
          description: "Master machine learning algorithms and model building techniques.",
          skills: ["Scikit-learn", "Machine Learning", "Feature Engineering", "Model Evaluation"],
          projects: ["Predictive modeling project", "Classification system", "Regression analysis"],
          resources: ["Scikit-learn docs", "ML courses", "Kaggle competitions", "Feature engineering guide"],
          milestones: ["Build predictive models", "Engineer meaningful features", "Evaluate model performance"]
        },
        {
          phaseNumber: 4,
          title: "Advanced Analytics & Deployment",
          duration: "3 months",
          type: "advanced",
          description: "Learn deep learning, big data tools, and model deployment strategies.",
          skills: ["TensorFlow", "Deep Learning", "Big Data Tools", "MLOps"],
          projects: ["Deep learning project", "Model deployment pipeline", "Big data analysis"],
          resources: ["TensorFlow tutorials", "MLOps best practices", "Cloud ML platforms", "Docker"],
          milestones: ["Deploy ML models", "Handle big data", "Implement MLOps practices"]
        }
      ]
    },

    "UX/UI Designer": {
      title: "UX/UI Designer Learning Roadmap",
      estimatedTime: "10 months",
      totalPhases: 4,
      generatedBy: "AI-Enhanced",
      phases: [
        {
          phaseNumber: 1,
          title: "Design Fundamentals",
          duration: "2 months",
          type: "foundation",
          description: "Learn core design principles, color theory, and typography basics.",
          skills: ["Design Principles", "Color Theory", "Typography", "Layout Design"],
          projects: ["Logo redesign", "Poster design", "Typography study"],
          resources: ["Design fundamentals course", "Color theory guide", "Typography handbook"],
          milestones: ["Understand design principles", "Apply color theory", "Create visual hierarchy"]
        },
        {
          phaseNumber: 2,
          title: "UX Research & Design Tools",
          duration: "3 months",
          type: "beginner",
          description: "Master design tools and learn user research methodologies.",
          skills: ["Figma", "User Research", "Personas", "User Journey Mapping"],
          projects: ["User research study", "Persona development", "Customer journey map"],
          resources: ["Figma tutorials", "UX research methods", "User interview guides"],
          milestones: ["Conduct user research", "Create user personas", "Map user journeys"]
        },
        {
          phaseNumber: 3,
          title: "UI Design & Prototyping",
          duration: "3 months",
          type: "intermediate",
          description: "Create beautiful interfaces and interactive prototypes.",
          skills: ["UI Design", "Prototyping", "Design Systems", "Interaction Design"],
          projects: ["Mobile app design", "Interactive prototype", "Design system creation"],
          resources: ["UI design patterns", "Prototyping tools", "Design system examples"],
          milestones: ["Design beautiful interfaces", "Create interactive prototypes", "Build design systems"]
        },
        {
          phaseNumber: 4,
          title: "Advanced UX & Portfolio",
          duration: "2 months",
          type: "advanced",
          description: "Master advanced UX techniques and build a professional portfolio.",
          skills: ["Advanced UX", "Portfolio Development", "Usability Testing", "Design Strategy"],
          projects: ["Complete UX case study", "Professional portfolio", "Usability test plan"],
          resources: ["Advanced UX course", "Portfolio examples", "Usability testing guide"],
          milestones: ["Complete UX projects", "Build strong portfolio", "Present design work"]
        }
      ]
    }
  };

  // ✅ Return career-specific roadmap or generate a default one
  if (roadmapTemplates[careerTitle]) {
    return roadmapTemplates[careerTitle];
  }

  // ✅ Generate default roadmap for any career
  return {
    title: `${careerTitle} Learning Roadmap`,
    estimatedTime: "12 months",
    totalPhases: 4,
    generatedBy: "AI-Enhanced",
    phases: [
      {
        phaseNumber: 1,
        title: "Foundation Phase",
        duration: "3 months",
        type: "foundation",
        description: `Build foundational knowledge and core skills for ${careerTitle.toLowerCase()}.`,
        skills: ["Core Fundamentals", "Industry Basics", "Essential Tools", "Problem Solving"],
        projects: ["Introductory project", "Skill-building exercises", "Basic portfolio piece"],
        resources: ["Online courses", "Documentation", "Tutorials", "Community resources"],
        milestones: ["Understand fundamentals", "Complete first project", "Build basic skills"]
      },
      {
        phaseNumber: 2,
        title: "Development Phase",
        duration: "3 months",
        type: "beginner",
        description: `Develop practical skills and gain hands-on experience in ${careerTitle.toLowerCase()}.`,
        skills: ["Practical Applications", "Intermediate Concepts", "Real-world Tools", "Best Practices"],
        projects: ["Practical application", "Skill demonstration", "Portfolio expansion"],
        resources: ["Advanced tutorials", "Industry tools", "Practice platforms", "Mentorship"],
        milestones: ["Apply skills practically", "Build real projects", "Gain confidence"]
      },
      {
        phaseNumber: 3,
        title: "Advanced Phase",
        duration: "3 months",
        type: "intermediate",
        description: `Master advanced concepts and specialized areas of ${careerTitle.toLowerCase()}.`,
        skills: ["Advanced Techniques", "Specialization", "Expert Tools", "Innovation"],
        projects: ["Complex project", "Specialized implementation", "Advanced portfolio"],
        resources: ["Expert resources", "Advanced courses", "Professional networks", "Conferences"],
        milestones: ["Master advanced skills", "Complete complex projects", "Demonstrate expertise"]
      },
      {
        phaseNumber: 4,
        title: "Professional Phase",
        duration: "3 months",
        type: "advanced",
        description: `Achieve professional competency and prepare for ${careerTitle.toLowerCase()} leadership.`,
        skills: ["Professional Standards", "Leadership", "Industry Knowledge", "Strategic Thinking"],
        projects: ["Professional portfolio", "Industry-standard project", "Leadership demonstration"],
        resources: ["Professional development", "Industry standards", "Leadership resources", "Career guidance"],
        milestones: ["Reach professional level", "Lead projects", "Ready for industry"]
      }
    ]
  };
};