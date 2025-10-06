import React from 'react';
import './Loader.css';

const Loader = ({ message = "Loading...", size = "medium", variant = "primary" }) => {
  const getLoaderSize = () => {
    switch (size) {
      case 'small': return 'loader-small';
      case 'large': return 'loader-large';
      default: return 'loader-medium';
    }
  };

  return (
    <div className="loader-container">
      <div className={`loader ${getLoaderSize()} loader-${variant}`}>
        <div className="loader-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="ai-icon">🤖</div>
        </div>
      </div>
      
      <div className="loader-content">
        <h3 className="loader-message">{message}</h3>
        <div className="loader-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
};

export default Loader;