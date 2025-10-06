package com.careerpredictor.dto;

import com.careerpredictor.entity.Student;
import com.careerpredictor.entity.User;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private String role;
    private User user;
    private Student student;
    private String message;

    // Constructor for AuthController (token, username, role)
    public AuthResponse(String token, String username, String role) {
        this.token = token;
        this.username = username;
        this.role = role;
    }

    // Constructor for error messages
    public AuthResponse(String message) {
        this.message = message;
    }

    // ✅ Constructor for StudentController (token, user, student, message)
    public AuthResponse(String token, User user, Student student, String message) {
        this.token = token;
        this.user = user;
        this.student = student;
        this.message = message;
        if (user != null) {
            this.username = user.getUsername();
            this.role = user.getRole().name();
        }
    }

    // All getters and setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}