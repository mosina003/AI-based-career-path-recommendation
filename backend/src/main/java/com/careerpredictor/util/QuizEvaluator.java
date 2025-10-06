package com.careerpredictor.util;

import java.util.Map;

public class QuizEvaluator {

    /**
     * Evaluate the quiz score based on student's answers and correct answers.
     * @param studentAnswers Map<QuestionId, Answer>
     * @param correctAnswers Map<QuestionId, CorrectAnswer>
     * @return total score as integer
     */
    public static int evaluate(Map<String, String> studentAnswers, Map<String, String> correctAnswers) {
        int score = 0;
        if (studentAnswers == null || correctAnswers == null) return 0;

        for (Map.Entry<String, String> entry : studentAnswers.entrySet()) {
            String questionId = entry.getKey();
            String answer = entry.getValue();
            if (correctAnswers.containsKey(questionId) && answer != null
                    && answer.equals(correctAnswers.get(questionId))) {
                score++;
            }
        }
        return score;
    }

    /**
     * Evaluate percentage score (0-100) based on total questions.
     */
    public static double evaluatePercentage(Map<String, String> studentAnswers, Map<String, String> correctAnswers) {
        int totalCorrect = evaluate(studentAnswers, correctAnswers);
        int totalQuestions = correctAnswers != null ? correctAnswers.size() : 1;
        return ((double) totalCorrect / totalQuestions) * 100;
    }
}
