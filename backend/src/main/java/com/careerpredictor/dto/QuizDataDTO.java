 package com.careerpredictor.dto;

import java.util.List;

public class QuizDataDTO {
    private String category;
    private List<QuizQuestionDTO> questions;

    // Getters & Setters
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public List<QuizQuestionDTO> getQuestions() { return questions; }
    public void setQuestions(List<QuizQuestionDTO> questions) { this.questions = questions; }
}