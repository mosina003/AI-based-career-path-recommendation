package com.careerpredictor.dto;

import java.util.List;
import java.util.Map;

public class CareerPredictionResult {
    private List<Map<String, Object>> predictions;
    private boolean success;
    private String message;
    private String analysisType;
    
    // Constructor
    public CareerPredictionResult(List<Map<String, Object>> predictions) {
        this.predictions = predictions;
        this.success = true;
        this.message = "Career predictions generated successfully";
        this.analysisType = "smart-algorithm";
    }
    
    // Default constructor
    public CareerPredictionResult() {
        this.success = false;
        this.message = "Failed to generate predictions";
    }
    
    // Getters and Setters
    public List<Map<String, Object>> getPredictions() {
        return predictions;
    }
    
    public void setPredictions(List<Map<String, Object>> predictions) {
        this.predictions = predictions;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getAnalysisType() {
        return analysisType;
    }
    
    public void setAnalysisType(String analysisType) {
        this.analysisType = analysisType;
    }
}