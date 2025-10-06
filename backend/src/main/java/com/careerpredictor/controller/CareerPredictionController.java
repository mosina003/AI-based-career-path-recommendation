package com.careerpredictor.controller;

import com.careerpredictor.service.AIEngineService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/careers")
public class CareerPredictionController {

    private final AIEngineService aiService;

    public CareerPredictionController(AIEngineService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/predict")
    public String predict(@RequestParam String skills, Authentication authentication) {
        // Now this endpoint requires authentication
        String username = authentication.getName();
        return "User: " + username + " - " + aiService.generateCareerAdvice(skills);
    }

    @GetMapping("/test")
    public String test(Authentication authentication) {
        return "Hello " + authentication.getName() + "! JWT authentication is working.";
    }
}
