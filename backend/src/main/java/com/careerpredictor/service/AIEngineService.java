package com.careerpredictor.service;

import com.careerpredictor.dto.PredictionResponseDTO;
import com.careerpredictor.entity.Student;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.langchain4j.model.ollama.OllamaLanguageModel;
import dev.langchain4j.model.output.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AIEngineService {

    // ✅ FIXED: Remove @Autowired - create manually
    private OllamaLanguageModel ollamaLanguageModel;

    @Autowired
    private ObjectMapper objectMapper;

    // ✅ MAIN METHOD: This is what your QuizController calls
    public PredictionResponseDTO predictCareer(Student student, Map<String, Double> allScores) {
        try {
            String prompt = buildCareerPredictionPrompt(student, allScores);
            
            // ✅ CORRECT LangChain4j syntax
            Response<String> response = ollamaLanguageModel.generate(prompt);
            String aiResponse = response.content();
            
            return parseCareerPrediction(aiResponse, student, allScores);
            
        } catch (Exception e) {
            System.err.println("❌ AI career prediction failed: " + e.getMessage());
            return generateFallbackPrediction(student, allScores);
        }
    }

    // ✅ ADD: Method without scores (for backward compatibility)
    public PredictionResponseDTO predictCareer(Student student) {
        Map<String, Double> emptyScores = new HashMap<>();
        return predictCareer(student, emptyScores);
    }

    // ✅ Build career prediction prompt - SIMPLIFIED
    private String buildCareerPredictionPrompt(Student student, Map<String, Double> allScores) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("You are an expert career counselor and AI career prediction system. ");
        prompt.append("Analyze the following student profile and quiz scores to predict the top 3 most suitable careers.\n\n");
        
        prompt.append("Student Profile:\n");
        prompt.append("- Name: ").append(student.getName()).append("\n");
        // ✅ REMOVED: Email check since it's causing errors
        
        prompt.append("\nQuiz Scores Analysis:\n");
        for (Map.Entry<String, Double> entry : allScores.entrySet()) {
            prompt.append("- ").append(entry.getKey()).append(": ").append(String.format("%.2f", entry.getValue())).append("/10\n");
        }
        
        prompt.append("\nProvide 3 career recommendations in this exact format:\n");
        prompt.append("## Career 1: [Career Title]\n");
        prompt.append("Match: [percentage]%\n");
        prompt.append("Description: [brief explanation]\n\n");
        prompt.append("## Career 2: [Career Title]\n");
        prompt.append("Match: [percentage]%\n");
        prompt.append("Description: [brief explanation]\n\n");
        prompt.append("## Career 3: [Career Title]\n");
        prompt.append("Match: [percentage]%\n");
        prompt.append("Description: [brief explanation]\n");
        
        return prompt.toString();
    }

    // ✅ Parse AI response into PredictionResponseDTO
    private PredictionResponseDTO parseCareerPrediction(String aiResponse, Student student, Map<String, Double> allScores) {
        try {
            PredictionResponseDTO response = new PredictionResponseDTO();
            response.setStudentId(student.getId());
            response.setStudentName(student.getName());
            response.setAnalysisType("quiz-based");
            response.setGeneratedBy("AI-Phi3");
            
            List<Map<String, Object>> predictions = parseAICareerRecommendations(aiResponse);
            
            if (predictions.isEmpty()) {
                predictions = generateAlgorithmicPredictions(allScores);
            }
            
            response.setPredictions(predictions);
            response.setSuccess(true);
            response.setMessage("Career prediction completed successfully");
            
            return response;
            
        } catch (Exception e) {
            System.err.println("❌ Error parsing AI career prediction: " + e.getMessage());
            return generateFallbackPrediction(student, allScores);
        }
    }

    // ✅ Parse AI career recommendations from response
    private List<Map<String, Object>> parseAICareerRecommendations(String aiResponse) {
        List<Map<String, Object>> predictions = new ArrayList<>();
        
        try {
            String[] careerSections = aiResponse.split("## Career \\d+:");
            
            for (int i = 1; i < careerSections.length && i <= 3; i++) {
                Map<String, Object> career = parseCareerSection(careerSections[i], i);
                if (!career.isEmpty()) {
                    predictions.add(career);
                }
            }
            
        } catch (Exception e) {
            System.err.println("❌ Error parsing AI career sections: " + e.getMessage());
        }
        
        return predictions;
    }

    // ✅ Parse individual career section
    private Map<String, Object> parseCareerSection(String section, int rank) {
        Map<String, Object> career = new HashMap<>();
        
        try {
            String[] lines = section.split("\n");
            String title = extractCareerTitle(lines);
            double matchPercentage = extractMatchPercentage(section);
            String description = extractCareerDescription(section);
            
            career.put("title", title);
            career.put("match_percentage", matchPercentage);
            career.put("description", description);
            career.put("rank", rank);
            career.put("icon", getCareerIcon(title));
            career.put("salary_range", getDefaultSalaryRange(title));
            career.put("growth_rate", getDefaultGrowthRate(title));
            career.put("difficulty", getDefaultDifficulty(title));
            career.put("learning_time", getDefaultLearningTime(title));
            
            // Generate roadmap for this career
            Map<String, Object> userProfile = createBasicUserProfile();
            Map<String, Object> roadmap = generateDetailedRoadmap(title, userProfile);
            career.put("roadmap", roadmap);
            
        } catch (Exception e) {
            System.err.println("❌ Error parsing career section " + rank + ": " + e.getMessage());
        }
        
        return career;
    }

    // ✅ Extract career title from lines
    private String extractCareerTitle(String[] lines) {
        for (String line : lines) {
            line = line.trim();
            if (!line.isEmpty() && !line.startsWith("Match:") && !line.startsWith("Description:")) {
                return line.replaceAll("^[\\d.\\-*]+\\s*", "").trim();
            }
        }
        return "Career Recommendation";
    }

    // ✅ Extract match percentage
    private double extractMatchPercentage(String section) {
        try {
            Pattern pattern = Pattern.compile("(\\d+)%", Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(section);
            if (matcher.find()) {
                return Double.parseDouble(matcher.group(1));
            }
        } catch (Exception e) {
            // Ignore parsing errors
        }
        return 75 + (Math.random() * 20); // Default 75-95%
    }

    // ✅ Extract career description
    private String extractCareerDescription(String section) {
        String[] lines = section.split("\n");
        for (String line : lines) {
            line = line.trim();
            if (line.toLowerCase().startsWith("description:")) {
                return line.replaceFirst("^[^:]+:\\s*", "").trim();
            }
        }
        return "AI-recommended career path based on your quiz responses";
    }

    // ✅ Generate algorithmic predictions
    private List<Map<String, Object>> generateAlgorithmicPredictions(Map<String, Double> allScores) {
        List<Map<String, Object>> predictions = new ArrayList<>();
        
        Map<String, Map<String, Double>> careerWeights = createCareerWeightMatrix();
        Map<String, Double> careerScores = new HashMap<>();
        
        for (Map.Entry<String, Map<String, Double>> career : careerWeights.entrySet()) {
            double score = 0.0;
            for (Map.Entry<String, Double> skill : career.getValue().entrySet()) {
                score += allScores.getOrDefault(skill.getKey(), 0.0) * skill.getValue();
            }
            careerScores.put(career.getKey(), score);
        }
        
        careerScores.entrySet().stream()
            .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
            .limit(3)
            .forEach(entry -> {
                Map<String, Object> career = createCareerPrediction(
                    entry.getKey(), 
                    entry.getValue(), 
                    predictions.size() + 1
                );
                predictions.add(career);
            });
        
        return predictions;
    }

    // ✅ Create career weight matrix
    private Map<String, Map<String, Double>> createCareerWeightMatrix() {
        Map<String, Map<String, Double>> careerWeights = new HashMap<>();
        
        // Data Scientist weights
        Map<String, Double> dataScientistWeights = new HashMap<>();
        dataScientistWeights.put("analytical_thinking", 0.9);
        dataScientistWeights.put("programming", 0.8);
        dataScientistWeights.put("mathematics", 0.9);
        dataScientistWeights.put("problem_solving", 0.8);
        careerWeights.put("Data Scientist", dataScientistWeights);
        
        // Software Developer weights
        Map<String, Double> developerWeights = new HashMap<>();
        developerWeights.put("programming", 0.9);
        developerWeights.put("logical_thinking", 0.8);
        developerWeights.put("problem_solving", 0.9);
        developerWeights.put("attention_to_detail", 0.7);
        careerWeights.put("Software Developer", developerWeights);
        
        // Frontend Developer weights
        Map<String, Double> frontendWeights = new HashMap<>();
        frontendWeights.put("programming", 0.8);
        frontendWeights.put("creativity", 0.8);
        frontendWeights.put("visual_design", 0.9);
        frontendWeights.put("user_experience", 0.8);
        careerWeights.put("Frontend Developer", frontendWeights);
        
        return careerWeights;
    }

    // ✅ Create career prediction object
    private Map<String, Object> createCareerPrediction(String title, double score, int rank) {
        Map<String, Object> career = new HashMap<>();
        
        double percentage = Math.min(95, (score / 40.0) * 100);
        
        career.put("title", title);
        career.put("match_percentage", Math.round(percentage));
        career.put("description", getCareerDescription(title));
        career.put("rank", rank);
        career.put("icon", getCareerIcon(title));
        career.put("salary_range", getDefaultSalaryRange(title));
        career.put("growth_rate", getDefaultGrowthRate(title));
        career.put("difficulty", getDefaultDifficulty(title));
        career.put("learning_time", getDefaultLearningTime(title));
        
        Map<String, Object> userProfile = createBasicUserProfile();
        Map<String, Object> roadmap = generateDetailedRoadmap(title, userProfile);
        career.put("roadmap", roadmap);
        
        return career;
    }

    // ✅ Generate fallback prediction
    private PredictionResponseDTO generateFallbackPrediction(Student student, Map<String, Double> allScores) {
        PredictionResponseDTO response = new PredictionResponseDTO();
        response.setStudentId(student.getId());
        response.setStudentName(student.getName());
        response.setAnalysisType("algorithmic-fallback");
        response.setGeneratedBy("Algorithm");
        
        List<Map<String, Object>> predictions = generateAlgorithmicPredictions(allScores);
        response.setPredictions(predictions);
        
        response.setSuccess(true);
        response.setMessage("Career prediction completed using algorithmic analysis");
        
        return response;
    }

    // ✅ SIMPLIFIED: Generate detailed roadmap with better AI integration
    public Map<String, Object> generateDetailedRoadmap(String careerTitle, Map<String, Object> userProfile) {
        try {
            // ✅ Check if AI is available
            if (ollamaLanguageModel == null) {
                System.out.println("⚠️ AI model not available, using structured roadmap");
                return generateStructuredRoadmap(careerTitle);
            }
            
            System.out.println("🤖 Generating AI roadmap for: " + careerTitle);
            
            // ✅ SIMPLIFIED: Use simple prompt like your example
            String prompt = "Give a 4 phased learning roadmap for " + careerTitle + "?";
            
            Response<String> response = ollamaLanguageModel.generate(prompt);
            String aiResponse = response.content();
            
            if (aiResponse != null && !aiResponse.trim().isEmpty()) {
                System.out.println("✅ AI roadmap generated successfully");
                return parseSimpleAIRoadmap(aiResponse, careerTitle);
            }
            
            System.out.println("🔄 AI response empty, using structured roadmap");
            return generateStructuredRoadmap(careerTitle);
            
        } catch (Exception e) {
            System.err.println("❌ AI roadmap generation failed: " + e.getMessage());
            System.out.println("🔄 Falling back to structured roadmap");
            return generateStructuredRoadmap(careerTitle);
        }
    }

    // ✅ NEW: Parse simple AI roadmap response
    private Map<String, Object> parseSimpleAIRoadmap(String aiResponse, String careerTitle) {
        Map<String, Object> roadmap = new HashMap<>();
        List<Map<String, Object>> phases = new ArrayList<>();
        
        try {
            // ✅ Parse the simple AI response format
            String[] responseLines = aiResponse.split("\n");
            int currentPhase = 0;
            String currentPhaseTitle = "";
            String currentPhaseDescription = "";
            
            for (String line : responseLines) {
                line = line.trim();
                
                // Check if line contains phase information
                if (line.matches("\\d+\\..*Phase.*:.*")) {
                    // Save previous phase if exists
                    if (currentPhase > 0) {
                        phases.add(createSimplePhase(currentPhase, currentPhaseTitle, currentPhaseDescription));
                    }
                    
                    // Extract new phase info
                    currentPhase++;
                    currentPhaseTitle = extractPhaseTitle(line);
                    currentPhaseDescription = extractPhaseDescription(line, responseLines);
                    
                    // If this is the 4th phase, add it and break
                    if (currentPhase == 4) {
                        phases.add(createSimplePhase(currentPhase, currentPhaseTitle, currentPhaseDescription));
                        break;
                    }
                }
            }
            
            // Add the last phase if not already added
            if (currentPhase > 0 && phases.size() < currentPhase) {
                phases.add(createSimplePhase(currentPhase, currentPhaseTitle, currentPhaseDescription));
            }
            
            // Ensure we have exactly 4 phases
            while (phases.size() < 4) {
                int phaseNum = phases.size() + 1;
                phases.add(createDefaultPhase(phaseNum, careerTitle));
            }
            
            roadmap.put("title", careerTitle + " Learning Roadmap");
            roadmap.put("totalPhases", 4);
            roadmap.put("estimatedTime", "12 months");
            roadmap.put("phases", phases);
            roadmap.put("generatedBy", "AI-Enhanced");
            
            System.out.println("✅ Successfully parsed AI roadmap with " + phases.size() + " phases");
            
        } catch (Exception e) {
            System.err.println("❌ Error parsing simple AI roadmap: " + e.getMessage());
            return generateStructuredRoadmap(careerTitle);
        }
        
        return roadmap;
    }

    // ✅ Extract phase title from AI response
    private String extractPhaseTitle(String line) {
        try {
            // Extract text between number and colon, or use default
            String title = line.replaceFirst("^\\d+\\.\\s*", "").split(":")[0].trim();
            if (title.isEmpty()) {
                return "Learning Phase";
            }
            return title;
        } catch (Exception e) {
            return "Learning Phase";
        }
    }

    // ✅ Extract phase description from AI response
    private String extractPhaseDescription(String currentLine, String[] allLines) {
        try {
            // Get description after the colon
            String description = "";
            if (currentLine.contains(":")) {
                description = currentLine.substring(currentLine.indexOf(":") + 1).trim();
            }
            
            // If description is empty or too short, create a default one
            if (description.length() < 20) {
                description = "Build foundational skills and knowledge for this career path.";
            }
            
            return description;
        } catch (Exception e) {
            return "Build foundational skills and knowledge for this career path.";
        }
    }

    // ✅ Create simple phase from AI response
    private Map<String, Object> createSimplePhase(int phaseNumber, String title, String description) {
        Map<String, Object> phase = new HashMap<>();
        
        phase.put("phaseNumber", phaseNumber);
        phase.put("title", title.isEmpty() ? getDefaultPhaseTitle(phaseNumber) : title);
        phase.put("duration", "3 months");
        phase.put("type", getPhaseType(phaseNumber));
        phase.put("description", description.isEmpty() ? getDefaultDescription(phaseNumber) : description);
        
        // Add career-specific skills based on phase
        phase.put("skills", getPhaseSpecificSkills(phaseNumber, title));
        phase.put("resources", getDefaultResources());
        phase.put("projects", getPhaseSpecificProjects(phaseNumber));
        phase.put("milestones", getPhaseSpecificMilestones(phaseNumber));
        
        return phase;
    }

    // ✅ Create default phase if AI parsing fails
    private Map<String, Object> createDefaultPhase(int phaseNumber, String careerTitle) {
        Map<String, Object> phase = new HashMap<>();
        
        phase.put("phaseNumber", phaseNumber);
        phase.put("title", getDefaultPhaseTitle(phaseNumber));
        phase.put("duration", "3 months");
        phase.put("type", getPhaseType(phaseNumber));
        phase.put("description", getDefaultDescription(phaseNumber));
        phase.put("skills", getCareerSpecificSkills(careerTitle, phaseNumber));
        phase.put("resources", getDefaultResources());
        phase.put("projects", getPhaseSpecificProjects(phaseNumber));
        phase.put("milestones", getPhaseSpecificMilestones(phaseNumber));
        
        return phase;
    }

    // ✅ Get default phase titles
    private String getDefaultPhaseTitle(int phaseNumber) {
        switch (phaseNumber) {
            case 1: return "Foundation Phase";
            case 2: return "Development Phase";
            case 3: return "Advanced Phase";
            case 4: return "Professional Phase";
            default: return "Learning Phase " + phaseNumber;
        }
    }

    // ✅ Get default descriptions
    private String getDefaultDescription(int phaseNumber) {
        switch (phaseNumber) {
            case 1: return "Build strong foundational knowledge and basic skills essential for your career path.";
            case 2: return "Develop practical skills and gain hands-on experience with real-world projects.";
            case 3: return "Master advanced concepts and specialize in key areas of expertise.";
            case 4: return "Achieve professional-level competency and prepare for industry leadership.";
            default: return "Continue building skills and expertise in your chosen field.";
        }
    }

    // ✅ Get phase-specific skills
    private List<String> getPhaseSpecificSkills(int phaseNumber, String phaseTitle) {
        // Try to extract skills from title/description context
        if (phaseTitle.toLowerCase().contains("foundation")) {
            return Arrays.asList("Core Fundamentals", "Basic Programming", "Problem Solving", "Learning Methodologies");
        } else if (phaseTitle.toLowerCase().contains("intermediate") || phaseTitle.toLowerCase().contains("development")) {
            return Arrays.asList("Practical Application", "Project Development", "Tool Proficiency", "Code Quality");
        } else if (phaseTitle.toLowerCase().contains("advanced")) {
            return Arrays.asList("Advanced Concepts", "System Design", "Optimization", "Best Practices");
        } else if (phaseTitle.toLowerCase().contains("expert") || phaseTitle.toLowerCase().contains("professional")) {
            return Arrays.asList("Specialization", "Leadership", "Innovation", "Industry Standards");
        } else {
            // Default based on phase number
            return getDefaultSkillsForPhase(phaseNumber);
        }
    }

    // ✅ Get default skills for phase
    private List<String> getDefaultSkillsForPhase(int phaseNumber) {
        switch (phaseNumber) {
            case 1: return Arrays.asList("Core Fundamentals", "Basic Tools", "Foundation Knowledge");
            case 2: return Arrays.asList("Practical Skills", "Intermediate Concepts", "Project Work");
            case 3: return Arrays.asList("Advanced Techniques", "Specialization", "Expert Skills");
            case 4: return Arrays.asList("Professional Skills", "Leadership", "Industry Standards");
            default: return Arrays.asList("General Skills", "Continuous Learning");
        }
    }

    // ✅ Get default resources
    private List<String> getDefaultResources() {
        return Arrays.asList("Online courses", "Documentation", "Practice platforms", "Community forums");
    }

    // ✅ Get phase-specific projects
    private List<String> getPhaseSpecificProjects(int phaseNumber) {
        switch (phaseNumber) {
            case 1: return Arrays.asList("Basic tutorial projects", "Simple portfolio pieces");
            case 2: return Arrays.asList("Practical applications", "Feature development");
            case 3: return Arrays.asList("Complex projects", "Advanced implementations");
            case 4: return Arrays.asList("Professional portfolio", "Industry-level projects");
            default: return Arrays.asList("Learning projects", "Skill demonstrations");
        }
    }

    // ✅ Get phase-specific milestones
    private List<String> getPhaseSpecificMilestones(int phaseNumber) {
        switch (phaseNumber) {
            case 1: return Arrays.asList("Complete fundamentals", "Build first project", "Understand basics");
            case 2: return Arrays.asList("Develop practical skills", "Complete real projects", "Gain confidence");
            case 3: return Arrays.asList("Master advanced concepts", "Build complex systems", "Demonstrate expertise");
            case 4: return Arrays.asList("Achieve professional level", "Lead projects", "Ready for industry");
            default: return Arrays.asList("Complete phase goals", "Build relevant projects");
        }
    }

    // ✅ SIMPLIFIED: Update existing generateStructuredRoadmap to be more detailed
    private Map<String, Object> generateStructuredRoadmap(String careerTitle) {
        Map<String, Object> roadmap = new HashMap<>();
        List<Map<String, Object>> phases = new ArrayList<>();
        
        // Create 4 detailed phases
        phases.add(createDetailedPhase(1, "Foundation Phase", "3 months", "foundation", careerTitle));
        phases.add(createDetailedPhase(2, "Development Phase", "3 months", "beginner", careerTitle));
        phases.add(createDetailedPhase(3, "Advanced Phase", "3 months", "intermediate", careerTitle));
        phases.add(createDetailedPhase(4, "Professional Phase", "3 months", "advanced", careerTitle));
        
        roadmap.put("title", careerTitle + " Learning Roadmap");
        roadmap.put("totalPhases", 4);
        roadmap.put("estimatedTime", "12 months");
        roadmap.put("phases", phases);
        roadmap.put("generatedBy", "Enhanced Structured");
        
        return roadmap;
    }

    // ✅ Create detailed phase for structured roadmap
    private Map<String, Object> createDetailedPhase(int number, String title, String duration, String type, String careerTitle) {
        Map<String, Object> phase = new HashMap<>();
        
        phase.put("phaseNumber", number);
        phase.put("title", title);
        phase.put("duration", duration);
        phase.put("type", type);
        phase.put("description", getDetailedPhaseDescription(number, careerTitle));
        phase.put("skills", getCareerSpecificSkills(careerTitle, number));
        phase.put("resources", getDefaultResources());
        phase.put("projects", getPhaseSpecificProjects(number));
        phase.put("milestones", getPhaseSpecificMilestones(number));
        
        return phase;
    }

    // ✅ Get detailed phase description
    private String getDetailedPhaseDescription(int phaseNumber, String careerTitle) {
        switch (phaseNumber) {
            case 1: return "Establish a solid foundation in " + careerTitle.toLowerCase() + " fundamentals and core concepts.";
            case 2: return "Develop practical skills and hands-on experience in " + careerTitle.toLowerCase() + " development.";
            case 3: return "Master advanced " + careerTitle.toLowerCase() + " techniques and specialized knowledge.";
            case 4: return "Achieve professional-level expertise and prepare for " + careerTitle.toLowerCase() + " leadership roles.";
            default: return "Continue advancing your " + careerTitle.toLowerCase() + " skills and expertise.";
        }
    }

    // ✅ Helper methods for career data
    private String getCareerDescription(String title) {
        Map<String, String> descriptions = new HashMap<>();
        descriptions.put("Data Scientist", "Analyze complex data to extract insights and drive business decisions");
        descriptions.put("Software Developer", "Design and build software applications and systems");
        descriptions.put("Frontend Developer", "Create user interfaces and experiences for web applications");
        descriptions.put("Business Analyst", "Bridge technology and business to improve processes");
        return descriptions.getOrDefault(title, "Recommended career path based on your skills");
    }

    private String getCareerIcon(String title) {
        Map<String, String> icons = new HashMap<>();
        icons.put("Data Scientist", "📊");
        icons.put("Software Developer", "💻");
        icons.put("Frontend Developer", "🎨");
        icons.put("Business Analyst", "📈");
        return icons.getOrDefault(title, "💼");
    }

    private String getDefaultSalaryRange(String title) {
        Map<String, String> salaries = new HashMap<>();
        salaries.put("Data Scientist", "$80,000 - $150,000");
        salaries.put("Software Developer", "$70,000 - $130,000");
        salaries.put("Frontend Developer", "$65,000 - $120,000");
        salaries.put("Business Analyst", "$60,000 - $110,000");
        return salaries.getOrDefault(title, "$60,000 - $120,000");
    }

    private String getDefaultGrowthRate(String title) {
        return "High (15-25%)";
    }

    private String getDefaultDifficulty(String title) {
        return "Moderate";
    }

    private String getDefaultLearningTime(String title) {
        return "6-12 months";
    }

    private Map<String, Object> createBasicUserProfile() {
        Map<String, Object> profile = new HashMap<>();
        profile.put("skills", "Basic level");
        profile.put("experience", "Beginner");
        profile.put("interests", "Technology");
        profile.put("learningStyle", "Hands-on");
        return profile;
    }

    // ✅ ADD: Missing generateCareerAdvice method
    public String generateCareerAdvice(String skills) {
        try {
            String prompt = buildCareerAdvicePrompt(skills);
            
            // ✅ Use the same pattern as your other methods
            Response<String> response = ollamaLanguageModel.generate(prompt);
            String aiResponse = response.content();
            
            if (aiResponse != null && !aiResponse.trim().isEmpty()) {
                return aiResponse;
            } else {
                return generateFallbackAdvice(skills);
            }
            
        } catch (Exception e) {
            System.err.println("❌ Career advice generation failed: " + e.getMessage());
            return generateFallbackAdvice(skills);
        }
    }

    // ✅ Build career advice prompt
    private String buildCareerAdvicePrompt(String skills) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("You are a career counselor. Provide brief career advice based on these skills: ");
        prompt.append(skills);
        prompt.append("\n\nProvide 2-3 sentences of personalized career guidance.");
        
        return prompt.toString();
    }

    // ✅ Generate fallback advice
    private String generateFallbackAdvice(String skills) {
        if (skills == null || skills.trim().isEmpty()) {
            return "Focus on developing both technical and soft skills to expand your career opportunities.";
        }
        
        if (skills.toLowerCase().contains("programming") || skills.toLowerCase().contains("coding")) {
            return "Your programming skills are valuable. Consider roles in software development, data analysis, or tech consulting.";
        } else if (skills.toLowerCase().contains("design") || skills.toLowerCase().contains("creative")) {
            return "Your creative skills can lead to opportunities in UX/UI design, marketing, or content creation.";
        } else if (skills.toLowerCase().contains("analysis") || skills.toLowerCase().contains("data")) {
            return "Your analytical skills are in high demand. Consider careers in data analysis, business intelligence, or research.";
        } else {
            return "Your diverse skill set opens up many career paths. Focus on combining your strengths with emerging industry trends.";
        }
    }

    // ✅ ADD: Missing getPhaseType method
    private String getPhaseType(int phaseNumber) {
        switch (phaseNumber) {
            case 1: return "foundation";
            case 2: return "beginner";
            case 3: return "intermediate";
            case 4: return "advanced";
            default: return "learning";
        }
    }

    // ✅ ADD: Missing getCareerSpecificSkills method
    private List<String> getCareerSpecificSkills(String careerTitle, int phaseNumber) {
        String career = careerTitle.toLowerCase();
        
        switch (career) {
            case "full stack developer":
            case "software developer":
                return getFullStackSkills(phaseNumber);
            case "data scientist":
                return getDataScienceSkills(phaseNumber);
            case "frontend developer":
                return getFrontendSkills(phaseNumber);
            case "backend developer":
                return getBackendSkills(phaseNumber);
            case "mobile developer":
                return getMobileSkills(phaseNumber);
            case "devops engineer":
                return getDevOpsSkills(phaseNumber);
            case "ui/ux designer":
            case "ux designer":
                return getUXDesignSkills(phaseNumber);
            case "business analyst":
                return getBusinessAnalystSkills(phaseNumber);
            case "cybersecurity specialist":
                return getCybersecuritySkills(phaseNumber);
            case "machine learning engineer":
                return getMLEngineerSkills(phaseNumber);
            default:
                return getDefaultSkillsForPhase(phaseNumber);
        }
    }

    // ✅ ADD: Career-specific skill methods
    private List<String> getFullStackSkills(int phaseNumber) {
        switch (phaseNumber) {
            case 1: return Arrays.asList("HTML5", "CSS3", "JavaScript Fundamentals", "Git Basics");
            case 2: return Arrays.asList("React/Vue.js", "Node.js", "Express.js", "Database Basics");
            case 3: return Arrays.asList("Advanced React", "RESTful APIs", "Database Design", "Testing");
            case 4: return Arrays.asList("System Architecture", "DevOps", "Performance Optimization", "Security");
            default: return Arrays.asList("Web Development", "Programming", "Problem Solving");
        }
    }

    private List<String> getDataScienceSkills(int phaseNumber) {
        switch (phaseNumber) {
            case 1: return Arrays.asList("Python", "Statistics", "Pandas", "NumPy");
            case 2: return Arrays.asList("Data Visualization", "Scikit-learn", "SQL", "Data Cleaning");
            case 3: return Arrays.asList("Machine Learning", "Deep Learning", "TensorFlow", "Feature Engineering");
            case 4: return Arrays.asList("MLOps", "Big Data", "Model Deployment", "Advanced Analytics");
            default: return Arrays.asList("Data Analysis", "Programming", "Statistics");
        }
    }

    private List<String> getFrontendSkills(int phaseNumber) {
        switch (phaseNumber) {
            case 1: return Arrays.asList("HTML5", "CSS3", "JavaScript ES6+", "Responsive Design");
            case 2: return Arrays.asList("React/Vue", "CSS Frameworks", "JavaScript Libraries", "Git");
            case 3: return Arrays.asList("State Management", "TypeScript", "Testing", "Build Tools");
            case 4: return Arrays.asList("Performance Optimization", "PWAs", "Accessibility", "Design Systems");
            default: return Arrays.asList("Frontend Development", "UI/UX", "Web Technologies");
        }
    }

    private List<String> getBackendSkills(int phaseNumber) {
        switch (phaseNumber) {
            case 1: return Arrays.asList("Programming Language", "Database Basics", "HTTP/REST", "Git");
            case 2: return Arrays.asList("Web Frameworks", "Database Design", "API Development", "Authentication");
            case 3: return Arrays.asList("Microservices", "Caching", "Message Queues", "Testing");
            case 4: return Arrays.asList("System Design", "Performance Tuning", "Security", "DevOps");
            default: return Arrays.asList("Backend Development", "Server-side Programming", "Databases");
        }
    }

    private List<String> getMobileSkills(int phaseNumber) {
        switch (phaseNumber) {
            case 1: return Arrays.asList("Mobile UI Basics", "Programming Language", "IDE Setup", "Git");
            case 2: return Arrays.asList("Native Development", "UI Components", "Local Storage", "APIs");
            case 3: return Arrays.asList("Advanced Features", "Performance", "Testing", "App Store");
            case 4: return Arrays.asList("Cross-platform", "CI/CD", "Analytics", "Monetization");
            default: return Arrays.asList("Mobile Development", "App Design", "Programming");
        }
    }

    private List<String> getDevOpsSkills(int phaseNumber) {
        switch (phaseNumber) {
            case 1: return Arrays.asList("Linux", "Git", "Command Line", "Networking Basics");
            case 2: return Arrays.asList("Docker", "CI/CD", "Cloud Basics", "Infrastructure");
            case 3: return Arrays.asList("Kubernetes", "Monitoring", "Security", "Automation");
            case 4: return Arrays.asList("Site Reliability", "Performance", "Disaster Recovery", "Leadership");
            default: return Arrays.asList("Infrastructure", "Automation", "Cloud Computing");
        }
    }

    private List<String> getUXDesignSkills(int phaseNumber) {
        switch (phaseNumber) {
            case 1: return Arrays.asList("Design Principles", "Figma/Sketch", "Color Theory", "Typography");
            case 2: return Arrays.asList("User Research", "Wireframing", "Prototyping", "Information Architecture");
            case 3: return Arrays.asList("Interaction Design", "Usability Testing", "Design Systems", "Accessibility");
            case 4: return Arrays.asList("Strategic Design", "Team Leadership", "Business Acumen", "Innovation");
            default: return Arrays.asList("UI/UX Design", "User Research", "Prototyping");
        }
    }

    private List<String> getBusinessAnalystSkills(int phaseNumber) {
        switch (phaseNumber) {
            case 1: return Arrays.asList("Business Fundamentals", "Data Analysis", "Excel", "Communication");
            case 2: return Arrays.asList("Requirements Gathering", "Process Mapping", "SQL", "Stakeholder Management");
            case 3: return Arrays.asList("Business Intelligence", "Project Management", "Agile", "Advanced Analytics");
            case 4: return Arrays.asList("Strategic Planning", "Change Management", "Leadership", "Digital Transformation");
            default: return Arrays.asList("Business Analysis", "Data Analysis", "Communication");
        }
    }

    private List<String> getCybersecuritySkills(int phaseNumber) {
        switch (phaseNumber) {
            case 1: return Arrays.asList("Security Fundamentals", "Networking", "Operating Systems", "Risk Assessment");
            case 2: return Arrays.asList("Penetration Testing", "Incident Response", "Security Tools", "Compliance");
            case 3: return Arrays.asList("Advanced Threats", "Forensics", "Security Architecture", "Automation");
            case 4: return Arrays.asList("Security Leadership", "Strategy", "Governance", "Emerging Threats");
            default: return Arrays.asList("Cybersecurity", "Risk Management", "Security Tools");
        }
    }

    private List<String> getMLEngineerSkills(int phaseNumber) {
        switch (phaseNumber) {
            case 1: return Arrays.asList("Python", "Mathematics", "Statistics", "Data Manipulation");
            case 2: return Arrays.asList("Machine Learning", "Deep Learning", "TensorFlow/PyTorch", "Model Training");
            case 3: return Arrays.asList("MLOps", "Model Deployment", "Scalability", "Production Systems");
            case 4: return Arrays.asList("Research", "Advanced ML", "Team Leadership", "Innovation");
            default: return Arrays.asList("Machine Learning", "AI Development", "Data Science");
        }
    }

    @PostConstruct
    public void initialize() {
        try {
            System.out.println("🔍 Initializing AI Engine with available model...");
            
            // ✅ IMPROVED: Better timeout and configuration
            this.ollamaLanguageModel = OllamaLanguageModel.builder()
                    .baseUrl("http://localhost:11434")
                    .modelName("phi:latest")
                    .temperature(0.7)
                    .timeout(Duration.ofMinutes(2))  // ✅ Increased to 2 minutes
                    .maxRetries(2)                   // ✅ Add retry logic
                    .build();
            
            // ✅ Test with a very simple prompt
            System.out.println("🧪 Testing AI model connection...");
            Response<String> testResponse = ollamaLanguageModel.generate("Hi");
            
            if (testResponse != null && testResponse.content() != null) {
                System.out.println("✅ AI Engine initialized successfully with model: phi:latest");
                System.out.println("🤖 Test response: " + testResponse.content().trim());
            } else {
                throw new RuntimeException("Model test failed - no response");
            }
            
        } catch (Exception e) {
            System.err.println("❌ Failed to initialize AI Engine: " + e.getMessage());
            System.err.println("🔄 AI features will use fallback responses");
            this.ollamaLanguageModel = null;
        }
    }
}
