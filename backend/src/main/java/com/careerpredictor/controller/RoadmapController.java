package com.careerpredictor.controller;

import com.careerpredictor.service.AIEngineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/roadmap")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS}) // ✅ Enhanced CORS
public class RoadmapController {
    
    @Autowired
    private AIEngineService aiEngineService;
    
    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateRoadmap(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("🛣️ Roadmap generation request received: " + request); // ✅ Add logging
            
            String careerTitle = (String) request.get("careerTitle");
            
            // ✅ FIXED: Proper type checking to avoid warning
            Map<String, Object> userProfile = null;
            Object userProfileObj = request.get("userProfile");
            
            if (userProfileObj instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> tempProfile = (Map<String, Object>) userProfileObj;
                userProfile = tempProfile;
            } else {
                // Create default user profile if not provided
                userProfile = createDefaultUserProfile();
            }
            
            if (careerTitle == null || careerTitle.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Career title is required"));
            }
            
            System.out.println("🎯 Generating roadmap for: " + careerTitle); // ✅ Add logging
            
            Map<String, Object> roadmap = aiEngineService.generateDetailedRoadmap(careerTitle, userProfile);
            
            System.out.println("✅ Roadmap generated successfully"); // ✅ Add logging
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "roadmap", roadmap,
                "message", "Roadmap generated successfully"
            ));
            
        } catch (Exception e) {
            System.err.println("❌ Roadmap generation error: " + e.getMessage()); // ✅ Add logging
            e.printStackTrace();
            
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to generate roadmap: " + e.getMessage()
            ));
        }
    }
    
    // ✅ Add OPTIONS handler for CORS preflight
    @RequestMapping(value = "/generate", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok().build();
    }
    
    // ✅ Add test endpoint
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Roadmap API is working!");
        response.put("timestamp", System.currentTimeMillis());
        response.put("endpoint", "/api/roadmap/generate");
        return ResponseEntity.ok(response);
    }
    
    // ✅ Helper method to create default user profile
    private Map<String, Object> createDefaultUserProfile() {
        Map<String, Object> defaultProfile = new HashMap<>();
        defaultProfile.put("skills", "Basic level");
        defaultProfile.put("experience", "Beginner");
        defaultProfile.put("interests", "Technology");
        defaultProfile.put("learningStyle", "Hands-on");
        return defaultProfile;
    }
}