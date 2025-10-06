import React, { useState, useEffect } from 'react';
import './QuizCard.css';

const QuizCard = ({ 
  question, 
  onAnswer, 
  questionNumber, 
  totalQuestions, 
  category,
  isAnswered = false,
  selectedAnswer = null 
}) => {
  const [selected, setSelected] = useState(selectedAnswer);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    setSelected(selectedAnswer);
  }, [selectedAnswer]);

  const handleOptionClick = (optionIndex) => {
    if (isAnswered) return;
    
    setSelected(optionIndex);
    setShowFeedback(true);
    
    // Delay before calling onAnswer to show feedback
    setTimeout(() => {
      onAnswer(question.id, optionIndex);
      setShowFeedback(false);
    }, 1500);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'TechQuiz': return '💻';
      case 'InterestProfile': return '🎯';
      case 'ScenarioSolver': return '🧠';
      default: return '📝';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'TechQuiz': return 'tech';
      case 'InterestProfile': return 'interest';
      case 'ScenarioSolver': return 'scenario';
      default: return 'default';
    }
  };

  return (
    <div className={`quiz-card ${getCategoryColor(category)} ${isAnswered ? 'answered' : ''}`}>
      {/* Card Header */}
      <div className="quiz-card-header">
        <div className="question-info">
          <div className={`question-number ${getCategoryColor(category)}`}>
            {questionNumber} / {totalQuestions}
          </div>
          <div className={`category-badge ${getCategoryColor(category)}`}>
            <span className="category-icon">{getCategoryIcon(category)}</span>
            {category}
          </div>
        </div>
        
        <div className="progress-ring">
          <svg className="progress-ring-svg" width="50" height="50">
            <circle
              className="progress-ring-circle-bg"
              stroke="#e2e8f0"
              strokeWidth="3"
              fill="transparent"
              r="20"
              cx="25"
              cy="25"
            />
            <circle
              className={`progress-ring-circle ${getCategoryColor(category)}`}
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              r="20"
              cx="25"
              cy="25"
              strokeDasharray={`${(questionNumber / totalQuestions) * 125.6} 125.6`}
              transform="rotate(-90 25 25)"
            />
          </svg>
          <span className="progress-percentage">
            {Math.round((questionNumber / totalQuestions) * 100)}%
          </span>
        </div>
      </div>

      {/* Question Content */}
      <div className="quiz-content">
        <h3 className="question-text">{question.question}</h3>
        
        {question.description && (
          <p className="question-description">{question.description}</p>
        )}

        {/* Options */}
        <div className="options-container">
          {question.options && question.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${
                selected === index ? 'selected' : ''
              } ${
                showFeedback && selected === index ? 'feedback' : ''
              }`}
              onClick={() => handleOptionClick(index)}
              disabled={isAnswered || showFeedback}
            >
              <div className="option-content">
                <div className="option-letter">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="option-text">{option.text}</span>
              </div>
              
              {selected === index && (
                <div className="option-indicator">
                  {showFeedback ? (
                    <div className="loading-dot">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    <span className="check-mark">✓</span>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Card Footer */}
      <div className="quiz-card-footer">
        <div className="question-meta">
          <span className="difficulty">
            Difficulty: <strong>{question.difficulty || 'Medium'}</strong>
          </span>
          {question.weight && (
            <span className="weight">
              Weight: <strong>{question.weight}x</strong>
            </span>
          )}
        </div>
        
        {isAnswered && (
          <div className="answered-indicator">
            <span className="answered-icon">✅</span>
            Answered
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCard;