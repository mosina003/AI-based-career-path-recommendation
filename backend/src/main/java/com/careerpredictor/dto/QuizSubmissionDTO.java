package com.careerpredictor.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizSubmissionDTO {
    
    @JsonProperty("answers")
    private Map<String, Integer> answers; // ✅ String keys for question IDs

    @JsonProperty("legacyAnswers")
    private Map<Integer, String> legacyAnswers;

    @JsonProperty("timeSpent")
    private Integer timeSpent;

    @JsonProperty("userId")
    private Long userId;

    @JsonProperty("studentId") // ✅ ADD for compatibility with existing methods
    private Long studentId;

    @JsonProperty("category") // ✅ ADD for compatibility with existing methods
    private String category;

    // ✅ UTILITY METHODS
    public boolean hasValidAnswers() {
        return (answers != null && !answers.isEmpty()) ||
               (legacyAnswers != null && !legacyAnswers.isEmpty());
    }

    public int getAnswerCount() {
        if (answers != null) return answers.size();
        if (legacyAnswers != null) return legacyAnswers.size();
        return 0;
    }

    public void logAnswers() {
        if (answers != null) {
            System.out.println("Quiz submission received with " + answers.size() + " answers:");
            answers.forEach((questionId, answerIndex) -> {
                System.out.println("  Question: " + questionId + " -> Answer: " + answerIndex);
            });
        }
        if (legacyAnswers != null) {
            System.out.println("Legacy answers received with " + legacyAnswers.size() + " answers:");
            legacyAnswers.forEach((questionIndex, answerText) -> {
                System.out.println("  Question: " + questionIndex + " -> Answer: " + answerText);
            });
        }
    }

    // ✅ COMPATIBILITY METHODS
    public Map<Integer, String> getLegacyAnswers() {
        return legacyAnswers;
    }

    public void setLegacyAnswers(Map<Integer, String> legacyAnswers) {
        this.legacyAnswers = legacyAnswers;
    }
}
