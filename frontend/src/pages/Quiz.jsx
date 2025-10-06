import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitQuizAnswers } from '../services/api'; // Add this import
import { getQuizQuestions } from '../services/api';
import QuizCard from '../components/QuizCard';
import Loader from '../components/Loader';
import './Quiz.css';

const Quiz = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [quizStats, setQuizStats] = useState({
    totalQuestions: 25,           // ✅ CHANGED: Set expected total
    answeredQuestions: 0,
    techQuizQuestions: 7,         // ✅ CHANGED: Set expected count
    interestQuestions: 3,         // ✅ CHANGED: Set expected count
    scenarioQuestions: 5,         // ✅ CHANGED: Set expected count
    personalityQuestions: 5,      // ✅ CHANGED: Set expected count
    codeChallengeQuestions: 5     // ✅ CHANGED: Set expected count
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // You have 'submitting' but the function uses 'isSubmitting'

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    let timer;
    if (quizStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleSubmitQuiz();
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeRemaining]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching questions from API...');
      
      const response = await getQuizQuestions();
      const questionsData = response.data;
      
      console.log('📋 Raw API response:', response);
      console.log('📊 Questions data:', questionsData);
      console.log('📊 Questions count:', questionsData?.length);
      
      // Check if we got valid questions data
      if (questionsData && Array.isArray(questionsData) && questionsData.length > 0) {
        console.log('✅ Valid questions received from API');
        
        // 🔧 FIX: Infer categories from question IDs since JSON has null categories
        const fixedQuestions = questionsData.map(q => {
          let inferredCategory = 'Unknown';
          
          // Infer category from question ID patterns
          if (q.id && typeof q.id === 'string') {
            if (q.id.startsWith('TQ') || q.id.includes('tech') || q.id.includes('TQ')) {
              inferredCategory = 'TechQuiz';
            } else if (q.id.startsWith('cc-') || q.id.includes('code') || q.id.includes('CC')) {
              inferredCategory = 'CodeChallenge';
            } else if (q.id.startsWith('ip-') || q.id.includes('interest') || q.id.includes('IP')) {
              inferredCategory = 'InterestProfile';
            } else if (q.id.startsWith('scenario-') || q.id.includes('scenario') || q.id.startsWith('SC')) {
              inferredCategory = 'ScenarioSolver';
            } else if (q.id.startsWith('pi-') || q.id.includes('personality') || q.id.startsWith('P')) {
              inferredCategory = 'Personality';
            }
          }
          
          return {
            ...q,
            category: inferredCategory
          };
        });
        
        console.log('✅ Fixed questions with inferred categories');
        
        // 🎲 NEW: Generate random unique questions for each category
        const selectedQuestions = generateRandomQuizSet(fixedQuestions);
        
        console.log('🎲 Selected random questions:', selectedQuestions);
        setQuestions(selectedQuestions);
        
        // Update quiz stats based on selected questions
        const newStats = {
          totalQuestions: selectedQuestions.length,
          answeredQuestions: 0,
          techQuizQuestions: selectedQuestions.filter(q => q.category === 'TechQuiz').length,
          codeChallengeQuestions: selectedQuestions.filter(q => q.category === 'CodeChallenge').length,
          interestQuestions: selectedQuestions.filter(q => q.category === 'InterestProfile').length,
          scenarioQuestions: selectedQuestions.filter(q => q.category === 'ScenarioSolver').length,
          personalityQuestions: selectedQuestions.filter(q => q.category === 'Personality').length
        };
        
        console.log('📊 Quiz stats for selected questions:', newStats);
        setQuizStats(newStats);
        
      } else {
        console.log('⚠️ No valid questions received from API');
        setQuestions([]);
      }
      
    } catch (error) {
      console.error('❌ Error fetching questions:', error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));

    setQuizStats(prev => ({
      ...prev,
      answeredQuestions: Object.keys({...answers, [questionId]: answerIndex}).length
    }));

    // Auto advance to next question after 2 seconds
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }, 2000);
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const validateAnswers = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      setError(`Please answer all questions. You have answered ${answeredCount} out of ${questions.length} questions.`);
      return false;
    }
    setError(''); // Clear any previous errors
    return true;
  };

  const convertToLegacyAnswers = () => {
    const legacy = {};
    let index = 0;
    for (const [questionId, answerIndex] of Object.entries(answers)) {
      legacy[index] = answerIndex.toString();
      index++;
    }
    return legacy;
  };

  const handleSubmitQuiz = async () => {
    console.log('🔘 Submit button clicked');
    
    // Check validation
    if (!validateAnswers()) {
      console.log('❌ Validation failed');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('🚀 Starting quiz submission...');
      console.log('📝 Answers to submit:', answers);
      console.log('📊 Total questions:', questions.length);
      console.log('📊 Answered questions:', Object.keys(answers).length);
      
      // Convert answers to legacy format
      const legacyAnswers = convertToLegacyAnswers();
      console.log('📋 Legacy answers:', legacyAnswers);
      
      // 🔧 NEW: Use the updated backend with rule-based system
      const result = await submitQuizAnswers(answers, legacyAnswers);
      
      console.log('✅ Quiz submission successful:', result);
      console.log('✅ Result type:', typeof result);
      console.log('✅ Result keys:', Object.keys(result || {}));
      console.log('✅ Predictions:', result?.predictions);
      console.log('✅ Predictions length:', result?.predictions?.length);
      console.log('✅ Success flag:', result?.success);
      
      // 🎯 NEW: Check for rule-based vs AI predictions
      if (result && result.success && result.predictions && result.predictions.length > 0) {
        console.log('✅ Valid predictions received from backend');
        
        // Check if this is a fallback response (less reliable)
        if (result.fallback) {
          console.log('⚠️ Backend used fallback predictions');
        } else {
          console.log('✅ Backend used smart rule-based analysis');
        }
        
        // Store results and navigate to results page
        localStorage.setItem('quizResults', JSON.stringify({
          ...result,
          analysisType: result.fallback ? 'fallback' : 'smart-algorithm',
          submissionTime: new Date().toISOString()
        }));
        
        navigate('/results');
        
      } else {
        console.error('❌ Backend returned invalid response structure');
        console.log('📊 Generating frontend backup analysis...');
        
        // Use frontend analysis as last resort
        const frontendResult = generateSmartAnalysis();
        localStorage.setItem('quizResults', JSON.stringify({
          ...frontendResult,
          analysisType: 'frontend-analysis',
          submissionTime: new Date().toISOString()
        }));
        
        navigate('/results');
      }
      
    } catch (error) {
      console.error('❌ Quiz submission failed:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      
      // 🔍 Enhanced error handling
      if (error.response?.status === 500) {
        console.log('🔧 Backend server error - using frontend analysis');
      } else if (!error.response) {
        console.log('🔧 Network error - backend might be down');
      }
      
      // Always provide results using frontend analysis
      console.log('📊 Using frontend smart analysis as backup...');
      const frontendResult = generateSmartAnalysis();
      localStorage.setItem('quizResults', JSON.stringify({
        ...frontendResult,
        analysisType: 'frontend-backup',
        submissionTime: new Date().toISOString(),
        errorInfo: {
          status: error.response?.status,
          message: error.message
        }
      }));
      
      navigate('/results');
      
    } finally {
      setIsSubmitting(false);
      console.log('🏁 Quiz submission process completed');
    }
  };

  // 🎯 NEW: Add this function to generate smart analysis based on answers
  const generateSmartAnalysis = () => {
    console.log('🎯 Generating smart analysis based on user answers...');
    
    // Analyze answers by category and content
    const analysis = analyzeCategoryAnswers();
    console.log('📊 Category analysis:', analysis);
    
    // Generate career predictions based on answer patterns
    const predictions = generateCareerPredictions(analysis);
    console.log('🎯 Generated predictions:', predictions);
    
    return {
      success: true,
      message: "Quiz completed successfully - Results based on intelligent answer analysis",
      smartAnalysis: true,
      analysisData: analysis,
      predictions: predictions,
      answersProcessed: Object.keys(answers).length,
      quizSessionId: `frontend-${Date.now()}`,
      analysisDetails: {
        totalQuestions: questions.length,
        categoriesAnalyzed: Object.keys(analysis.categoryDetails).length,
        strongestArea: analysis.careerIndicators ? 
          Object.keys(analysis.careerIndicators).reduce((a, b) => 
            analysis.careerIndicators[a] > analysis.careerIndicators[b] ? a : b
          ) : 'general'
      }
    };
  };

  // 🧮 NEW: Analyze answers by category with detailed scoring
  const analyzeCategoryAnswers = () => {
    const analysis = {
      techScore: 0,
      codingScore: 0,
      interestScore: 0,
      scenarioScore: 0,
      personalityScore: 0,
      totalAnswered: 0,
      categoryDetails: {},
      careerIndicators: {
        dataScience: 0,
        softwareDev: 0,
        webDev: 0,
        design: 0,
        business: 0,
        cybersecurity: 0
      }
    };
    
    Object.keys(answers).forEach(questionId => {
      const question = questions.find(q => q.id === questionId);
      const answerIndex = answers[questionId];
      
      if (question) {
        analysis.totalAnswered++;
        
        // Initialize category details if not exists
        if (!analysis.categoryDetails[question.category]) {
          analysis.categoryDetails[question.category] = {
            answered: 0,
            scores: [],
            avgScore: 0
          };
        }
        
        // Score based on category and answer patterns
        let categoryScore = 0;
        
        switch (question.category) {
          case 'TechQuiz':
            // Higher scores for correct technical answers (assuming index 1 or 2 are often correct)
            categoryScore = answerIndex === 1 ? 4 : (answerIndex === 2 ? 3 : (answerIndex === 0 ? 2 : 1));
            analysis.techScore += categoryScore;
            
            // Specific career indicators based on question content
            if (question.question && typeof question.question === 'string') {
              const questionText = question.question.toLowerCase();
              if (questionText.includes('data') || questionText.includes('algorithm') || questionText.includes('statistics')) {
                analysis.careerIndicators.dataScience += categoryScore;
              }
              if (questionText.includes('programming') || questionText.includes('code') || questionText.includes('software')) {
                analysis.careerIndicators.softwareDev += categoryScore;
              }
              if (questionText.includes('web') || questionText.includes('html') || questionText.includes('css')) {
                analysis.careerIndicators.webDev += categoryScore;
              }
              if (questionText.includes('security') || questionText.includes('encryption')) {
                analysis.careerIndicators.cybersecurity += categoryScore;
              }
            }
            break;
            
          case 'CodeChallenge':
            // Analytical approach scores higher
            categoryScore = answerIndex === 1 ? 4 : (answerIndex === 2 ? 3 : 2);
            analysis.codingScore += categoryScore;
            analysis.careerIndicators.softwareDev += categoryScore;
            analysis.careerIndicators.dataScience += Math.floor(categoryScore * 0.8);
            break;
            
          case 'InterestProfile':
            // Score based on interests (higher index often indicates specialized interest)
            categoryScore = (answerIndex + 1) * 2;
            analysis.interestScore += categoryScore;
            
            // Career indicators based on interest questions
            if (answerIndex === 3) { // Often data/analysis related
              analysis.careerIndicators.dataScience += 4;
            } else if (answerIndex === 2) { // Often tech related
              analysis.careerIndicators.softwareDev += 3;
            } else if (answerIndex === 1) { // Often creative/design
              analysis.careerIndicators.design += 3;
            } else { // Often business
              analysis.careerIndicators.business += 2;
            }
            break;
            
          case 'ScenarioSolver':
            // Analytical and systematic approaches score higher
            categoryScore = answerIndex === 2 ? 4 : (answerIndex === 1 ? 3 : (answerIndex === 3 ? 2 : 1));
            analysis.scenarioScore += categoryScore;
            
            // Analytical problem solving indicates data science aptitude
            if (answerIndex === 2 || answerIndex === 1) {
              analysis.careerIndicators.dataScience += 3;
              analysis.careerIndicators.softwareDev += 2;
            }
            break;
            
          case 'Personality':
            // Different personality traits for different careers
            categoryScore = (answerIndex + 1) * 1.5;
            analysis.personalityScore += categoryScore;
            
            // Personality indicators
            if (answerIndex === 1) { // Often analytical/logical
              analysis.careerIndicators.dataScience += 3;
              analysis.careerIndicators.softwareDev += 2;
            } else if (answerIndex === 0) { // Often creative
              analysis.careerIndicators.design += 3;
              analysis.careerIndicators.webDev += 2;
            } else if (answerIndex === 2) { // Often leadership/business
              analysis.careerIndicators.business += 3;
            }
            break;
        }
        
        // Update category details
        analysis.categoryDetails[question.category].answered++;
        analysis.categoryDetails[question.category].scores.push(categoryScore);
      }
    });
    
    // Calculate averages and percentages
    Object.keys(analysis.categoryDetails).forEach(category => {
      const details = analysis.categoryDetails[category];
      details.avgScore = details.scores.length > 0 
        ? details.scores.reduce((a, b) => a + b, 0) / details.scores.length 
        : 0;
    });
    
    // Normalize scores to percentages
    const maxPossibleTech = analysis.categoryDetails.TechQuiz?.answered * 4 || 1;
    const maxPossibleCoding = analysis.categoryDetails.CodeChallenge?.answered * 4 || 1;
    const maxPossibleInterest = analysis.categoryDetails.InterestProfile?.answered * 8 || 1;
    const maxPossibleScenario = analysis.categoryDetails.ScenarioSolver?.answered * 4 || 1;
    const maxPossiblePersonality = analysis.categoryDetails.Personality?.answered * 6 || 1;
    
    analysis.techPercentage = Math.round((analysis.techScore / maxPossibleTech) * 100);
    analysis.codingPercentage = Math.round((analysis.codingScore / maxPossibleCoding) * 100);
    analysis.interestPercentage = Math.round((analysis.interestScore / maxPossibleInterest) * 100);
    analysis.scenarioPercentage = Math.round((analysis.scenarioScore / maxPossibleScenario) * 100);
    analysis.personalityPercentage = Math.round((analysis.personalityScore / maxPossiblePersonality) * 100);
    
    return analysis;
  };

  // 🎯 NEW: Generate career predictions based on detailed analysis
  const generateCareerPredictions = (analysis) => {
    console.log('🎯 Generating predictions from analysis:', analysis);
    
    // Calculate career scores based on multiple factors
    const careerScores = {
      "Data Scientist": {
        base: analysis.careerIndicators.dataScience || 0,
        multiplier: (analysis.techPercentage * 0.25) + 
                   (analysis.codingPercentage * 0.25) + 
                   (analysis.scenarioPercentage * 0.3) + 
                   (analysis.interestPercentage * 0.2),
        icon: "📊",
        description: "Your analytical thinking, technical skills, and problem-solving approach make you well-suited for data science roles.",
        salary_range: "$80,000 - $150,000",
        growth_rate: "Very High (22%)",
        learning_time: "12-18 months",
        difficulty: "Advanced"
      },
      "Software Developer": {
        base: analysis.careerIndicators.softwareDev || 0,
        multiplier: (analysis.techPercentage * 0.35) + 
                   (analysis.codingPercentage * 0.35) + 
                   (analysis.scenarioPercentage * 0.2) + 
                   (analysis.personalityPercentage * 0.1),
        icon: "💻",
        description: "Your technical skills, coding ability, and systematic problem-solving align perfectly with software development.",
        salary_range: "$70,000 - $130,000",
        growth_rate: "High (20%)",
        learning_time: "8-14 months",
        difficulty: "Moderate"
      },
      "Frontend Developer": {
        base: analysis.careerIndicators.webDev || 0,
        multiplier: (analysis.techPercentage * 0.3) + 
                   (analysis.codingPercentage * 0.3) + 
                   (analysis.interestPercentage * 0.25) + 
                   (analysis.personalityPercentage * 0.15),
        icon: "🎨",
        description: "Your combination of technical skills and creative thinking makes you ideal for frontend development.",
        salary_range: "$60,000 - $120,000",
        growth_rate: "High (18%)",
        learning_time: "6-12 months",
        difficulty: "Moderate"
      },
      "Business Analyst": {
        base: analysis.careerIndicators.business || 0,
        multiplier: (analysis.scenarioPercentage * 0.4) + 
                   (analysis.interestPercentage * 0.3) + 
                   (analysis.personalityPercentage * 0.3),
        icon: "📈",
        description: "Your analytical mindset, business understanding, and communication skills make you perfect for analyst roles.",
        salary_range: "$60,000 - $110,000",
        growth_rate: "High (19%)",
        learning_time: "4-8 months",
        difficulty: "Moderate"
      },
      "UX/UI Designer": {
        base: analysis.careerIndicators.design || 0,
        multiplier: (analysis.interestPercentage * 0.4) + 
                   (analysis.personalityPercentage * 0.3) + 
                   (analysis.scenarioPercentage * 0.3),
        icon: "🎨",
        description: "Your creative thinking and user-focused approach align well with UX/UI design principles.",
        salary_range: "$55,000 - $110,000",
        growth_rate: "High (16%)",
        learning_time: "6-10 months",
        difficulty: "Moderate"
      },
      "Cybersecurity Specialist": {
        base: analysis.careerIndicators.cybersecurity || 0,
        multiplier: (analysis.techPercentage * 0.4) + 
                   (analysis.scenarioPercentage * 0.3) + 
                   (analysis.codingPercentage * 0.3),
        icon: "🔐",
        description: "Your technical knowledge and problem-solving skills indicate strong potential in cybersecurity.",
        salary_range: "$75,000 - $140,000",
        growth_rate: "Very High (28%)",
        learning_time: "10-16 months",
        difficulty: "Advanced"
      }
    };
    
    // Calculate final scores and sort
    const careers = Object.keys(careerScores).map(careerName => {
      const career = careerScores[careerName];
      // Enhanced scoring algorithm
      const baseScore = Math.min(40, career.base * 3);
      const multiplierScore = Math.min(55, career.multiplier);
      const finalScore = Math.min(95, Math.max(65, Math.round(baseScore + multiplierScore)));
      
      return {
        title: careerName,
        match_percentage: finalScore,
        icon: career.icon,
        description: career.description,
        salary_range: career.salary_range,
        growth_rate: career.growth_rate,
        learning_time: career.learning_time,
        difficulty: career.difficulty,
        matching_skills: getMatchingSkills(careerName, analysis),
        skills_to_learn: getSkillsToLearn(careerName),
        next_steps: getNextSteps(careerName)
      };
    });
    
    // Sort by match percentage and return top 3
    return careers
      .sort((a, b) => b.match_percentage - a.match_percentage)
      .slice(0, 3);
  };

  // 🎯 NEW: Helper function to determine matching skills
  const getMatchingSkills = (careerName, analysis) => {
    const skillsMap = {
      "Data Scientist": ["Python", "Statistics", "Analytics"],
      "Software Developer": ["Programming", "Problem Solving", "Logic"],
      "Frontend Developer": ["HTML/CSS", "JavaScript", "Design Thinking"],
      "Business Analyst": ["Analysis", "Communication", "Process Thinking"],
      "Cybersecurity Specialist": ["Technical Knowledge", "Security Mindset", "Problem Solving"],
      "UX/UI Designer": ["Design Thinking", "User Empathy", "Creative Problem Solving"]
    };
    
    return skillsMap[careerName] || ["Analytical Thinking", "Problem Solving"];
  };

  // Add these helper functions after generateCareerPredictions:

  const getSkillsToLearn = (careerName) => {
    const skillsMap = {
      "Data Scientist": ["Python", "Machine Learning", "Statistics", "SQL", "Data Visualization"],
      "Software Developer": ["Advanced Programming", "Software Architecture", "DevOps", "Testing"],
      "Frontend Developer": ["React/Vue.js", "CSS Frameworks", "JavaScript ES6+", "UI/UX Design"],
      "Business Analyst": ["Business Intelligence", "Analytics Tools", "Excel/Power BI", "Process Modeling"],
      "UX/UI Designer": ["Figma/Adobe XD", "User Research", "Wireframing", "Prototyping"],
      "Cybersecurity Specialist": ["Network Security", "Ethical Hacking", "Risk Assessment", "Security Tools"]
    };
    
    return skillsMap[careerName] || ["Problem Solving", "Communication", "Technical Skills"];
  };

  const getNextSteps = (careerName) => {
    const stepsMap = {
      "Data Scientist": ["Learn Python for data analysis", "Practice with real datasets", "Build a data science portfolio"],
      "Software Developer": ["Master a programming language", "Build complex projects", "Contribute to open source"],
      "Frontend Developer": ["Master modern JavaScript", "Learn a frontend framework", "Build responsive websites"],
      "Business Analyst": ["Learn Excel and Power BI", "Understand business processes", "Practice data visualization"],
      "UX/UI Designer": ["Learn design tools", "Study user psychology", "Build a design portfolio"],
      "Cybersecurity Specialist": ["Study network fundamentals", "Learn security tools", "Get security certifications"]
    };
    
    return stepsMap[careerName] || ["Research the field", "Build relevant skills", "Network with professionals"];
  };

  // 🔬 MOVE THIS FUNCTION INSIDE THE COMPONENT:
  const diagnoseAIFailure = (result) => {
    const diagnosis = {
      isValidAI: false,
      failureReason: 'Unknown',
      recommendations: []
    };
    
    console.log('🔬 Starting AI failure diagnosis...');
    
    if (!result || !result.success || !result.predictions) {
      diagnosis.failureReason = 'Invalid response structure';
      return diagnosis;
    }
    
    // Check for generic template responses
    const firstPrediction = result.predictions[0];
    const genericIndicators = [
      'AI-recommended career path based on',
      'Secondary career recommendation from',
      'Third career option from'
    ];
    
    const hasGenericDescription = firstPrediction?.description && 
      genericIndicators.some(indicator => 
        firstPrediction.description.includes(indicator)
      );
    
    if (hasGenericDescription) {
      diagnosis.failureReason = 'AI returned generic template responses';
      diagnosis.recommendations = [
        'AI is not personalizing responses',
        'Check AI prompt engineering',
        'Backend AI service needs debugging'
      ];
      return diagnosis;
    }
    
    // Check for template percentages
    if (result.predictions.length >= 3 &&
        result.predictions[0].match_percentage === 70 &&
        result.predictions[1].match_percentage === 65 &&
        result.predictions[2].match_percentage === 60) {
      diagnosis.failureReason = 'AI returned template match percentages';
      diagnosis.recommendations = [
        'AI is not calculating personalized scores',
        'Backend AI prompt needs improvement'
      ];
      return diagnosis;
    }
    
    // If we reach here, AI appears to be working
    diagnosis.isValidAI = true;
    diagnosis.failureReason = 'AI response appears valid';
    return diagnosis;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return (quizStats.answeredQuestions / quizStats.totalQuestions) * 100;
  };

  const getCategoryProgress = () => {
    console.log('🔍 Debugging category progress...');
    console.log('📊 Current questions:', questions);
    console.log('📊 Current answers:', answers);
    console.log('📊 Quiz stats:', quizStats);
    
    // Log all unique categories from loaded questions
    const uniqueCategories = [...new Set(questions.map(q => q.category))];
    console.log('📋 Unique categories in questions:', uniqueCategories);
    
    const categories = [
      { name: 'Technical', key: 'techquiz', icon: '💻', total: quizStats.techQuizQuestions, category: 'TechQuiz' },
      { name: 'Code Challenge', key: 'codechallenge', icon: '⚡', total: quizStats.codeChallengeQuestions, category: 'CodeChallenge' },
      { name: 'Interest', key: 'interest', icon: '🎯', total: quizStats.interestQuestions, category: 'InterestProfile' },
      { name: 'Scenario', key: 'scenario', icon: '🧩', total: quizStats.scenarioQuestions, category: 'ScenarioSolver' },
      { name: 'Personality', key: 'personality', icon: '🧠', total: quizStats.personalityQuestions, category: 'Personality' }
    ];

    return categories.map(category => {
      const answered = Object.keys(answers).filter(qId => {
        const question = questions.find(q => q.id === qId);
        const matchesCategory = question && question.category === category.category;
        
        // Debug each category
        if (question) {
          console.log(`🔍 Question ${qId}: category="${question.category}", looking for="${category.category}", matches=${matchesCategory}`);
        }
        
        return matchesCategory;
      }).length;

      console.log(`📊 Category ${category.name}: ${answered}/${category.total}`);

      return {
        ...category,
        answered,
        percentage: category.total > 0 ? (answered / category.total) * 100 : 0
      };
    });
  };

  // 🎲 NEW: Add this function after fetchQuestions to generate random quiz sets
  const generateRandomQuizSet = (allQuestions) => {
    console.log('🎲 Generating random quiz set...');
    
    // Define how many questions we want from each category
    const categoryLimits = {
      'TechQuiz': 7,
      'CodeChallenge': 5,
      'InterestProfile': 3,
      'ScenarioSolver': 5,
      'Personality': 5
    };
    
    // Group questions by category
    const questionsByCategory = {};
    allQuestions.forEach(q => {
      if (!questionsByCategory[q.category]) {
        questionsByCategory[q.category] = [];
      }
      questionsByCategory[q.category].push(q);
    });
    
    console.log('📋 Questions available by category:');
    Object.keys(questionsByCategory).forEach(cat => {
      console.log(`  ${cat}: ${questionsByCategory[cat].length} questions`);
    });
    
    // Select random questions from each category
    const selectedQuestions = [];
    
    Object.keys(categoryLimits).forEach(category => {
      const availableQuestions = questionsByCategory[category] || [];
      const limit = categoryLimits[category];
      
      console.log(`🎯 Selecting ${limit} questions from ${category} (${availableQuestions.length} available)`);
      
      if (availableQuestions.length > 0) {
        // Shuffle the questions and take the required number
        const shuffled = shuffleArray([...availableQuestions]);
        const selected = shuffled.slice(0, Math.min(limit, shuffled.length));
        
        console.log(`✅ Selected ${selected.length} questions from ${category}:`, selected.map(q => q.id));
        selectedQuestions.push(...selected);
      } else {
        console.log(`⚠️ No questions available for category: ${category}`);
      }
    });
    
    // Shuffle the final question order so categories are mixed
    const finalQuestions = shuffleArray(selectedQuestions);
    
    console.log('🎲 Final randomized question order:', finalQuestions.map(q => `${q.id}(${q.category})`));
    console.log(`✅ Total selected questions: ${finalQuestions.length}`);
    
    return finalQuestions;
  };

  // 🎲 NEW: Add this utility function to shuffle arrays
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <Loader 
          message="🔄 Loading 25 quiz questions from 5 categories..." 
          size="large" 
          variant="primary" 
        />
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="quiz-container">
        <Loader 
          message="🤖 AI is analyzing your responses across all 5 categories..." 
          size="large" 
          variant="success" 
        />
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="quiz-container">
        <div className="quiz-intro">
          <div className="intro-content">
            <div className="intro-header">
              <h1 className="intro-title">
                <span className="title-icon">🧠</span>
                AI Career Assessment Quiz
              </h1>
              <p className="intro-subtitle">
                Comprehensive 5-category assessment to discover your perfect career path
              </p>
            </div>

            <div className="quiz-overview">
              <div className="overview-stats">
                <div className="stat-item">
                  <div className="stat-number">25</div>
                  <div className="stat-label">Total Questions</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">30</div>
                  <div className="stat-label">Minutes</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">5</div>
                  <div className="stat-label">Categories</div>
                </div>
              </div>

              <div className="quiz-categories">
                <div className="category-item techquiz">
                  <div className="category-icon">💻</div>
                  <div className="category-info">
                    <h3>Technical Skills</h3>
                    <p>7 questions</p> {/* ✅ HARDCODED */}
                  </div>
                </div>
                <div className="category-item codechallenge">
                  <div className="category-icon">⚡</div>
                  <div className="category-info">
                    <h3>Code Challenge</h3>
                    <p>5 questions</p> {/* ✅ HARDCODED */}
                  </div>
                </div>
                <div className="category-item interest">
                  <div className="category-icon">🎯</div>
                  <div className="category-info">
                    <h3>Interest Profile</h3>
                    <p>3 questions</p> {/* ✅ HARDCODED */}
                  </div>
                </div>
                <div className="category-item scenario">
                  <div className="category-icon">🧩</div>
                  <div className="category-info">
                    <h3>Scenario Solving</h3>
                    <p>5 questions</p> {/* ✅ HARDCODED */}
                  </div>
                </div>
                <div className="category-item personality">
                  <div className="category-icon">🧠</div>
                  <div className="category-info">
                    <h3>Personality Assessment</h3>
                    <p>5 questions</p> {/* ✅ HARDCODED */}
                  </div>
                </div>
              </div>
            </div>

            <div className="quiz-instructions">
              <h3>📋 Instructions</h3>
              <ul>
                <li><strong>Answer honestly</strong> for the most accurate career recommendations</li>
                <li><strong>30 minutes total</strong> - that's about 1.2 minutes per question</li>
                <li><strong>5 comprehensive categories</strong> will assess different aspects of your profile</li>
                <li><strong>Auto-advance</strong> after answering, or navigate manually</li>
                <li><strong>AI analysis</strong> will match you with ideal career paths</li>
              </ul>
            </div>

            <div className="intro-actions">
              <button 
                onClick={() => setQuizStarted(true)}
                className="start-quiz-btn"
              >
                🚀 Start 25-Question Assessment
              </button>
              <button 
                onClick={() => navigate(-1)}
                className="back-btn"
              >
                ← Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      {/* Quiz Header */}
      <div className="quiz-header">
        <div className="quiz-progress">
          <div className="progress-info">
            <h2>AI Career Assessment</h2>
            <p>Question {currentQuestionIndex + 1} of 25</p>
          </div>
          
          <div className="quiz-timer">
            <div className={`timer ${timeRemaining < 300 ? 'warning' : ''}`}>
              <span className="timer-icon">⏰</span>
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>

        <div className="overall-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {quizStats.answeredQuestions}/25 completed ({Math.round(getProgressPercentage())}%)
          </div>
        </div>

        {/* Question Navigation */}
        <div className="question-navigation">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToQuestion(index)}
              className={`nav-dot ${
                index === currentQuestionIndex ? 'active' : ''
              } ${
                answers[questions[index]?.id] !== undefined ? 'completed' : ''
              }`}
              title={`Question ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz Content */}
      <div className="quiz-content">
        {currentQuestion && (
          <QuizCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={25}
            category={currentQuestion.category}
            isAnswered={answers[currentQuestion.id] !== undefined}
            selectedAnswer={answers[currentQuestion.id]}
          />
        )}

        {/* Quiz Controls */}
        <div className="quiz-controls">
          <button 
            onClick={() => goToQuestion(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="control-btn secondary"
          >
            ← Previous
          </button>

          <div className="control-center">
            {quizStats.answeredQuestions === 25 && (
              <button 
                onClick={handleSubmitQuiz}
                disabled={isSubmitting || Object.keys(answers).length < questions.length}
                className="submit-button"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
            
            {/* Add error display */}
            {error && (
              <div className="error-message" style={{color: 'red', marginTop: '10px'}}>
                {error}
              </div>
            )}
          </div>

          <button 
            onClick={() => goToQuestion(Math.min(questions.length - 1, currentQuestionIndex + 1))}
            disabled={currentQuestionIndex === questions.length - 1}
            className="control-btn primary"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Quiz Stats Sidebar */}
      <div className="quiz-stats">
        <h3>Quiz Progress</h3>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-value">{Math.round(getProgressPercentage())}%</div>
              <div className="stat-name">Completed</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-value">{quizStats.answeredQuestions}</div>
              <div className="stat-name">Answered</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-info">
              <div className="stat-value">{Math.round((1800 - timeRemaining) / 60)}</div>
              <div className="stat-name">Minutes Used</div>
            </div>
          </div>
        </div>

        <div className="category-progress">
          <h4>5 Categories Progress</h4>
          {getCategoryProgress().map(category => (
            <div key={category.key} className="category-stat">
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
                <span className="category-count">{category.answered}/{category.total}</span>
              </div>
              <div className="category-bar">
                <div 
                  className={`category-fill ${category.key}`}
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
