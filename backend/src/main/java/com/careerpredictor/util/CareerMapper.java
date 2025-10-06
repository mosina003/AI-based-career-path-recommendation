package com.careerpredictor.util;

import java.util.Map;

public class CareerMapper {

    /**
     * Map quiz scores to career recommendation.
     * @param scores Map<Category, Score>
     * @return Recommended career
     */
    public static String mapToCareer(Map<String, Double> scores) {
        if (scores == null || scores.isEmpty()) return "Generalist";

        // Check thresholds for each quiz category
        if (scores.getOrDefault("TechQuiz", 0.0) >= 80.0) {
            return "Software Developer";
        } else if (scores.getOrDefault("CodeChallenge", 0.0) >= 70.0) {
            return "AI Engineer";
        } else if (scores.getOrDefault("ScenarioSolver", 0.0) >= 60.0) {
            return "Business Analyst";
        }

        return "Generalist";
    }
}
