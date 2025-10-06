package com.careerpredictor.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public class QuizOptionDTO {
    private String text;
    
    @JsonProperty("career_weights")
    private Map<String, Integer> careerWeights;

    // Getters & Setters
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    
    public Map<String, Integer> getCareerWeights() { return careerWeights; }
    public void setCareerWeights(Map<String, Integer> careerWeights) { this.careerWeights = careerWeights; }
}