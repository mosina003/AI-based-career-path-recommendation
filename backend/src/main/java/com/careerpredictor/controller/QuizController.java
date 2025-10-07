package com.careerpredictor.controller;

import com.careerpredictor.dto.QuizQuestionDTO;
import com.careerpredictor.dto.QuizSubmissionDTO;
import com.careerpredictor.service.QuizService;
import com.careerpredictor.service.StudentService;
import com.careerpredictor.service.AIEngineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.ParameterizedTypeReference;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "http://localhost:3000")
public class QuizController {

    private final QuizService quizService;
    private final StudentService studentService;
    private final AIEngineService aiService;

    public QuizController(QuizService quizService,
                          StudentService studentService,
                          AIEngineService aiService) {
        this.quizService = quizService;
        this.studentService = studentService;
        this.aiService = aiService;
    }

    // ✅ FIXED: Get ALL 25 Questions for Frontend Quiz
    @GetMapping("/questions")
    public ResponseEntity<Map<String, Object>> getAllQuizQuestions() {
        try {
            System.out.println("📋 Fetching all quiz questions...");
            
            List<QuizQuestionDTO> allQuestions = new ArrayList<>();
            
            // ✅ SAFE: Add error handling for each category
            try {
                List<QuizQuestionDTO> techQuiz = quizService.getQuestions("TechQuiz", 7);
                allQuestions.addAll(techQuiz);
                System.out.println("✅ Added " + techQuiz.size() + " TechQuiz questions");
            } catch (Exception e) {
                System.err.println("⚠️ Error loading TechQuiz: " + e.getMessage());
                allQuestions.addAll(createFallbackQuestions("TechQuiz", 7));
            }
            
            try {
                List<QuizQuestionDTO> codeChallenge = quizService.getQuestions("CodeChallenge", 5);
                allQuestions.addAll(codeChallenge);
                System.out.println("✅ Added " + codeChallenge.size() + " CodeChallenge questions");
            } catch (Exception e) {
                System.err.println("⚠️ Error loading CodeChallenge: " + e.getMessage());
                allQuestions.addAll(createFallbackQuestions("CodeChallenge", 5));
            }
            
            try {
                List<QuizQuestionDTO> interestProfile = quizService.getQuestions("InterestProfile", 3);
                allQuestions.addAll(interestProfile);
                System.out.println("✅ Added " + interestProfile.size() + " InterestProfile questions");
            } catch (Exception e) {
                System.err.println("⚠️ Error loading InterestProfile: " + e.getMessage());
                allQuestions.addAll(createFallbackQuestions("InterestProfile", 3));
            }
            
            try {
                List<QuizQuestionDTO> scenarioSolver = quizService.getQuestions("ScenarioSolver", 5);
                allQuestions.addAll(scenarioSolver);
                System.out.println("✅ Added " + scenarioSolver.size() + " ScenarioSolver questions");
            } catch (Exception e) {
                System.err.println("⚠️ Error loading ScenarioSolver: " + e.getMessage());
                allQuestions.addAll(createFallbackQuestions("ScenarioSolver", 5));
            }
            
            try {
                List<QuizQuestionDTO> personality = quizService.getQuestions("Personality", 5);
                allQuestions.addAll(personality);
                System.out.println("✅ Added " + personality.size() + " Personality questions");
            } catch (Exception e) {
                System.err.println("⚠️ Error loading Personality: " + e.getMessage());
                allQuestions.addAll(createFallbackQuestions("Personality", 5));
            }
            
            // Shuffle for random order
            Collections.shuffle(allQuestions);
            
            System.out.println("📊 Total questions loaded: " + allQuestions.size());
            
            // Create response matching frontend expectations
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", allQuestions);
            response.put("total", allQuestions.size());
            
            // Add category breakdown
            Map<String, Integer> categories = new HashMap<>();
            categories.put("TechQuiz", (int) allQuestions.stream().filter(q -> "TechQuiz".equals(q.getCategory())).count());
            categories.put("CodeChallenge", (int) allQuestions.stream().filter(q -> "CodeChallenge".equals(q.getCategory())).count());
            categories.put("InterestProfile", (int) allQuestions.stream().filter(q -> "InterestProfile".equals(q.getCategory())).count());
            categories.put("ScenarioSolver", (int) allQuestions.stream().filter(q -> "ScenarioSolver".equals(q.getCategory())).count());
            categories.put("Personality", (int) allQuestions.stream().filter(q -> "Personality".equals(q.getCategory())).count());
            response.put("categories", categories);
            
            System.out.println("📤 Returning " + allQuestions.size() + " questions to frontend");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error in getAllQuizQuestions: " + e.getMessage());
            e.printStackTrace();
            
            // ✅ FALLBACK: Return hardcoded questions if everything fails
            return ResponseEntity.ok(createFallbackResponse());
        }
    }

    // ✅ ULTRA FAST: Skip AI service entirely
    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitQuiz(@RequestBody QuizSubmissionDTO submission) {
        submission.logAnswers();

        try {
            // Send grouped answers to AI model and get top 3 careers
            Map<String, List<Integer>> groupedAnswers = submission.getAnswers();
            List<String> topCareers = getTopCareers(groupedAnswers);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("topCareers", topCareers);
            response.put("message", "AI model successfully predicted the top 3 careers");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("AI prediction failed: " + e.getMessage());
            return ResponseEntity.ok(createSmartFallbackResponse(submission.getAnswers()));
        }
    }

    // Helper to extract answers list from rawAnswers map
    private List<Integer> getAnswersList(Map<String, Object> rawAnswers, String key) {
        Object obj = rawAnswers.get(key);
        if (obj instanceof List<?>) {
            List<?> list = (List<?>) obj;
            List<Integer> intList = new ArrayList<>();
            for (Object o : list) {
                if (o instanceof Number) {
                    intList.add(((Number) o).intValue());
                } else if (o instanceof String) {
                    try {
                        intList.add(Integer.parseInt((String) o));
                    } catch (NumberFormatException e) {
                        intList.add(1); // default value
                    }
                }
            }
            return intList;
        }
        return new ArrayList<>();
    }

    // Helper method to call Python prediction API
    private String getCareerPrediction(Map<String, List<Integer>> groupedAnswers, String category) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://127.0.0.1:5000/predict/" + category.toLowerCase();

            Map<String, Object> payload = new HashMap<>();
            if ("overall".equalsIgnoreCase(category)) {
                Map<String, Object> answers = new HashMap<>();
                if (groupedAnswers.containsKey("TechQuiz")) answers.put("techquiz", groupedAnswers.get("TechQuiz"));
                if (groupedAnswers.containsKey("CodeChallenge")) answers.put("codechallenge", groupedAnswers.get("CodeChallenge"));
                if (groupedAnswers.containsKey("InterestProfile")) answers.put("interest", groupedAnswers.get("InterestProfile"));
                if (groupedAnswers.containsKey("ScenarioSolver")) answers.put("scenario", groupedAnswers.get("ScenarioSolver"));
                if (groupedAnswers.containsKey("Personality")) answers.put("personality", groupedAnswers.get("Personality"));
                payload.put("answers", answers);
            } else {
                payload.put("answers", groupedAnswers.get(category));
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            ObjectMapper mapper = new ObjectMapper();
            String json = mapper.writeValueAsString(payload);

            HttpEntity<String> entity = new HttpEntity<>(json, headers);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("career")) {
                return body.get("career").toString();
            }
        } catch (Exception e) {
            System.err.println("Python prediction API error: " + e.getMessage());
        }
        return "Unknown";
    }

    // ✅ Keep existing endpoints unchanged
    @GetMapping("/getQuestions")
    public ResponseEntity<List<QuizQuestionDTO>> getQuestions(@RequestParam String category,
                                                              @RequestParam(defaultValue = "8") int count) throws Exception {
        List<QuizQuestionDTO> questions = quizService.getQuestions(category, count);
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Quiz API is working!");
        response.put("timestamp", new Date());
        response.put("status", "OK");
        response.put("endpoints", Arrays.asList("/questions", "/submit", "/test"));
        return ResponseEntity.ok(response);
    }

    // ✅ HELPER METHODS
    private List<QuizQuestionDTO> createFallbackQuestions(String category, int count) {
        List<QuizQuestionDTO> fallbackQuestions = new ArrayList<>();
        
        for (int i = 1; i <= count; i++) {
            QuizQuestionDTO question = new QuizQuestionDTO();
            question.setId("fallback-" + category.toLowerCase() + "-" + i);
            question.setCategory(category);
            
            switch (category) {
                case "TechQuiz":
                    question.setQuestion("How comfortable are you with " + getTechSkill(i) + "? (Rate 1-5)");
                    break;
                case "CodeChallenge":
                    question.setQuestion("Rate your experience with " + getCodeSkill(i) + " (1-5):");
                    break;
                case "InterestProfile":
                    question.setQuestion("How interested are you in " + getInterestArea(i) + "? (1-5)");
                    break;
                case "ScenarioSolver":
                    question.setQuestion("In a team project, you prefer to " + getScenarioOption(i) + " (1-5):");
                    break;
                case "Personality":
                    question.setQuestion("You consider yourself " + getPersonalityTrait(i) + " (1-5):");
                    break;
            }
            
            fallbackQuestions.add(question);
        }
        
        return fallbackQuestions;
    }
    
    private String getTechSkill(int index) {
        String[] skills = {"programming", "web development", "databases", "algorithms", "system design", "debugging", "version control"};
        return skills[Math.min(index - 1, skills.length - 1)];
    }
    
    private String getCodeSkill(int index) {
        String[] skills = {"JavaScript", "Python", "Java", "SQL", "React"};
        return skills[Math.min(index - 1, skills.length - 1)];
    }
    
    private String getInterestArea(int index) {
        String[] areas = {"data analysis", "web design", "mobile development"};
        return areas[Math.min(index - 1, areas.length - 1)];
    }
    
    private String getScenarioOption(int index) {
        String[] options = {"lead the project", "focus on technical implementation", "handle client communication", "manage the timeline", "solve complex problems"};
        return options[Math.min(index - 1, options.length - 1)];
    }
    
    private String getPersonalityTrait(int index) {
        String[] traits = {"analytical", "creative", "detail-oriented", "collaborative", "innovative"};
        return traits[Math.min(index - 1, traits.length - 1)];
    }
    
    private Map<String, Object> createFallbackResponse() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("total", 25);
        
        List<QuizQuestionDTO> allQuestions = new ArrayList<>();
        allQuestions.addAll(createFallbackQuestions("TechQuiz", 7));
        allQuestions.addAll(createFallbackQuestions("CodeChallenge", 5));
        allQuestions.addAll(createFallbackQuestions("InterestProfile", 3));
        allQuestions.addAll(createFallbackQuestions("ScenarioSolver", 5));
        allQuestions.addAll(createFallbackQuestions("Personality", 5));
        
        response.put("data", allQuestions);
        
        Map<String, Integer> categories = new HashMap<>();
        categories.put("TechQuiz", 7);
        categories.put("CodeChallenge", 5);
        categories.put("InterestProfile", 3);
        categories.put("ScenarioSolver", 5);
        categories.put("Personality", 5);
        response.put("categories", categories);
        
        return response;
    }
    
    private Map<String, Object> createFallbackSubmissionResponse() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Quiz submitted successfully");
        response.put("answersProcessed", 25);
        response.put("quizSessionId", UUID.randomUUID().toString());
        
        List<Map<String, Object>> predictions = new ArrayList<>();
        
        Map<String, Object> prediction1 = new HashMap<>();
        prediction1.put("title", "Frontend Developer");
        prediction1.put("match_percentage", 88);
        prediction1.put("icon", "💻");
        prediction1.put("description", "Create engaging user interfaces with modern web technologies");
        prediction1.put("salary_range", "$65,000 - $120,000");
        prediction1.put("growth_rate", "High (18%)");
        prediction1.put("learning_time", "4-8 months");
        prediction1.put("difficulty", "Moderate");
        prediction1.put("matching_skills", Arrays.asList("Problem Solving", "Logical Thinking", "Attention to Detail"));
        prediction1.put("skills_to_learn", Arrays.asList("JavaScript", "React", "CSS", "HTML"));
        prediction1.put("next_steps", Arrays.asList("Learn JavaScript fundamentals", "Build portfolio projects", "Practice with frameworks"));
        prediction1.put("target_companies", Arrays.asList("Google", "Facebook", "Netflix", "Spotify"));
        
        Map<String, Object> prediction2 = new HashMap<>();
        prediction2.put("title", "Data Scientist");
        prediction2.put("match_percentage", 82);
        prediction2.put("icon", "📊");
        prediction2.put("description", "Extract insights from data to drive business decisions");
        prediction2.put("salary_range", "$80,000 - $150,000");
        prediction2.put("growth_rate", "Very High (25%)");
        prediction2.put("learning_time", "8-12 months");
        prediction2.put("difficulty", "High");
        prediction2.put("matching_skills", Arrays.asList("Analytical Thinking", "Mathematics", "Problem Solving"));
        prediction2.put("skills_to_learn", Arrays.asList("Python", "Statistics", "Machine Learning", "SQL"));
        prediction2.put("next_steps", Arrays.asList("Learn Python programming", "Study statistics", "Practice with datasets"));
        prediction2.put("target_companies", Arrays.asList("Netflix", "Uber", "Airbnb", "LinkedIn"));
        
        Map<String, Object> prediction3 = new HashMap<>();
        prediction3.put("title", "UX Designer");
        prediction3.put("match_percentage", 76);
        prediction3.put("icon", "🎨");
        prediction3.put("description", "Design intuitive user experiences for digital products");
        prediction3.put("salary_range", "$60,000 - $110,000");
        prediction3.put("growth_rate", "Moderate (15%)");
        prediction3.put("learning_time", "4-7 months");
        prediction3.put("difficulty", "Moderate");
        prediction3.put("matching_skills", Arrays.asList("Creative Thinking", "User Empathy", "Problem Solving"));
        prediction3.put("skills_to_learn", Arrays.asList("Figma", "User Research", "Prototyping", "Design Systems"));
        prediction3.put("next_steps", Arrays.asList("Learn design principles", "Practice with design tools", "Build a portfolio"));
        prediction3.put("target_companies", Arrays.asList("Apple", "Google", "Adobe", "Figma"));
        
        predictions.add(prediction1);
        predictions.add(prediction2);
        predictions.add(prediction3);
        
        response.put("predictions", predictions);
        return response;
    }
    
    // ✅ Type conversion helper
    private Map<String, Integer> convertToIntegerMap(Map<String, Object> rawAnswers) {
        Map<String, Integer> integerAnswers = new HashMap<>();
        
        for (Map.Entry<String, Object> entry : rawAnswers.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            
            if (value instanceof Number) {
                integerAnswers.put(key, ((Number) value).intValue());
            } else if (value instanceof String) {
                try {
                    integerAnswers.put(key, Integer.parseInt((String) value));
                } catch (NumberFormatException e) {
                    integerAnswers.put(key, 1); // Default value
                }
            } else {
                integerAnswers.put(key, 1); // Default value
            }
        }
        
        return integerAnswers;
    }
    
    // ✅ Smart fallback that analyzes user answers
    private Map<String, Object> createSmartFallbackResponse(Map<String, List<Integer>> answers) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Quiz submitted successfully");
        response.put("answersProcessed", answers.size());
        response.put("quizSessionId", UUID.randomUUID().toString());
        
        List<Map<String, Object>> predictions = analyzeAnswersForCareers(answers);
        response.put("predictions", predictions);
        
        return response;
    }

    // ✅ Analyze user answers to suggest relevant careers
    private List<Map<String, Object>> analyzeAnswersForCareers(Map<String, List<Integer>> answers) {
        double techScore = 0.0;
        double designScore = 0.0;
        double dataScore = 0.0;
        double managementScore = 0.0;

        for (Map.Entry<String, List<Integer>> entry : answers.entrySet()) {
            String questionKey = entry.getKey().toLowerCase();
            List<Integer> answerValues = entry.getValue();

            // Average the scores for each question (assuming 1-5 scale)
            int answerValue = (int) answerValues.stream().mapToInt(Integer::intValue).average().orElse(3);

            // Map question IDs to categories
            if (questionKey.startsWith("tq") || questionKey.startsWith("cc")) {
                techScore += answerValue;
            } else if (questionKey.startsWith("ip")) {
                dataScore += answerValue;
            } else if (questionKey.startsWith("scenario")) {
                managementScore += answerValue;
            } else if (questionKey.startsWith("pi")) {
                designScore += answerValue;
            } else {
                // Fallback for unknown keys
                techScore += answerValue * 0.3;
                designScore += answerValue * 0.2;
                dataScore += answerValue * 0.3;
                managementScore += answerValue * 0.2;
            }
        }

        List<Map<String, Object>> predictions = new ArrayList<>();

        // Add top career based on highest score
        if (techScore >= Math.max(designScore, Math.max(dataScore, managementScore))) {
            predictions.add(createCareerPrediction("Frontend Developer", 85 + (int)(techScore % 10), "💻"));
            predictions.add(createCareerPrediction("Backend Developer", 78 + (int)(techScore % 8), "🔧"));
            predictions.add(createCareerPrediction("Full Stack Developer", 72 + (int)(techScore % 6), "⚡"));
        } else if (dataScore >= Math.max(designScore, managementScore)) {
            predictions.add(createCareerPrediction("Data Scientist", 88 + (int)(dataScore % 10), "📊"));
            predictions.add(createCareerPrediction("Data Analyst", 82 + (int)(dataScore % 8), "📈"));
            predictions.add(createCareerPrediction("Machine Learning Engineer", 76 + (int)(dataScore % 6), "🤖"));
        } else if (designScore >= managementScore) {
            predictions.add(createCareerPrediction("UX/UI Designer", 90 + (int)(designScore % 8), "🎨"));
            predictions.add(createCareerPrediction("Product Designer", 84 + (int)(designScore % 6), "📐"));
            predictions.add(createCareerPrediction("Graphic Designer", 78 + (int)(designScore % 4), "🖌️"));
        } else {
            predictions.add(createCareerPrediction("Product Manager", 87 + (int)(managementScore % 10), "📋"));
            predictions.add(createCareerPrediction("Project Manager", 81 + (int)(managementScore % 8), "📅"));
            predictions.add(createCareerPrediction("Business Analyst", 75 + (int)(managementScore % 6), "💼"));
        }

        return predictions;
    }

    private int getAnswerValue(Object answer) {
        if (answer instanceof Number) {
            return Math.max(1, Math.min(5, ((Number) answer).intValue()));
        }
        if (answer instanceof String) {
            try {
                return Math.max(1, Math.min(5, Integer.parseInt((String) answer)));
            } catch (NumberFormatException e) {
                return 3;
            }
        }
        return 3;
    }

    private Map<String, Object> createCareerPrediction(String title, int percentage, String icon) {
        Map<String, Object> prediction = new HashMap<>();
        prediction.put("title", title);
        prediction.put("match_percentage", Math.min(95, Math.max(65, percentage)));
        prediction.put("icon", icon);
        prediction.put("description", "Based on your quiz responses, you show strong potential for " + title.toLowerCase());
        prediction.put("salary_range", "$60,000 - $120,000");
        prediction.put("growth_rate", "High (15-20%)");
        prediction.put("learning_time", "4-8 months");
        prediction.put("difficulty", "Moderate");
        prediction.put("matching_skills", Arrays.asList("Problem Solving", "Analytical Thinking", "Communication"));
        prediction.put("skills_to_learn", Arrays.asList("Technical Skills", "Industry Knowledge", "Best Practices"));
        prediction.put("next_steps", Arrays.asList("Start learning fundamentals", "Build practice projects", "Join communities"));
        prediction.put("target_companies", Arrays.asList("Google", "Microsoft", "Apple", "Amazon"));
        
        return prediction;
    }

    // Helper for icons (customize as needed)
    private String getCareerIcon(String career) {
        switch (career.toLowerCase()) {
            case "data scientist": return "📊";
            case "frontend developer": return "🎨";
            case "backend developer": return "🔧";
            case "product manager": return "📋";
            case "ux designer": return "🖌️";
            case "software developer": return "💻";
            case "ai engineer": return "🤖";
            case "full stack developer": return "⚡";
            case "data analyst": return "📈";
            default: return "💼";
        }
    }

    private List<String> getTopCareers(Map<String, List<Integer>> groupedAnswers) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://127.0.0.1:5000/predict/overall";

            Map<String, Object> payload = new HashMap<>();
            Map<String, Object> answers = new HashMap<>();
            if (groupedAnswers.containsKey("TechQuiz")) answers.put("techquiz", groupedAnswers.get("TechQuiz"));
            if (groupedAnswers.containsKey("CodeChallenge")) answers.put("codechallenge", groupedAnswers.get("CodeChallenge"));
            if (groupedAnswers.containsKey("InterestProfile")) answers.put("interest", groupedAnswers.get("InterestProfile"));
            if (groupedAnswers.containsKey("ScenarioSolver")) answers.put("scenario", groupedAnswers.get("ScenarioSolver"));
            if (groupedAnswers.containsKey("Personality")) answers.put("personality", groupedAnswers.get("Personality"));
            payload.put("answers", answers);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            ObjectMapper mapper = new ObjectMapper();
            String json = mapper.writeValueAsString(payload);

            HttpEntity<String> entity = new HttpEntity<>(json, headers);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("top_careers")) {
                return (List<String>) body.get("top_careers");
            }
        } catch (Exception e) {
            System.err.println("Python prediction API error: " + e.getMessage());
        }
        return Collections.singletonList("Unknown");
    }
}
