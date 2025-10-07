package com.careerpredictor.service;

import com.careerpredictor.entity.CareerPrediction;
import com.careerpredictor.entity.Student;
import com.careerpredictor.dto.PredictionResponseDTO;
import com.careerpredictor.dto.CareerPredictionResult;
import com.careerpredictor.dto.CareerAnalysisResult;
import com.careerpredictor.repository.CareerPredictionRepository;
import com.careerpredictor.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;

@Service
public class CareerPredictionService {
    private final CareerPredictionRepository repo;
    private final StudentRepository studentRepo;

    @Autowired
    private AIEngineService aiEngineService;

    public CareerPredictionService(CareerPredictionRepository repo, StudentRepository studentRepo) {
        this.repo = repo;
        this.studentRepo = studentRepo;
    }

    // ✅ FIXED METHOD: Keep your original method but fix the call
    public PredictionResponseDTO generatePrediction(Long studentId) {
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Create empty scores map for the new AI method
        Map<String, Double> emptyScores = new HashMap<>();
        PredictionResponseDTO prediction = aiEngineService.predictCareer(student, emptyScores);

        CareerPrediction cp = new CareerPrediction();
        cp.setCareer1(prediction.getCareer1());
        cp.setCareer1Confidence(prediction.getCareer1Confidence());
        cp.setCareer2(prediction.getCareer2());
        cp.setCareer2Confidence(prediction.getCareer2Confidence());
        cp.setCareer3(prediction.getCareer3());
        cp.setCareer3Confidence(prediction.getCareer3Confidence());
        cp.setRoadmap(prediction.getRoadmap());
        cp.setStudent(student);

        repo.save(cp);
        return prediction;
    }

    // ✅ NEW METHOD: For QuizService integration
    public CareerPredictionResult generatePredictions(Map<String, List<Integer>> answers, Long userId) {
        try {
            System.out.println("🧠 Analyzing quiz responses with smart algorithm for user: " + userId);
            System.out.println("📊 Processing " + answers.size() + " quiz answers");
            
            // Analyze quiz responses using our smart algorithm
            CareerAnalysisResult analysis = analyzeQuizResponses(answers);
            
            // Generate career recommendations based on analysis
            List<Map<String, Object>> predictions = generateSmartRecommendations(analysis);
            
            // Optionally save analysis results
            if (userId != null) {
                saveAnalysisResults(analysis, userId);
            }
            
            System.out.println("✅ Generated " + predictions.size() + " smart career recommendations");
            return new CareerPredictionResult(predictions);
            
        } catch (Exception e) {
            System.err.println("❌ Error in smart career analysis: " + e.getMessage());
            e.printStackTrace();
            return createFallbackPredictions();
        }
    }
    
    // ✅ SMART ANALYZER: Analyzes quiz patterns
    private CareerAnalysisResult analyzeQuizResponses(Map<String, List<Integer>> answers) {
        CareerAnalysisResult analysis = new CareerAnalysisResult();
        
        int techScore = 0;
        int creativeScore = 0;
        int analyticalScore = 0;
        int peopleScore = 0;
        int businessScore = 0;
        
        for (Map.Entry<String, List<Integer>> entry : answers.entrySet()) {
            String questionId = entry.getKey();
            List<Integer> responseList = entry.getValue();
            
            // Aggregate responses for scoring
            int responseSum = 0;
            for (Integer response : responseList) {
                responseSum += response;
            }
            int averageResponse = responseSum / responseList.size();
            
            // Technical Questions (TQ)
            if (questionId.startsWith("TQ")) {
                if (averageResponse >= 2) techScore += 3;
                else if (averageResponse == 1) techScore += 1;
            }
            
            // Creative/Communication Questions (cc)
            else if (questionId.startsWith("cc")) {
                if (averageResponse >= 2) creativeScore += 3;
                else if (averageResponse == 1) creativeScore += 1;
            }
            
            // Analytical/Problem-solving Questions (ip)
            else if (questionId.startsWith("ip")) {
                if (averageResponse >= 2) analyticalScore += 3;
                else if (averageResponse == 1) analyticalScore += 1;
            }
            
            // People/Interaction Questions (pi)
            else if (questionId.startsWith("pi")) {
                if (averageResponse >= 2) peopleScore += 3;
                else if (averageResponse == 1) peopleScore += 1;
            }
            
            // Scenario-based Questions (business orientation)
            else if (questionId.startsWith("scenario")) {
                if (averageResponse >= 2) businessScore += 2;
                else if (averageResponse == 1) businessScore += 1;
            }
        }
        
        // Store scores in analysis result
        analysis.setTechScore(techScore);
        analysis.setCreativeScore(creativeScore);
        analysis.setAnalyticalScore(analyticalScore);
        analysis.setPeopleScore(peopleScore);
        analysis.setBusinessScore(businessScore);
        
        // Determine primary and secondary orientations
        analysis.determinePrimaryOrientation();
        
        System.out.println("📊 Analysis Results:");
        System.out.println("   Tech: " + techScore + ", Creative: " + creativeScore + 
                          ", Analytical: " + analyticalScore + ", People: " + peopleScore + 
                          ", Business: " + businessScore);
        System.out.println("   Primary: " + analysis.getPrimaryOrientation() + 
                          ", Secondary: " + analysis.getSecondaryOrientation());
        
        return analysis;
    }
    
    // ✅ SMART RECOMMENDATIONS: Generate careers based on analysis
    private List<Map<String, Object>> generateSmartRecommendations(CareerAnalysisResult analysis) {
        List<Map<String, Object>> predictions = new ArrayList<>();
        
        String primary = analysis.getPrimaryOrientation();
        String secondary = analysis.getSecondaryOrientation();
        
        // Generate recommendations based on primary + secondary combination
        if ("TECHNICAL".equals(primary)) {
            if ("ANALYTICAL".equals(secondary)) {
                predictions.add(createCareerOption("Data Scientist", 92, "💻", 
                    "Combine programming skills with statistical analysis to extract insights from data",
                    "$80,000 - $150,000", "Very High (25%)", "8-12 months", "Advanced"));
                predictions.add(createCareerOption("Software Engineer", 88, "🔧", 
                    "Build scalable software systems and applications using modern technologies",
                    "$70,000 - $130,000", "High (20%)", "6-10 months", "Moderate"));
                predictions.add(createCareerOption("Machine Learning Engineer", 85, "🤖", 
                    "Develop AI models and machine learning systems for real-world applications",
                    "$90,000 - $160,000", "Very High (30%)", "10-15 months", "Advanced"));
            } else if ("CREATIVE".equals(secondary)) {
                predictions.add(createCareerOption("Frontend Developer", 90, "🎨", 
                    "Create engaging user interfaces combining technical skills with design sense",
                    "$65,000 - $120,000", "High (18%)", "4-8 months", "Moderate"));
                predictions.add(createCareerOption("UX Engineer", 86, "💻", 
                    "Bridge design and development to create seamless user experiences",
                    "$75,000 - $125,000", "High (22%)", "6-10 months", "Moderate"));
                predictions.add(createCareerOption("Game Developer", 82, "🎮", 
                    "Develop interactive games combining programming with creative storytelling",
                    "$60,000 - $110,000", "Moderate (15%)", "8-12 months", "Moderate"));
            } else {
                predictions.add(createCareerOption("Full Stack Developer", 88, "💻", 
                    "Work on both frontend and backend development for complete web applications",
                    "$70,000 - $125,000", "High (20%)", "6-12 months", "Moderate"));
                predictions.add(createCareerOption("DevOps Engineer", 85, "⚙️", 
                    "Manage infrastructure and deployment pipelines for software applications",
                    "$75,000 - $135,000", "Very High (25%)", "8-14 months", "Advanced"));
                predictions.add(createCareerOption("Cybersecurity Specialist", 82, "🔒", 
                    "Protect systems and data from security threats and vulnerabilities",
                    "$80,000 - $140,000", "Very High (28%)", "10-16 months", "Advanced"));
            }
        }
        
        else if ("ANALYTICAL".equals(primary)) {
            if ("TECHNICAL".equals(secondary)) {
                predictions.add(createCareerOption("Data Analyst", 90, "📊", 
                    "Analyze business data to provide insights and support decision-making",
                    "$60,000 - $100,000", "High (20%)", "4-8 months", "Moderate"));
                predictions.add(createCareerOption("Business Intelligence Analyst", 87, "📈", 
                    "Create dashboards and reports to help businesses understand their performance",
                    "$65,000 - $110,000", "High (18%)", "6-10 months", "Moderate"));
                predictions.add(createCareerOption("Quantitative Analyst", 84, "🔢", 
                    "Use mathematical models to analyze financial markets and investment strategies",
                    "$85,000 - $150,000", "High (22%)", "10-15 months", "Advanced"));
            } else if ("BUSINESS".equals(secondary)) {
                predictions.add(createCareerOption("Business Analyst", 89, "💼", 
                    "Bridge business needs with technical solutions through data analysis",
                    "$65,000 - $115,000", "High (19%)", "5-9 months", "Moderate"));
                predictions.add(createCareerOption("Management Consultant", 86, "📋", 
                    "Help organizations solve complex problems and improve efficiency",
                    "$80,000 - $140,000", "Moderate (12%)", "8-12 months", "Advanced"));
                predictions.add(createCareerOption("Market Research Analyst", 83, "📊", 
                    "Study market conditions and consumer behavior to guide business strategies",
                    "$55,000 - $95,000", "High (18%)", "4-7 months", "Moderate"));
            } else {
                predictions.add(createCareerOption("Research Scientist", 87, "🔬", 
                    "Conduct research and analysis in specialized fields to advance knowledge",
                    "$70,000 - $120,000", "Moderate (8%)", "12-24 months", "Advanced"));
                predictions.add(createCareerOption("Financial Analyst", 84, "💰", 
                    "Evaluate investment opportunities and financial performance for organizations",
                    "$60,000 - $105,000", "Moderate (15%)", "6-10 months", "Moderate"));
                predictions.add(createCareerOption("Operations Research Analyst", 81, "⚡", 
                    "Use advanced analytics to solve complex business problems",
                    "$75,000 - $125,000", "High (25%)", "8-12 months", "Advanced"));
            }
        }
        
        else if ("CREATIVE".equals(primary)) {
            if ("TECHNICAL".equals(secondary)) {
                predictions.add(createCareerOption("UX/UI Designer", 91, "🎨", 
                    "Design intuitive user interfaces and experiences for digital products",
                    "$60,000 - $110,000", "High (16%)", "4-8 months", "Moderate"));
                predictions.add(createCareerOption("Product Designer", 88, "🚀", 
                    "Lead design strategy for products from concept to launch",
                    "$70,000 - $125,000", "High (20%)", "6-12 months", "Moderate"));
                predictions.add(createCareerOption("Web Designer", 85, "💻", 
                    "Create visually appealing and functional websites and applications",
                    "$50,000 - $90,000", "Moderate (10%)", "3-6 months", "Easy"));
            } else if ("PEOPLE".equals(secondary)) {
                predictions.add(createCareerOption("Creative Director", 89, "🎭", 
                    "Lead creative teams and guide the vision for marketing and design projects",
                    "$80,000 - $140,000", "Moderate (12%)", "8-15 months", "Advanced"));
                predictions.add(createCareerOption("Content Creator", 86, "📝", 
                    "Develop engaging content across various media platforms and formats",
                    "$45,000 - $85,000", "High (22%)", "3-6 months", "Easy"));
                predictions.add(createCareerOption("Brand Manager", 83, "📢", 
                    "Develop and manage brand strategy and marketing campaigns",
                    "$65,000 - $115,000", "Moderate (15%)", "6-10 months", "Moderate"));
            } else {
                predictions.add(createCareerOption("Graphic Designer", 87, "🎨", 
                    "Create visual concepts and designs for various media and purposes",
                    "$45,000 - $80,000", "Moderate (8%)", "3-6 months", "Easy"));
                predictions.add(createCareerOption("Video Editor", 84, "🎬", 
                    "Edit and produce video content for entertainment, marketing, or educational purposes",
                    "$40,000 - $75,000", "High (18%)", "4-8 months", "Moderate"));
                predictions.add(createCareerOption("Digital Artist", 81, "🖼️", 
                    "Create digital artwork and illustrations for games, media, or advertising",
                    "$50,000 - $90,000", "Moderate (12%)", "6-12 months", "Moderate"));
            }
        }
        
        else if ("PEOPLE".equals(primary)) {
            if ("BUSINESS".equals(secondary)) {
                predictions.add(createCareerOption("Human Resources Manager", 89, "👥", 
                    "Manage employee relations, recruitment, and organizational development",
                    "$65,000 - $115,000", "Moderate (12%)", "6-12 months", "Moderate"));
                predictions.add(createCareerOption("Sales Manager", 86, "💼", 
                    "Lead sales teams and develop strategies to drive revenue growth",
                    "$70,000 - $130,000", "Moderate (10%)", "4-8 months", "Moderate"));
                predictions.add(createCareerOption("Training and Development Specialist", 83, "🎓", 
                    "Design and deliver training programs to enhance employee skills",
                    "$55,000 - $95,000", "High (18%)", "5-10 months", "Moderate"));
            } else if ("CREATIVE".equals(secondary)) {
                predictions.add(createCareerOption("Marketing Manager", 88, "📢", 
                    "Develop and execute marketing strategies to promote products and services",
                    "$60,000 - $110,000", "High (16%)", "5-9 months", "Moderate"));
                predictions.add(createCareerOption("Public Relations Specialist", 85, "📰", 
                    "Manage public image and communications for organizations or individuals",
                    "$50,000 - $90,000", "Moderate (12%)", "4-8 months", "Moderate"));
                predictions.add(createCareerOption("Event Coordinator", 82, "🎉", 
                    "Plan and execute events, conferences, and special occasions",
                    "$40,000 - $70,000", "High (15%)", "3-6 months", "Easy"));
            } else {
                predictions.add(createCareerOption("Teacher/Educator", 87, "🎓", 
                    "Educate and inspire students in academic or professional settings",
                    "$45,000 - $80,000", "Stable (5%)", "12-24 months", "Moderate"));
                predictions.add(createCareerOption("Social Worker", 84, "🤝", 
                    "Help individuals and communities overcome challenges and improve their lives",
                    "$50,000 - $85,000", "Moderate (10%)", "12-18 months", "Moderate"));
                predictions.add(createCareerOption("Customer Success Manager", 81, "😊", 
                    "Ensure customer satisfaction and drive product adoption and retention",
                    "$60,000 - $105,000", "High (20%)", "4-8 months", "Moderate"));
            }
        }
        
        else { // BUSINESS primary
            predictions.add(createCareerOption("Project Manager", 88, "📋", 
                "Lead and coordinate projects from initiation to completion across various industries",
                "$70,000 - $120,000", "High (20%)", "6-10 months", "Moderate"));
            predictions.add(createCareerOption("Business Development Manager", 85, "🚀", 
                "Identify growth opportunities and build strategic partnerships",
                "$75,000 - $125,000", "High (18%)", "8-12 months", "Moderate"));
            predictions.add(createCareerOption("Operations Manager", 82, "⚙️", 
                "Oversee daily operations and optimize business processes for efficiency",
                "$65,000 - $110,000", "Moderate (15%)", "6-12 months", "Moderate"));
        }
        
        // ✅ NEW: Generate roadmap for each prediction
        for (Map<String, Object> prediction : predictions) {
            String careerTitle = (String) prediction.get("title");
            
            // Create user profile for AI roadmap generation
            Map<String, Object> userProfile = createUserProfile(analysis);
            
            // Generate AI roadmap
            Map<String, Object> roadmap = aiEngineService.generateDetailedRoadmap(careerTitle, userProfile);
            prediction.put("roadmap", roadmap);
        }
        
        return predictions;
    }
    
    // ✅ NEW: Create user profile from analysis
    private Map<String, Object> createUserProfile(CareerAnalysisResult analysis) {
        Map<String, Object> profile = new HashMap<>();
        
        profile.put("skills", analysis.getTopSkills());
        profile.put("experience", determineExperienceLevel(analysis));
        profile.put("interests", analysis.getPrimaryInterests());
        profile.put("learningStyle", "Hands-on and practical");
        
        return profile;
    }
    
    // ✅ NEW: Determine experience level
    private String determineExperienceLevel(CareerAnalysisResult analysis) {
        // Logic to determine experience based on analysis
        double skillAverage = analysis.getAverageSkillScore();
        
        if (skillAverage >= 8.0) return "Advanced";
        if (skillAverage >= 6.0) return "Intermediate";
        return "Beginner";
    }
    
    // ✅ HELPER: Create career option
    private Map<String, Object> createCareerOption(String title, int matchPercentage, String icon, 
                                                 String description, String salary, String growth, 
                                                 String learningTime, String difficulty) {
        Map<String, Object> career = new HashMap<>();
        career.put("title", title);
        career.put("match_percentage", matchPercentage);
        career.put("icon", icon);
        career.put("description", description);
        career.put("salary_range", salary);
        career.put("growth_rate", growth);
        career.put("learning_time", learningTime);
        career.put("difficulty", difficulty);
        return career;
    }
    
    // ✅ HELPER: Save analysis results  
    private void saveAnalysisResults(CareerAnalysisResult analysis, Long userId) {
        try {
            Student student = studentRepo.findById(userId).orElse(null);
            if (student != null) {
                CareerPrediction cp = new CareerPrediction();
                cp.setCareer1("Analysis: " + analysis.getPrimaryOrientation());
                cp.setCareer1Confidence((double) analysis.getTechScore() / 100);
                cp.setCareer2("Secondary: " + analysis.getSecondaryOrientation());
                cp.setCareer2Confidence((double) analysis.getCreativeScore() / 100);
                cp.setCareer3("Pattern: Smart Algorithm");
                cp.setCareer3Confidence((double) analysis.getAnalyticalScore() / 100);
                cp.setRoadmap("Smart analysis based on quiz response patterns");
                cp.setStudent(student);
                
                repo.save(cp);
                System.out.println("✅ Saved analysis results to database");
            }
        } catch (Exception e) {
            System.err.println("⚠️ Could not save analysis results: " + e.getMessage());
        }
    }
    
    // ✅ FALLBACK: Simple predictions if AI fails
    private CareerPredictionResult createFallbackPredictions() {
        System.out.println("🔄 Using fallback predictions (AI service returned empty titles)");
        
        List<Map<String, Object>> fallbackPredictions = new ArrayList<>();
        
        // Software Developer
        Map<String, Object> career1 = new HashMap<>();
        career1.put("title", "Software Developer");
        career1.put("match_percentage", 85);
        career1.put("icon", "💻");
        career1.put("description", "Create and maintain software applications using various programming languages and frameworks.");
        career1.put("salary_range", "$65,000 - $130,000");
        career1.put("growth_rate", "High (22%)");
        career1.put("learning_time", "6-12 months");
        career1.put("difficulty", "Moderate");
        career1.put("matching_skills", Arrays.asList("Problem Solving", "Logical Thinking", "Attention to Detail"));
        career1.put("skills_to_learn", Arrays.asList("Programming Languages", "Web Development", "Database Management"));
        fallbackPredictions.add(career1);
        
        // Data Analyst
        Map<String, Object> career2 = new HashMap<>();
        career2.put("title", "Data Analyst");
        career2.put("match_percentage", 78);
        career2.put("icon", "📊");
        career2.put("description", "Analyze and interpret complex data to help organizations make informed business decisions.");
        career2.put("salary_range", "$55,000 - $95,000");
        career2.put("growth_rate", "Very High (25%)");
        career2.put("learning_time", "4-8 months");
        career2.put("difficulty", "Moderate");
        career2.put("matching_skills", Arrays.asList("Analytical Thinking", "Mathematics", "Pattern Recognition"));
        career2.put("skills_to_learn", Arrays.asList("SQL", "Python/R", "Data Visualization", "Statistics"));
        fallbackPredictions.add(career2);
        
        // UX Designer
        Map<String, Object> career3 = new HashMap<>();
        career3.put("title", "UX/UI Designer");
        career3.put("match_percentage", 72);
        career3.put("icon", "🎨");
        career3.put("description", "Design user-friendly interfaces and experiences for digital products and applications.");
        career3.put("salary_range", "$50,000 - $90,000");
        career3.put("growth_rate", "High (13%)");
        career3.put("learning_time", "3-6 months");
        career3.put("difficulty", "Easy to Moderate");
        career3.put("matching_skills", Arrays.asList("Creativity", "User Empathy", "Visual Design"));
        career3.put("skills_to_learn", Arrays.asList("Design Tools", "User Research", "Prototyping", "Usability Testing"));
        fallbackPredictions.add(career3);
        
        return new CareerPredictionResult(fallbackPredictions);
    }
}
