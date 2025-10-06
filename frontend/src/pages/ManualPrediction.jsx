import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManualPrediction.css';

const ManualPrediction = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    age: '',
    education: '',
    currentRole: '',
    experience: '',
    
    // Technical Skills (0-10 scale)
    programmingSkills: 5,
    dataAnalysisSkills: 5,
    designSkills: 5,
    communicationSkills: 5,
    leadershipSkills: 5,
    analyticalSkills: 5,
    
    // Interests (Multiple choice)
    primaryInterest: '',
    workEnvironment: '',
    workStyle: '',
    careerGoals: '',
    
    // Preferences
    salaryExpectation: '',
    learningTime: '',
    difficultyPreference: '',
    industryPreference: []
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked 
          ? [...(prev[name] || []), value]
          : (prev[name] || []).filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const generateManualPrediction = () => {
    console.log('🎯 Generating manual prediction from form data:', formData);
    
    // Advanced scoring algorithm based on manual inputs
    const careerScores = {
      "Data Scientist": {
        score: calculateCareerScore("Data Scientist", formData),
        icon: "📊",
        description: "Perfect for analytical minds who love working with data and statistics",
        salary_range: "$80,000 - $150,000",
        growth_rate: "Very High (22%)",
        learning_time: "12-18 months",
        difficulty: "Advanced"
      },
      "Software Developer": {
        score: calculateCareerScore("Software Developer", formData),
        icon: "💻", 
        description: "Ideal for logical thinkers who enjoy building applications and solving problems",
        salary_range: "$70,000 - $130,000",
        growth_rate: "High (20%)",
        learning_time: "8-14 months", 
        difficulty: "Moderate"
      },
      "Frontend Developer": {
        score: calculateCareerScore("Frontend Developer", formData),
        icon: "🎨",
        description: "Perfect blend of technical skills and creative design for user interfaces",
        salary_range: "$65,000 - $120,000",
        growth_rate: "High (18%)",
        learning_time: "6-12 months",
        difficulty: "Moderate"
      },
      "Business Analyst": {
        score: calculateCareerScore("Business Analyst", formData),
        icon: "📈",
        description: "Great for analytical minds who want to bridge technology and business",
        salary_range: "$60,000 - $110,000", 
        growth_rate: "High (19%)",
        learning_time: "4-8 months",
        difficulty: "Moderate"
      },
      "UX/UI Designer": {
        score: calculateCareerScore("UX/UI Designer", formData),
        icon: "🎨",
        description: "Perfect for creative problem-solvers focused on user experience",
        salary_range: "$55,000 - $110,000",
        growth_rate: "High (16%)",
        learning_time: "6-10 months",
        difficulty: "Moderate"
      },
      "Project Manager": {
        score: calculateCareerScore("Project Manager", formData),
        icon: "📋",
        description: "Ideal for organized leaders who excel at coordinating teams and projects",
        salary_range: "$70,000 - $120,000",
        growth_rate: "High (20%)",
        learning_time: "6-12 months",
        difficulty: "Moderate"
      },
      "Cybersecurity Specialist": {
        score: calculateCareerScore("Cybersecurity Specialist", formData),
        icon: "🔐",
        description: "Perfect for detail-oriented professionals who want to protect digital assets",
        salary_range: "$75,000 - $140,000",
        growth_rate: "Very High (28%)",
        learning_time: "10-16 months",
        difficulty: "Advanced"
      },
      "Product Manager": {
        score: calculateCareerScore("Product Manager", formData),
        icon: "🚀",
        description: "Great for strategic thinkers who want to drive product development",
        salary_range: "$80,000 - $140,000",
        growth_rate: "Very High (25%)",
        learning_time: "8-15 months",
        difficulty: "Advanced"
      }
    };

    // Sort careers by score and return top 3
    const sortedCareers = Object.keys(careerScores)
      .map(careerName => {
        // 🔧 Generate individual roadmap for each career
        const careerRoadmap = generateDetailedRoadmap(careerName, formData);
        
        return {
          title: careerName,
          match_percentage: careerScores[careerName].score,
          icon: careerScores[careerName].icon,
          description: careerScores[careerName].description,
          salary_range: careerScores[careerName].salary_range,
          growth_rate: careerScores[careerName].growth_rate,
          learning_time: careerScores[careerName].learning_time,
          difficulty: careerScores[careerName].difficulty,
          matching_skills: getMatchingSkills(careerName, formData),
          skills_to_learn: getSkillsToLearn(careerName),
          next_steps: getNextSteps(careerName),
          roadmap: careerRoadmap // ✅ Attach roadmap to each prediction
        };
      })
      .sort((a, b) => b.match_percentage - a.match_percentage)
      .slice(0, 3);

    return {
      success: true,
      message: "Manual prediction completed successfully",
      predictions: sortedCareers, // ✅ Each prediction now has its own roadmap
      analysisType: 'manual-input',
      inputData: formData,
      submissionTime: new Date().toISOString()
    };
  };

  const calculateCareerScore = (careerName, data) => {
    let score = 50; // Base score

    // Skill-based scoring
    switch (careerName) {
      case "Data Scientist":
        score += (data.programmingSkills * 2) + (data.dataAnalysisSkills * 3) + (data.analyticalSkills * 2.5);
        if (data.primaryInterest === 'data-analysis') score += 15;
        if (data.workStyle === 'independent') score += 10;
        break;

      case "Software Developer":
        score += (data.programmingSkills * 3) + (data.analyticalSkills * 2) + (data.designSkills * 1);
        if (data.primaryInterest === 'programming') score += 15;
        if (data.workEnvironment === 'tech-company') score += 10;
        break;

      case "Frontend Developer":
        score += (data.programmingSkills * 2.5) + (data.designSkills * 2.5) + (data.communicationSkills * 1.5);
        if (data.primaryInterest === 'web-development') score += 15;
        if (data.workStyle === 'collaborative') score += 10;
        break;

      case "Business Analyst":
        score += (data.analyticalSkills * 2.5) + (data.communicationSkills * 2.5) + (data.dataAnalysisSkills * 2);
        if (data.primaryInterest === 'business-strategy') score += 15;
        if (data.workEnvironment === 'corporate') score += 10;
        break;

      case "UX/UI Designer":
        score += (data.designSkills * 3) + (data.communicationSkills * 2) + (data.analyticalSkills * 1.5);
        if (data.primaryInterest === 'design') score += 15;
        if (data.workStyle === 'creative') score += 10;
        break;

      case "Project Manager":
        score += (data.leadershipSkills * 3) + (data.communicationSkills * 2.5) + (data.analyticalSkills * 1.5);
        if (data.workStyle === 'leadership') score += 15;
        if (data.careerGoals === 'management') score += 10;
        break;

      case "Cybersecurity Specialist":
        score += (data.programmingSkills * 2) + (data.analyticalSkills * 2.5) + (data.dataAnalysisSkills * 1.5);
        if (data.primaryInterest === 'cybersecurity') score += 15;
        if (data.workEnvironment === 'security-focused') score += 10;
        break;

      case "Product Manager":
        score += (data.analyticalSkills * 2) + (data.leadershipSkills * 2.5) + (data.communicationSkills * 2.5);
        if (data.careerGoals === 'product-strategy') score += 15;
        if (data.workStyle === 'strategic') score += 10;
        break;
    }

    // Experience bonuses
    if (data.experience === '3-5' || data.experience === '5+') score += 5;
    if (data.education === 'bachelors' || data.education === 'masters') score += 5;

    // Cap the score between 60-95
    return Math.min(95, Math.max(60, Math.round(score)));
  };

  const getMatchingSkills = (careerName, data) => {
    const baseSkills = {
      "Data Scientist": ["Analytical Thinking", "Problem Solving", "Statistics"],
      "Software Developer": ["Programming", "Logic", "Problem Solving"], 
      "Frontend Developer": ["HTML/CSS", "JavaScript", "Design Sense"],
      "Business Analyst": ["Analysis", "Communication", "Business Logic"],
      "UX/UI Designer": ["Design Thinking", "User Empathy", "Creativity"],
      "Project Manager": ["Leadership", "Organization", "Communication"],
      "Cybersecurity Specialist": ["Security Mindset", "Technical Analysis", "Problem Solving"],
      "Product Manager": ["Strategic Thinking", "Market Analysis", "Leadership"]
    };

    return baseSkills[careerName] || ["Problem Solving", "Communication"];
  };

  const getSkillsToLearn = (careerName) => {
    const skillsMap = {
      "Data Scientist": ["Python", "R", "SQL", "Machine Learning", "Statistics"],
      "Software Developer": ["Programming Languages", "Frameworks", "DevOps", "Testing"],
      "Frontend Developer": ["React/Vue", "CSS Frameworks", "JavaScript ES6+", "Design Tools"],
      "Business Analyst": ["Excel/Power BI", "SQL", "Business Process Modeling", "Analytics"],
      "UX/UI Designer": ["Figma/Adobe XD", "User Research", "Prototyping", "Usability Testing"],
      "Project Manager": ["Project Management Tools", "Agile/Scrum", "Risk Management", "Leadership"],
      "Cybersecurity Specialist": ["Network Security", "Ethical Hacking", "Security Tools", "Compliance"],
      "Product Manager": ["Product Strategy", "Market Research", "Analytics", "Roadmapping"]
    };

    return skillsMap[careerName] || ["Industry Knowledge", "Communication", "Technical Skills"];
  };

  const getNextSteps = (careerName) => {
    const stepsMap = {
      "Data Scientist": ["Learn Python for data analysis", "Complete online statistics course", "Build data projects portfolio"],
      "Software Developer": ["Master a programming language", "Build personal projects", "Contribute to open source"],
      "Frontend Developer": ["Learn modern JavaScript", "Master a frontend framework", "Build responsive websites"],
      "Business Analyst": ["Learn Excel and SQL", "Understand business processes", "Practice data visualization"],
      "UX/UI Designer": ["Learn design tools", "Study user psychology", "Create design portfolio"],
      "Project Manager": ["Get PMP certification", "Practice with project management tools", "Lead small projects"],
      "Cybersecurity Specialist": ["Study network fundamentals", "Get security certifications", "Practice ethical hacking"],
      "Product Manager": ["Learn product strategy", "Understand market research", "Practice product roadmapping"]
    };

    return stepsMap[careerName] || ["Research the field", "Build relevant skills", "Network with professionals"];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('🚀 Processing manual prediction...');
      console.log('📝 Form data:', formData);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate predictions
      const result = generateManualPrediction();
      console.log('✅ Manual prediction generated:', result);

      // Store results and navigate
      localStorage.setItem('quizResults', JSON.stringify(result));
      navigate('/results');

    } catch (error) {
      console.error('❌ Error generating manual prediction:', error);
      // Still proceed with generated results
      const result = generateManualPrediction();
      localStorage.setItem('quizResults', JSON.stringify({
        ...result,
        error: true,
        errorMessage: error.message
      }));
      navigate('/results');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="manual-prediction-container">
        <div className="loading-screen">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <h2>🤖 Analyzing Your Profile...</h2>
            <p>Our algorithm is processing your skills and preferences to find the perfect career match.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manual-prediction-container">
      <div className="manual-prediction-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <div className="manual-header-content">
          <h1>🎯 Manual Career Prediction</h1>
          <p>Enter your information below to get personalized career recommendations</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="manual-prediction-form">
        {/* Personal Information Section */}
        <div className="manual-form-section">
          <h2>👤 Personal Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age</label>
              <select
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
              >
                <option value="">Select age range</option>
                <option value="18-22">18-22</option>
                <option value="23-27">23-27</option>
                <option value="28-32">28-32</option>
                <option value="33-40">33-40</option>
                <option value="40+">40+</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="education">Education Level</label>
              <select
                id="education"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                required
              >
                <option value="">Select education level</option>
                <option value="high-school">High School</option>
                <option value="associate">Associate Degree</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="phd">PhD</option>
                <option value="bootcamp">Bootcamp/Certification</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="experience">Work Experience</label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
              >
                <option value="">Select experience level</option>
                <option value="none">No Experience</option>
                <option value="0-1">0-1 Years</option>
                <option value="1-3">1-3 Years</option>
                <option value="3-5">3-5 Years</option>
                <option value="5+">5+ Years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Skills Assessment Section */}
        <div className="manual-form-section">
          <h2>💪 Skills Assessment</h2>
          <p>Rate your skills on a scale of 1-10 (1 = Beginner, 10 = Expert)</p>
          
          <div className="skills-grid">
            {[
              { key: 'programmingSkills', label: 'Programming & Coding', icon: '💻' },
              { key: 'dataAnalysisSkills', label: 'Data Analysis', icon: '📊' },
              { key: 'designSkills', label: 'Design & Creativity', icon: '🎨' },
              { key: 'communicationSkills', label: 'Communication', icon: '🗣️' },
              { key: 'leadershipSkills', label: 'Leadership', icon: '👑' },
              { key: 'analyticalSkills', label: 'Analytical Thinking', icon: '🧠' }
            ].map(skill => (
              <div key={skill.key} className="skill-item">
                <label htmlFor={skill.key}>
                  <span className="skill-icon">{skill.icon}</span>
                  {skill.label}
                </label>
                <div className="skill-slider">
                  <input
                    type="range"
                    id={skill.key}
                    name={skill.key}
                    min="1"
                    max="10"
                    value={formData[skill.key]}
                    onChange={handleInputChange}
                    className="slider"
                  />
                  <div className="skill-value">{formData[skill.key]}/10</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interests & Preferences Section */}
        <div className="manual-form-section">
          <h2>🎯 Interests & Preferences</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="primaryInterest">Primary Interest</label>
              <select
                id="primaryInterest"
                name="primaryInterest"
                value={formData.primaryInterest}
                onChange={handleInputChange}
                required
              >
                <option value="">Select your primary interest</option>
                <option value="programming">Programming & Software</option>
                <option value="data-analysis">Data Analysis & Statistics</option>
                <option value="web-development">Web Development</option>
                <option value="design">Design & User Experience</option>
                <option value="business-strategy">Business & Strategy</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="management">Project/Product Management</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="workEnvironment">Preferred Work Environment</label>
              <select
                id="workEnvironment"
                name="workEnvironment"
                value={formData.workEnvironment}
                onChange={handleInputChange}
                required
              >
                <option value="">Select work environment</option>
                <option value="tech-company">Tech Company</option>
                <option value="startup">Startup</option>
                <option value="corporate">Large Corporation</option>
                <option value="consulting">Consulting Firm</option>
                <option value="freelance">Freelance/Remote</option>
                <option value="government">Government/Non-profit</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="workStyle">Work Style Preference</label>
              <select
                id="workStyle"
                name="workStyle"
                value={formData.workStyle}
                onChange={handleInputChange}
                required
              >
                <option value="">Select work style</option>
                <option value="independent">Independent Work</option>
                <option value="collaborative">Team Collaboration</option>
                <option value="leadership">Leading Teams</option>
                <option value="creative">Creative Projects</option>
                <option value="analytical">Analytical Tasks</option>
                <option value="strategic">Strategic Planning</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="careerGoals">Career Goals</label>
              <select
                id="careerGoals"
                name="careerGoals"
                value={formData.careerGoals}
                onChange={handleInputChange}
                required
              >
                <option value="">Select career goals</option>
                <option value="technical-expert">Become Technical Expert</option>
                <option value="management">Move into Management</option>
                <option value="entrepreneurship">Start Own Business</option>
                <option value="consulting">Become Consultant</option>
                <option value="product-strategy">Product Strategy</option>
                <option value="work-life-balance">Work-Life Balance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Career Preferences Section */}
        <div className="manual-form-section">
          <h2>💼 Career Preferences</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="salaryExpectation">Salary Expectation</label>
              <select
                id="salaryExpectation"
                name="salaryExpectation"
                value={formData.salaryExpectation}
                onChange={handleInputChange}
                required
              >
                <option value="">Select salary range</option>
                <option value="40k-60k">$40,000 - $60,000</option>
                <option value="60k-80k">$60,000 - $80,000</option>
                <option value="80k-100k">$80,000 - $100,000</option>
                <option value="100k-120k">$100,000 - $120,000</option>
                <option value="120k+">$120,000+</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="learningTime">Learning Time Commitment</label>
              <select
                id="learningTime"
                name="learningTime"
                value={formData.learningTime}
                onChange={handleInputChange}
                required
              >
                <option value="">Select learning commitment</option>
                <option value="3-6">3-6 months</option>
                <option value="6-12">6-12 months</option>
                <option value="12-18">12-18 months</option>
                <option value="18+">18+ months</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="difficultyPreference">Learning Difficulty</label>
              <select
                id="difficultyPreference"
                name="difficultyPreference"
                value={formData.difficultyPreference}
                onChange={handleInputChange}
                required
              >
                <option value="">Select difficulty level</option>
                <option value="easy">Easy - Basic Skills</option>
                <option value="moderate">Moderate - Some Challenge</option>
                <option value="advanced">Advanced - Complex Skills</option>
                <option value="expert">Expert - Master Level</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="manual-form-actions">
          <button type="submit" className="manual-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Analyzing...' : '🚀 Get My Career Recommendations'}
          </button>
        </div>
      </form>
    </div>
  );
};

// ✅ ADD: Missing generateDetailedRoadmap function
const generateDetailedRoadmap = (careerTitle, formData) => {
  console.log('🗺️ Generating roadmap for:', careerTitle);
  
  // Call your backend API to generate roadmap
  const generateRoadmapFromBackend = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/roadmap/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          careerTitle: careerTitle,
          userProfile: {
            skills: extractSkillsFromForm(formData),
            experience: formData.experience || 'Beginner',
            interests: [formData.primaryInterest],
            learningStyle: 'Hands-on'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.roadmap;
      } else {
        console.warn('⚠️ Backend roadmap generation failed, using fallback');
        return generateFallbackRoadmap(careerTitle);
      }
    } catch (error) {
      console.error('❌ Error generating roadmap from backend:', error);
      return generateFallbackRoadmap(careerTitle);
    }
  };

  // For now, return fallback roadmap (you can make this async later)
  return generateFallbackRoadmap(careerTitle);
};

// ✅ ADD: Extract skills from form data
const extractSkillsFromForm = (formData) => {
  const skills = [];
  
  // Add skills based on ratings
  if (formData.programmingSkills >= 7) skills.push('Programming');
  if (formData.dataAnalysisSkills >= 7) skills.push('Data Analysis');
  if (formData.designSkills >= 7) skills.push('Design');
  if (formData.communicationSkills >= 7) skills.push('Communication');
  if (formData.leadershipSkills >= 7) skills.push('Leadership');
  if (formData.analyticalSkills >= 7) skills.push('Analytical Thinking');
  
  // Add interest-based skills
  if (formData.primaryInterest) {
    const interestSkills = {
      'programming': ['JavaScript', 'Python'],
      'data-analysis': ['SQL', 'Statistics'],
      'web-development': ['HTML', 'CSS', 'JavaScript'],
      'design': ['Figma', 'Adobe Creative Suite'],
      'business-strategy': ['Excel', 'Business Analysis'],
      'cybersecurity': ['Network Security', 'Ethical Hacking'],
      'management': ['Project Management', 'Team Leadership']
    };
    
    if (interestSkills[formData.primaryInterest]) {
      skills.push(...interestSkills[formData.primaryInterest]);
    }
  }
  
  return skills.length > 0 ? skills : ['Problem Solving', 'Communication'];
};

// ✅ ADD: Generate fallback roadmap with career-specific phases
const generateFallbackRoadmap = (careerTitle) => {
  const careerRoadmaps = {
    "Data Scientist": {
      title: "Data Scientist Learning Roadmap",
      estimatedTime: "14 months",
      totalPhases: 4,
      generatedBy: "Frontend Structured",
      phases: [
        {
          phaseNumber: 1,
          title: "Programming & Statistics Foundation",
          duration: "3 months",
          type: "foundation",
          description: "Master Python programming and statistical fundamentals essential for data science.",
          skills: ["Python", "Statistics", "Pandas", "NumPy", "Jupyter Notebooks"],
          projects: ["Data cleaning project", "Statistical analysis report", "Python automation script"],
          resources: ["Python for Data Science course", "Statistics textbook", "Kaggle Learn"],
          milestones: ["Complete Python basics", "Understand descriptive statistics", "Build first data project"]
        },
        {
          phaseNumber: 2,
          title: "Data Analysis & Visualization",
          duration: "4 months",
          type: "beginner",
          description: "Develop skills in data manipulation, visualization, and exploratory data analysis.",
          skills: ["Data Visualization", "Scikit-learn", "SQL", "Data Cleaning", "Matplotlib", "Seaborn"],
          projects: ["Business intelligence dashboard", "Predictive model", "Data storytelling presentation"],
          resources: ["SQL for Data Science", "Tableau/Power BI courses", "Data visualization best practices"],
          milestones: ["Master data visualization", "Build predictive models", "Present data insights"]
        },
        {
          phaseNumber: 3,
          title: "Machine Learning & Advanced Analytics",
          duration: "4 months",
          type: "intermediate",
          description: "Learn machine learning algorithms, deep learning, and advanced analytical techniques.",
          skills: ["Machine Learning", "Deep Learning", "TensorFlow", "Feature Engineering", "Model Evaluation"],
          projects: ["End-to-end ML project", "Deep learning model", "Feature engineering pipeline"],
          resources: ["Machine Learning course", "Deep Learning specialization", "MLOps tutorials"],
          milestones: ["Deploy ML models", "Master feature engineering", "Build neural networks"]
        },
        {
          phaseNumber: 4,
          title: "MLOps & Production Systems",
          duration: "3 months",
          type: "advanced",
          description: "Learn to deploy, monitor, and maintain machine learning systems in production.",
          skills: ["MLOps", "Big Data", "Model Deployment", "Advanced Analytics", "Cloud Platforms"],
          projects: ["Production ML pipeline", "Model monitoring system", "Big data processing"],
          resources: ["MLOps best practices", "Cloud ML platforms", "Production ML case studies"],
          milestones: ["Deploy production models", "Set up monitoring", "Handle big data"]
        }
      ]
    },
    
    "Software Developer": {
      title: "Software Developer Learning Roadmap",
      estimatedTime: "12 months",
      totalPhases: 4,
      generatedBy: "Frontend Structured",
      phases: [
        {
          phaseNumber: 1,
          title: "Programming Fundamentals",
          duration: "3 months",
          type: "foundation",
          description: "Master core programming concepts and choose your primary programming language.",
          skills: ["Programming Logic", "Data Structures", "Algorithms", "Git", "Problem Solving"],
          projects: ["Console applications", "Basic algorithms", "Git portfolio"],
          resources: ["Programming fundamentals course", "Algorithm practice", "Git documentation"],
          milestones: ["Understand OOP", "Solve coding challenges", "Use version control"]
        },
        {
          phaseNumber: 2,
          title: "Web Development Basics",
          duration: "3 months",
          type: "beginner",
          description: "Learn web technologies and build your first web applications.",
          skills: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "DOM Manipulation"],
          projects: ["Personal portfolio", "Interactive web app", "Responsive website"],
          resources: ["Web development bootcamp", "MDN documentation", "Frontend practice"],
          milestones: ["Build responsive sites", "Master JavaScript", "Create portfolio"]
        },
        {
          phaseNumber: 3,
          title: "Backend & Frameworks",
          duration: "3 months",
          type: "intermediate",
          description: "Develop backend skills and learn popular frameworks for full-stack development.",
          skills: ["Node.js/Python", "Frameworks", "Databases", "APIs", "Authentication"],
          projects: ["REST API", "Database-driven app", "Authentication system"],
          resources: ["Backend development course", "Database tutorials", "API design guides"],
          milestones: ["Build APIs", "Work with databases", "Implement authentication"]
        },
        {
          phaseNumber: 4,
          title: "Advanced Development & DevOps",
          duration: "3 months",
          type: "advanced",
          description: "Master advanced development practices, testing, and deployment strategies.",
          skills: ["Testing", "DevOps", "Cloud Deployment", "Performance", "Security"],
          projects: ["Production application", "CI/CD pipeline", "Performance optimization"],
          resources: ["DevOps tutorials", "Cloud platform docs", "Testing frameworks"],
          milestones: ["Deploy to production", "Set up CI/CD", "Optimize performance"]
        }
      ]
    },
    
    "Frontend Developer": {
      title: "Frontend Developer Learning Roadmap",
      estimatedTime: "10 months",
      totalPhases: 4,
      generatedBy: "Frontend Structured",
      phases: [
        {
          phaseNumber: 1,
          title: "Web Fundamentals",
          duration: "2 months",
          type: "foundation",
          description: "Master HTML, CSS, and JavaScript fundamentals for modern web development.",
          skills: ["HTML5", "CSS3", "JavaScript ES6+", "Responsive Design", "Git"],
          projects: ["Landing page", "Portfolio website", "Interactive components"],
          resources: ["HTML/CSS course", "JavaScript fundamentals", "Git basics"],
          milestones: ["Build responsive layouts", "Master CSS Grid/Flexbox", "Understand JavaScript"]
        },
        {
          phaseNumber: 2,
          title: "Modern JavaScript & Tools",
          duration: "3 months",
          type: "beginner",
          description: "Learn modern JavaScript features, package managers, and build tools.",
          skills: ["ES6+ Features", "NPM/Yarn", "Webpack", "Sass/SCSS", "Browser DevTools"],
          projects: ["JavaScript SPA", "Build tool setup", "Component library"],
          resources: ["Modern JavaScript course", "Build tools documentation", "DevTools tutorials"],
          milestones: ["Use modern JS features", "Set up build pipeline", "Debug effectively"]
        },
        {
          phaseNumber: 3,
          title: "Frontend Frameworks",
          duration: "3 months",
          type: "intermediate",
          description: "Master a popular frontend framework and learn state management.",
          skills: ["React/Vue/Angular", "State Management", "Component Architecture", "Testing"],
          projects: ["Framework-based app", "State management implementation", "Component testing"],
          resources: ["Framework documentation", "State management guides", "Testing tutorials"],
          milestones: ["Build complex apps", "Manage application state", "Write tests"]
        },
        {
          phaseNumber: 4,
          title: "Advanced Frontend & Performance",
          duration: "2 months",
          type: "advanced",
          description: "Optimize applications for performance, accessibility, and production deployment.",
          skills: ["Performance Optimization", "Accessibility", "PWA", "Advanced Testing", "Deployment"],
          projects: ["Optimized production app", "PWA implementation", "Accessibility audit"],
          resources: ["Performance guides", "Accessibility standards", "PWA tutorials"],
          milestones: ["Optimize for performance", "Ensure accessibility", "Deploy professionally"]
        }
      ]
    },
    
    "UX/UI Designer": {
      title: "UX/UI Designer Learning Roadmap",
      estimatedTime: "10 months",
      totalPhases: 4,
      generatedBy: "Frontend Structured",
      phases: [
        {
          phaseNumber: 1,
          title: "Design Fundamentals",
          duration: "2 months",
          type: "foundation",
          description: "Learn core design principles, color theory, and typography basics.",
          skills: ["Design Principles", "Color Theory", "Typography", "Layout", "Visual Hierarchy"],
          projects: ["Logo design", "Poster design", "Typography study"],
          resources: ["Design fundamentals course", "Color theory guide", "Typography handbook"],
          milestones: ["Understand design principles", "Apply color theory", "Create visual hierarchy"]
        },
        {
          phaseNumber: 2,
          title: "UX Research & Design Tools",
          duration: "3 months",
          type: "beginner",
          description: "Master design tools and learn user research methodologies.",
          skills: ["Figma/Sketch", "User Research", "Personas", "User Journey Mapping", "Wireframing"],
          projects: ["User research study", "Persona development", "Wireframe set"],
          resources: ["Figma tutorials", "UX research methods", "Wireframing best practices"],
          milestones: ["Conduct user research", "Create user personas", "Design wireframes"]
        },
        {
          phaseNumber: 3,
          title: "UI Design & Prototyping",
          duration: "3 months",
          type: "intermediate",
          description: "Create beautiful interfaces and interactive prototypes.",
          skills: ["UI Design", "Prototyping", "Design Systems", "Interaction Design", "Usability Testing"],
          projects: ["Mobile app design", "Interactive prototype", "Design system"],
          resources: ["UI design course", "Prototyping tutorials", "Design system examples"],
          milestones: ["Design beautiful UIs", "Create interactive prototypes", "Build design systems"]
        },
        {
          phaseNumber: 4,
          title: "Advanced UX & Portfolio",
          duration: "2 months",
          type: "advanced",
          description: "Master advanced UX techniques and build a professional portfolio.",
          skills: ["Advanced UX", "Portfolio Development", "Client Communication", "Design Strategy"],
          projects: ["Complete UX case study", "Professional portfolio", "Client project"],
          resources: ["Advanced UX course", "Portfolio examples", "Client communication guide"],
          milestones: ["Complete UX projects", "Build strong portfolio", "Present work effectively"]
        }
      ]
    }
  };

  // Return career-specific roadmap or default
  return careerRoadmaps[careerTitle] || {
    title: `${careerTitle} Learning Roadmap`,
    estimatedTime: "12 months",
    totalPhases: 4,
    generatedBy: "Frontend Structured",
    phases: [
      {
        phaseNumber: 1,
        title: "Foundation Phase",
        duration: "3 months",
        type: "foundation",
        description: `Build foundational knowledge for ${careerTitle}.`,
        skills: ["Core Fundamentals", "Basic Tools", "Industry Knowledge"],
        projects: ["Introductory project", "Basic portfolio piece"],
        resources: ["Online courses", "Documentation", "Practice platforms"],
        milestones: ["Complete fundamentals", "Build first project", "Understand basics"]
      },
      {
        phaseNumber: 2,
        title: "Development Phase",
        duration: "3 months",
        type: "beginner",
        description: `Develop practical skills in ${careerTitle}.`,
        skills: ["Practical Skills", "Intermediate Concepts", "Real-world Application"],
        projects: ["Skill-based project", "Portfolio expansion"],
        resources: ["Advanced courses", "Industry tutorials", "Practice projects"],
        milestones: ["Apply skills practically", "Build portfolio", "Gain confidence"]
      },
      {
        phaseNumber: 3,
        title: "Advanced Phase",
        duration: "3 months",
        type: "intermediate",
        description: `Master advanced concepts in ${careerTitle}.`,
        skills: ["Advanced Techniques", "Specialization", "Expert Knowledge"],
        projects: ["Complex project", "Specialized implementation"],
        resources: ["Expert tutorials", "Advanced documentation", "Professional guides"],
        milestones: ["Master advanced skills", "Complete complex projects", "Demonstrate expertise"]
      },
      {
        phaseNumber: 4,
        title: "Professional Phase",
        duration: "3 months",
        type: "advanced",
        description: `Achieve professional-level competency in ${careerTitle}.`,
        skills: ["Professional Skills", "Industry Standards", "Leadership"],
        projects: ["Professional portfolio", "Industry-standard project"],
        resources: ["Professional development", "Industry standards", "Leadership training"],
        milestones: ["Reach professional level", "Meet industry standards", "Ready for career"]
      }
    ]
  };
};

export default ManualPrediction;