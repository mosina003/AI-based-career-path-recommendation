package com.careerpredictor.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_answers")
public class QuizAnswer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "question_id", length = 50)
    private String questionId;
    
    @Column(name = "answer_index")
    private Integer answerIndex;
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "quiz_session_id")
    private String quizSessionId;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    public QuizAnswer() {
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getQuestionId() { return questionId; }
    public void setQuestionId(String questionId) { this.questionId = questionId; }
    
    public Integer getAnswerIndex() { return answerIndex; }
    public void setAnswerIndex(Integer answerIndex) { this.answerIndex = answerIndex; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getQuizSessionId() { return quizSessionId; }
    public void setQuizSessionId(String quizSessionId) { this.quizSessionId = quizSessionId; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}