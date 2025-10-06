package com.careerpredictor.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "career_predictions")
public class CareerPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String career1;
    private Double career1Confidence;

    private String career2;
    private Double career2Confidence;

    private String career3;
    private Double career3Confidence;

    @Column(columnDefinition = "TEXT")
    private String roadmap;

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }
}
