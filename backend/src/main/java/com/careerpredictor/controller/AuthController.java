package com.careerpredictor.controller;

import com.careerpredictor.dto.LoginRequest;
import com.careerpredictor.dto.RegisterRequest;
import com.careerpredictor.entity.User;
import com.careerpredictor.repository.UserRepository;
import com.careerpredictor.service.UserDetailsServiceImpl;
import com.careerpredictor.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    // ==========================
    // BASIC USER REGISTRATION (No Student Profile)
    // ==========================
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        try {
            // Check if user already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Email already exists");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            if (userRepository.existsByUsername(request.getUsername())) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Username already exists");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Create User ONLY (no student profile)
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(User.Role.USER);
            user.setEnabled(true);

            // Save user
            user = userRepository.save(user);

            // Generate JWT token
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
            String token = jwtUtil.generateToken(userDetails);

            // Response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("token", token);
            response.put("user", user);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // ==========================
    // BASIC USER LOGIN
    // ==========================
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        try {
            // Authenticate using email instead of username
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // Load user by email instead of username
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            String token = jwtUtil.generateToken(userDetails);

            // Get user data by email
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("token", token);
            response.put("user", user);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid email or password");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}