package com.careerpredictor.dto;

import java.util.List;
import java.util.Map;

public class PredictionResponseDTO {
    private Long studentId;
    private String studentName;
    private String analysisType;
    private String generatedBy;
    private List<Map<String, Object>> predictions;
    private boolean success;
    private String message;
    
    // ✅ OLD FORMAT SUPPORT (for backward compatibility)
    private String career1;
    private Double career1Confidence;
    private String career2;
    private Double career2Confidence;
    private String career3;
    private Double career3Confidence;
    private String roadmap;
    
    // Default constructor
    public PredictionResponseDTO() {}
    
    // Getters and Setters for new format
    public Long getStudentId() {
        return studentId;
    }
    
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
    
    public String getStudentName() {
        return studentName;
    }
    
    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
    
    public String getAnalysisType() {
        return analysisType;
    }
    
    public void setAnalysisType(String analysisType) {
        this.analysisType = analysisType;
    }
    
    public String getGeneratedBy() {
        return generatedBy;
    }
    
    public void setGeneratedBy(String generatedBy) {
        this.generatedBy = generatedBy;
    }
    
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
    
    // ✅ OLD FORMAT GETTERS/SETTERS (for backward compatibility)
    public String getCareer1() {
        return career1;
    }
    
    public void setCareer1(String career1) {
        this.career1 = career1;
    }
    
    public Double getCareer1Confidence() {
        return career1Confidence;
    }
    
    public void setCareer1Confidence(Double career1Confidence) {
        this.career1Confidence = career1Confidence;
    }
    
    public String getCareer2() {
        return career2;
    }
    
    public void setCareer2(String career2) {
        this.career2 = career2;
    }
    
    public Double getCareer2Confidence() {
        return career2Confidence;
    }
    
    public void setCareer2Confidence(Double career2Confidence) {
        this.career2Confidence = career2Confidence;
    }
    
    public String getCareer3() {
        return career3;
    }
    
    public void setCareer3(String career3) {
        this.career3 = career3;
    }
    
    public Double getCareer3Confidence() {
        return career3Confidence;
    }
    
    public void setCareer3Confidence(Double career3Confidence) {
        this.career3Confidence = career3Confidence;
    }
    
    public String getRoadmap() {
        return roadmap;
    }
    
    public void setRoadmap(String roadmap) {
        this.roadmap = roadmap;
    }
}
