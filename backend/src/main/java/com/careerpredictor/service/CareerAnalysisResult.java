package com.careerpredictor.service;

public class CareerAnalysisResult {
    private int techScore;
    private int creativeScore;
    private int analyticalScore;
    private int peopleScore;
    private int businessScore;
    private String primaryOrientation;
    private String secondaryOrientation;
    
    public void determinePrimaryOrientation() {
        int maxScore = Math.max(techScore, Math.max(creativeScore, 
                      Math.max(analyticalScore, Math.max(peopleScore, businessScore))));
        
        if (maxScore == techScore) {
            primaryOrientation = "TECHNICAL";
        } else if (maxScore == analyticalScore) {
            primaryOrientation = "ANALYTICAL";
        } else if (maxScore == creativeScore) {
            primaryOrientation = "CREATIVE";
        } else if (maxScore == peopleScore) {
            primaryOrientation = "PEOPLE";
        } else {
            primaryOrientation = "BUSINESS";
        }
        
        // Determine secondary orientation
        int[] scores = {techScore, creativeScore, analyticalScore, peopleScore, businessScore};
        String[] orientations = {"TECHNICAL", "CREATIVE", "ANALYTICAL", "PEOPLE", "BUSINESS"};
        
        int secondMaxScore = 0;
        int secondMaxIndex = 0;
        for (int i = 0; i < scores.length; i++) {
            if (scores[i] < maxScore && scores[i] > secondMaxScore) {
                secondMaxScore = scores[i];
                secondMaxIndex = i;
            }
        }
        secondaryOrientation = orientations[secondMaxIndex];
    }
    
    // Getters and setters
    public int getTechScore() { return techScore; }
    public void setTechScore(int techScore) { this.techScore = techScore; }
    
    public int getCreativeScore() { return creativeScore; }
    public void setCreativeScore(int creativeScore) { this.creativeScore = creativeScore; }
    
    public int getAnalyticalScore() { return analyticalScore; }
    public void setAnalyticalScore(int analyticalScore) { this.analyticalScore = analyticalScore; }
    
    public int getPeopleScore() { return peopleScore; }
    public void setPeopleScore(int peopleScore) { this.peopleScore = peopleScore; }
    
    public int getBusinessScore() { return businessScore; }
    public void setBusinessScore(int businessScore) { this.businessScore = businessScore; }
    
    public String getPrimaryOrientation() { return primaryOrientation; }
    public void setPrimaryOrientation(String primaryOrientation) { this.primaryOrientation = primaryOrientation; }
    
    public String getSecondaryOrientation() { return secondaryOrientation; }
    public void setSecondaryOrientation(String secondaryOrientation) { this.secondaryOrientation = secondaryOrientation; }
}
