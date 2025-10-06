package com.careerpredictor.dto;

import java.util.Arrays;
import java.util.List;

public class CareerAnalysisResult {
    private int techScore;
    private int creativeScore;
    private int analyticalScore;
    private int peopleScore;
    private int businessScore;
    
    private String primaryOrientation;
    private String secondaryOrientation;
    
    // Default constructor
    public CareerAnalysisResult() {}
    
    // Getters and Setters
    public int getTechScore() {
        return techScore;
    }
    
    public void setTechScore(int techScore) {
        this.techScore = techScore;
    }
    
    public int getCreativeScore() {
        return creativeScore;
    }
    
    public void setCreativeScore(int creativeScore) {
        this.creativeScore = creativeScore;
    }
    
    public int getAnalyticalScore() {
        return analyticalScore;
    }
    
    public void setAnalyticalScore(int analyticalScore) {
        this.analyticalScore = analyticalScore;
    }
    
    public int getPeopleScore() {
        return peopleScore;
    }
    
    public void setPeopleScore(int peopleScore) {
        this.peopleScore = peopleScore;
    }
    
    public int getBusinessScore() {
        return businessScore;
    }
    
    public void setBusinessScore(int businessScore) {
        this.businessScore = businessScore;
    }
    
    public String getPrimaryOrientation() {
        return primaryOrientation;
    }
    
    public void setPrimaryOrientation(String primaryOrientation) {
        this.primaryOrientation = primaryOrientation;
    }
    
    public String getSecondaryOrientation() {
        return secondaryOrientation;
    }
    
    public void setSecondaryOrientation(String secondaryOrientation) {
        this.secondaryOrientation = secondaryOrientation;
    }
    
    // ✅ Helper method to determine primary and secondary orientations
    public void determinePrimaryOrientation() {
        int maxScore = Math.max(techScore, Math.max(creativeScore, Math.max(analyticalScore, Math.max(peopleScore, businessScore))));
        
        // Determine primary orientation
        if (techScore == maxScore) {
            this.primaryOrientation = "TECHNICAL";
        } else if (analyticalScore == maxScore) {
            this.primaryOrientation = "ANALYTICAL";
        } else if (creativeScore == maxScore) {
            this.primaryOrientation = "CREATIVE";
        } else if (peopleScore == maxScore) {
            this.primaryOrientation = "PEOPLE";
        } else {
            this.primaryOrientation = "BUSINESS";
        }
        
        // Determine secondary orientation (second highest score)
        int secondMax = 0;
        String secondary = "";
        
        if (techScore != maxScore && techScore > secondMax) {
            secondMax = techScore;
            secondary = "TECHNICAL";
        }
        if (analyticalScore != maxScore && analyticalScore > secondMax) {
            secondMax = analyticalScore;
            secondary = "ANALYTICAL";
        }
        if (creativeScore != maxScore && creativeScore > secondMax) {
            secondMax = creativeScore;
            secondary = "CREATIVE";
        }
        if (peopleScore != maxScore && peopleScore > secondMax) {
            secondMax = peopleScore;
            secondary = "PEOPLE";
        }
        if (businessScore != maxScore && businessScore > secondMax) {
            secondMax = businessScore;
            secondary = "BUSINESS";
        }
        
        this.secondaryOrientation = secondary;
    }
    
    // ✅ Helper method to get average skill score
    public double getAverageSkillScore() {
        return (techScore + creativeScore + analyticalScore + peopleScore + businessScore) / 5.0;
    }
    
    // ✅ Helper method to get top skills
    public List<String> getTopSkills() {
        if ("TECHNICAL".equals(primaryOrientation)) {
            return Arrays.asList("Programming", "Problem Solving", "Logical Thinking");
        } else if ("ANALYTICAL".equals(primaryOrientation)) {
            return Arrays.asList("Data Analysis", "Critical Thinking", "Research");
        } else if ("CREATIVE".equals(primaryOrientation)) {
            return Arrays.asList("Design", "Innovation", "Visual Communication");
        } else if ("PEOPLE".equals(primaryOrientation)) {
            return Arrays.asList("Communication", "Leadership", "Teamwork");
        } else {
            return Arrays.asList("Strategic Thinking", "Project Management", "Business Acumen");
        }
    }
    
    // ✅ Helper method to get primary interests
    public List<String> getPrimaryInterests() {
        if ("TECHNICAL".equals(primaryOrientation)) {
            return Arrays.asList("Technology", "Software Development", "Innovation");
        } else if ("ANALYTICAL".equals(primaryOrientation)) {
            return Arrays.asList("Data", "Research", "Problem Solving");
        } else if ("CREATIVE".equals(primaryOrientation)) {
            return Arrays.asList("Design", "Arts", "Creative Expression");
        } else if ("PEOPLE".equals(primaryOrientation)) {
            return Arrays.asList("Human Relations", "Communication", "Community");
        } else {
            return Arrays.asList("Business", "Strategy", "Management");
        }
    }
}