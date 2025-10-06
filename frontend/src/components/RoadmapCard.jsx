import React, { useState } from 'react';
import './RoadmapCard.css';

const RoadmapCard = ({ roadmap, careerTitle }) => {
  const [expandedPhase, setExpandedPhase] = useState(null);

  if (!roadmap) {
    return (
      <div className="roadmap-card no-roadmap">
        <div className="no-roadmap-content">
          <h3>🗺️ Learning Roadmap</h3>
          <p>Detailed roadmap for {careerTitle} is being generated...</p>
          <button className="generate-roadmap-btn">
            Generate Detailed Roadmap
          </button>
        </div>
      </div>
    );
  }

  const togglePhase = (phaseIndex) => {
    setExpandedPhase(expandedPhase === phaseIndex ? null : phaseIndex);
  };

  const getPhaseIcon = (type) => {
    const icons = {
      foundation: '📚',
      beginner: '🌱', 
      intermediate: '🚀',
      advanced: '⭐'
    };
    return icons[type] || '📖';
  };

  const getPhaseColor = (type) => {
    const colors = {
      foundation: '#4CAF50',
      beginner: '#2196F3',
      intermediate: '#FF9800',
      advanced: '#9C27B0'
    };
    return colors[type] || '#666';
  };

  return (
    <div className="roadmap-card">
      {/* Roadmap Header */}
      <div className="roadmap-header">
        <div className="roadmap-title-section">
          <h3 className="roadmap-title">
            <span className="roadmap-icon">🗺️</span>
            {roadmap.title || `${careerTitle} Learning Roadmap`}
          </h3>
          <p className="roadmap-subtitle">
            {roadmap.generatedBy === 'AI-Enhanced' ? 'AI-generated' : 'Structured'} personalized learning roadmap
          </p>
        </div>
        
        <div className="roadmap-stats">
          <div className="stat-item">
            <span className="stat-number">{roadmap.totalPhases || roadmap.phases?.length || 4}</span>
            <span className="stat-label">Phases</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{roadmap.estimatedTime || '12 months'}</span>
            <span className="stat-label">Duration</span>
          </div>
        </div>
      </div>

      {/* Roadmap Phases */}
      <div className="roadmap-phases">
        {roadmap.phases?.map((phase, index) => (
          <div 
            key={index} 
            className={`phase-card ${expandedPhase === index ? 'expanded' : ''}`}
          >
            {/* Phase Header */}
            <div 
              className="phase-header"
              onClick={() => togglePhase(index)}
              style={{ borderLeftColor: getPhaseColor(phase.type) }}
            >
              <div className="phase-info">
                <div className="phase-number-section">
                  <div 
                    className="phase-number"
                    style={{ backgroundColor: getPhaseColor(phase.type) }}
                  >
                    Phase {phase.phaseNumber || index + 1}
                  </div>
                  <span className="phase-icon">{getPhaseIcon(phase.type)}</span>
                </div>
                
                <div className="phase-details">
                  <h4 className="phase-title">{phase.title}</h4>
                  <div className="phase-meta">
                    <span className="phase-duration">
                      <span className="meta-icon">⏱️</span>
                      {phase.duration}
                    </span>
                    <span className="phase-type">
                      <span className="meta-icon">🎯</span>
                      {phase.type}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="phase-toggle">
                <span className="toggle-icon">
                  {expandedPhase === index ? '▼' : '▶'}
                </span>
              </div>
            </div>

            {/* Phase Content */}
            {expandedPhase === index && (
              <div className="phase-content">
                <div className="phase-description">
                  <p>{phase.description}</p>
                </div>
                
                <div className="phase-sections">
                  {/* Skills Section */}
                  <div className="content-section">
                    <h5 className="section-title">
                      <span className="section-icon">🛠️</span>
                      Skills to Learn
                    </h5>
                    <div className="skills-list">
                      {phase.skills?.map((skill, skillIndex) => (
                        <span key={skillIndex} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Projects Section */}
                  <div className="content-section">
                    <h5 className="section-title">
                      <span className="section-icon">🏗️</span>
                      Hands-on Projects
                    </h5>
                    <ul className="projects-list">
                      {phase.projects?.map((project, projectIndex) => (
                        <li key={projectIndex} className="project-item">
                          <span className="project-icon">📂</span>
                          {project}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Resources Section */}
                  <div className="content-section">
                    <h5 className="section-title">
                      <span className="section-icon">📚</span>
                      Learning Resources
                    </h5>
                    <ul className="resources-list">
                      {phase.resources?.map((resource, resourceIndex) => (
                        <li key={resourceIndex} className="resource-item">
                          <span className="resource-icon">🔗</span>
                          {resource}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Milestones Section */}
                  <div className="content-section">
                    <h5 className="section-title">
                      <span className="section-icon">🏆</span>
                      Phase Milestones
                    </h5>
                    <ul className="milestones-list">
                      {phase.milestones?.map((milestone, milestoneIndex) => (
                        <li key={milestoneIndex} className="milestone-item">
                          <span className="milestone-icon">✅</span>
                          {milestone}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapCard;