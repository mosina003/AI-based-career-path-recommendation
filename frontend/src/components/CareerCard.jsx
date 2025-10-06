import React from 'react';
import './CareerCard.css';

const CareerCard = ({ title, confidence, rank, description, skills, onClick }) => {
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'high';
    if (confidence >= 0.6) return 'medium';
    return 'low';
  };

  const confidencePercentage = Math.round(confidence * 100);
  const confidenceLevel = getConfidenceColor(confidence);

  return (
    <div className={`career-card ${confidenceLevel}`} onClick={onClick}>
      <div className="career-rank">#{rank}</div>
      
      <div className="career-content">
        <h3 className="career-title">{title}</h3>
        
        <div className="confidence-section">
          <div className="confidence-label">AI Confidence</div>
          <div className="confidence-bar">
            <div 
              className={`confidence-fill ${confidenceLevel}`}
              style={{ width: `${confidencePercentage}%` }}
            ></div>
          </div>
          <div className={`confidence-percentage ${confidenceLevel}`}>
            {confidencePercentage}%
          </div>
        </div>

        {description && (
          <p className="career-description">{description}</p>
        )}

        {skills && skills.length > 0 && (
          <div className="career-skills">
            <div className="skills-label">Key Skills:</div>
            <div className="skills-tags">
              {skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="skill-tag more">+{skills.length - 3} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="career-actions">
        <button className="learn-more-btn">
          Learn More →
        </button>
      </div>
    </div>
  );
};

export default CareerCard;