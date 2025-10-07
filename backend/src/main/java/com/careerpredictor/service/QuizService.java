package com.careerpredictor.service;
import com.careerpredictor.dto.QuizQuestionDTO;
import com.careerpredictor.dto.QuizDataDTO;
import com.careerpredictor.dto.QuizSubmissionDTO;
import com.careerpredictor.entity.QuizScore;
import com.careerpredictor.entity.QuizAnswer;
import com.careerpredictor.repository.QuizScoreRepository;
import com.careerpredictor.repository.QuizAnswerRepository;
import com.careerpredictor.dto.CareerPredictionResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class QuizService {
    
    @Autowired
    private QuizScoreRepository quizScoreRepository;
    
    @Autowired
    private QuizAnswerRepository quizAnswerRepository;
    
    @Autowired
    private CareerPredictionService careerPredictionService;
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<QuizQuestionDTO> getQuestions(String category, int count) throws Exception {
        String path = "/data/" + category + ".json";
        InputStream is = getClass().getResourceAsStream(path);
        if (is == null) throw new RuntimeException("JSON file not found: " + path);

        QuizDataDTO quizData = objectMapper.readValue(is, QuizDataDTO.class);
        List<QuizQuestionDTO> allQuestions = quizData.getQuestions();
        
        Collections.shuffle(allQuestions);
        return allQuestions.subList(0, Math.min(count, allQuestions.size()));
    }

    public List<QuizScore> getAllScoresForStudent(Long studentId) {
        return quizScoreRepository.findByStudentId(studentId);
    }

    public Map<String, Double> evaluateQuiz(Long studentId, Map<Long, String> quizAnswers) {
        Map<String, Double> categoryScores = new HashMap<>();
        categoryScores.put("technical", 0.85);
        categoryScores.put("logical", 0.90);
        categoryScores.put("creative", 0.75);
        categoryScores.put("analytical", 0.80);
        return categoryScores;
    }
    
    public Map<String, Object> submitQuizAnswers(QuizSubmissionDTO submission) {
        try {
            System.out.println("Processing quiz submission...");
            submission.logAnswers();

            if (!submission.hasValidAnswers()) {
                throw new IllegalArgumentException("No valid answers provided");
            }

            String quizSessionId = UUID.randomUUID().toString();
            Long userId = submission.getUserId() != null ? submission.getUserId() : 1L;

            Map<String, List<Integer>> answers = submission.getAnswers();

            if (answers == null) {
                throw new IllegalArgumentException("No answers provided in correct format");
            }

            // Save answers to database
            for (Map.Entry<String, List<Integer>> entry : answers.entrySet()) {
                String category = entry.getKey();
                List<Integer> answerList = entry.getValue();

                if (answerList == null || answerList.isEmpty()) {
                    System.err.println("Warning: No answers for category " + category + ", skipping...");
                    continue;
                }

                for (int i = 0; i < answerList.size(); i++) {
                    Integer answerIndex = answerList.get(i);
                    if (answerIndex == null || answerIndex < 0) {
                        System.err.println("Warning: Invalid answer index for category " + category + ", skipping...");
                        continue;
                    }

                    QuizAnswer quizAnswer = new QuizAnswer();
                    quizAnswer.setQuestionId(category + "-" + i); // You may want to use actual question IDs if available
                    quizAnswer.setAnswerIndex(answerIndex);
                    quizAnswer.setUserId(userId);
                    quizAnswer.setQuizSessionId(quizSessionId);
                    quizAnswer.setCreatedAt(LocalDateTime.now());

                    quizAnswerRepository.save(quizAnswer);
                    System.out.println("✅ Saved answer for category: " + category + " [" + i + "] -> " + answerIndex);
                }
            }

            // Generate career predictions
            Map<String, Object> response = new HashMap<>();

            try {
                System.out.println("Generating career predictions...");
                CareerPredictionResult predictions = careerPredictionService.generatePredictions(answers, userId);

                if (predictions != null && predictions.getPredictions() != null && !predictions.getPredictions().isEmpty()) {
                    System.out.println("✅ Generated " + predictions.getPredictions().size() + " career predictions");

                    response.put("success", true);
                    response.put("message", "Quiz submitted successfully");
                    response.put("predictions", predictions.getPredictions());
                    response.put("quizSessionId", quizSessionId);
                    response.put("answersProcessed", submission.getAnswerCount());

                    System.out.println("✅ Returning response with " + predictions.getPredictions().size() + " predictions");
                    return response;

                } else {
                    System.err.println("❌ Career prediction service returned empty results, using fallback");
                    return createFallbackResponse(answers, quizSessionId);
                }

            } catch (Exception predictionError) {
                System.err.println("❌ Error generating predictions: " + predictionError.getMessage());
                predictionError.printStackTrace();
                return createFallbackResponse(answers, quizSessionId);
            }

        } catch (Exception e) {
            System.err.println("❌ Error processing quiz submission: " + e.getMessage());
            e.printStackTrace();

            // Return error response instead of throwing exception
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to process quiz submission: " + e.getMessage());
            errorResponse.put("error", true);
            return errorResponse;
        }
    }
    
    private Map<String, Object> createFallbackResponse(Map<String, List<Integer>> answers, String quizSessionId) {
        System.out.println("Creating fallback career predictions...");
        
        Map<String, Object> frontendDev = new HashMap<>();
        frontendDev.put("title", "Frontend Developer");
        frontendDev.put("icon", "💻");
        frontendDev.put("match_percentage", 85);
        frontendDev.put("description", "Build engaging user interfaces using modern web technologies");
        frontendDev.put("salary_range", "$60,000 - $120,000");
        frontendDev.put("growth_rate", "15% annually");
        frontendDev.put("learning_time", "6-12 months");
        frontendDev.put("difficulty", "Medium");
        frontendDev.put("matching_skills", Arrays.asList("HTML", "CSS", "JavaScript"));
        frontendDev.put("skills_to_learn", Arrays.asList("React", "Vue.js", "TypeScript"));
        frontendDev.put("next_steps", Arrays.asList("Complete a React course", "Build portfolio projects"));
        
        Map<String, Object> dataScientist = new HashMap<>();
        dataScientist.put("title", "Data Scientist");
        dataScientist.put("icon", "📊");
        dataScientist.put("match_percentage", 78);
        dataScientist.put("description", "Analyze complex data to drive business decisions");
        dataScientist.put("salary_range", "$80,000 - $150,000");
        dataScientist.put("growth_rate", "22% annually");
        dataScientist.put("learning_time", "12-18 months");
        dataScientist.put("difficulty", "Hard");
        dataScientist.put("matching_skills", Arrays.asList("Python", "Statistics"));
        dataScientist.put("skills_to_learn", Arrays.asList("Machine Learning", "TensorFlow", "SQL"));
        dataScientist.put("next_steps", Arrays.asList("Learn Python for data analysis", "Practice with datasets"));
        
        Map<String, Object> uxDesigner = new HashMap<>();
        uxDesigner.put("title", "UX/UI Designer");
        uxDesigner.put("icon", "🎨");
        uxDesigner.put("match_percentage", 72);
        uxDesigner.put("description", "Design intuitive and user-friendly digital experiences");
        uxDesigner.put("salary_range", "$55,000 - $110,000");
        uxDesigner.put("growth_rate", "13% annually");
        uxDesigner.put("learning_time", "8-14 months");
        uxDesigner.put("difficulty", "Medium");
        uxDesigner.put("matching_skills", Arrays.asList("Design Thinking", "Problem Solving"));
        uxDesigner.put("skills_to_learn", Arrays.asList("Figma", "Adobe XD", "User Research"));
        uxDesigner.put("next_steps", Arrays.asList("Learn design tools", "Build a design portfolio"));
        
        List<Map<String, Object>> fallbackPredictions = Arrays.asList(frontendDev, dataScientist, uxDesigner);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Quiz submitted successfully");
        response.put("predictions", fallbackPredictions);
        response.put("quizSessionId", quizSessionId);

        // Count total answers processed (sum of all answer lists)
        int totalAnswers = answers.values().stream().mapToInt(list -> list != null ? list.size() : 0).sum();
        response.put("answersProcessed", totalAnswers);
        response.put("fallback", true);

        System.out.println("✅ Returning fallback response with " + fallbackPredictions.size() + " predictions");
        return response;
    }
}
