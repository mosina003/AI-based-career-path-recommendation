package com.careerpredictor.controller;

import com.careerpredictor.dto.AuthResponse;
import com.careerpredictor.dto.LoginRequest;
import com.careerpredictor.dto.RegisterRequest;
import com.careerpredictor.dto.StudentProfileRequest;
import com.careerpredictor.entity.Student;
import com.careerpredictor.service.StudentService;
import com.careerpredictor.service.UserDetailsServiceImpl;
import com.careerpredictor.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    // ==========================
    // Student Registration with JWT
    // ==========================
    @PostMapping("/register")
    public ResponseEntity<?> registerStudent(@RequestBody RegisterRequest request) {
        try {
            // Register student (creates both User and Student)
            Student student = studentService.registerStudent(request);
            
            // Generate JWT token
            UserDetails userDetails = userDetailsService.loadUserByUsername(student.getUser().getUsername());
            String token = jwtUtil.generateToken(userDetails);

            // Return response with JWT token
            AuthResponse response = new AuthResponse(
                token, 
                student.getUser(), 
                student, 
                "Student registered successfully"
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // ==========================
    // Student Login with JWT
    // ==========================
    @PostMapping("/login")
    public ResponseEntity<?> loginStudent(@RequestBody LoginRequest request) {
        try {
            // ✅ Use email instead of username
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // ✅ Load user by email
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            String token = jwtUtil.generateToken(userDetails);

            // ✅ Get student data by email
            Student student = studentService.getByEmail(request.getEmail());

            // Return response with JWT token
            AuthResponse response = new AuthResponse(
                token, 
                student.getUser(), 
                student, 
                "Login successful"
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid email or password");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // ==========================
    // Create Student Profile (After Login)
    // ==========================
    @PostMapping("/profile")
    public ResponseEntity<Map<String, Object>> createProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody StudentProfileRequest request) {
        try {
            // Extract username from JWT token
            String token = authHeader.substring(7); // Remove "Bearer "
            String username = jwtUtil.extractUsername(token);

            // Create student profile for this user
            Student student = studentService.createProfile(username, request);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Student profile created successfully");
            response.put("student", student);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // ==========================
    // Get Student Profile
    // ==========================
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);

            Student student = studentService.getByUsername(username);

            Map<String, Object> response = new HashMap<>();
            response.put("student", student);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Profile not found");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // ==========================
    // Check if Profile Exists
    // ==========================
    @GetMapping("/profile/exists")
    public ResponseEntity<Map<String, Object>> checkProfileExists(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);

            boolean exists = studentService.profileExists(username);

            Map<String, Object> response = new HashMap<>();
            response.put("exists", exists);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("exists", false);
            return ResponseEntity.ok(response);
        }
    }

    // ==========================
    // Update Student Profile
    // ==========================
    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody StudentProfileRequest request) {
        try {
            // Extract username from JWT token
            String token = authHeader.substring(7); // Remove "Bearer "
            String username = jwtUtil.extractUsername(token);

            // Update student profile
            Student student = studentService.updateProfile(username, request);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Student profile updated successfully");
            response.put("student", student);
            response.put("success", true);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("success", false);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
