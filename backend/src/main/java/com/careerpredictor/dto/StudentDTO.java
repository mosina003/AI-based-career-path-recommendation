package com.careerpredictor.dto;

import lombok.Data;

import java.util.Map;

@Data
public class StudentDTO {

    private String name;
    private String email;
    private String password; // Plain text password (will be hashed)
    private Integer age;
    private String skills;
    private String grades;
    private String interests;

    // Map for personality traits and scores (e.g., {"Logic": 0.9})
    private Map<String, Double> personalityScores;
}
