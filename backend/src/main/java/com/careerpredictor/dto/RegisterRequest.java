package com.careerpredictor.dto;

public class RegisterRequest {
    // Authentication fields (for User)
    private String username;
    private String email;
    private String password;
    
    // Profile fields (for Student)
    private String name;
    private Integer age;
    private String phoneNumber;
    private String university;
    private String course;
    private String skills;
    private String interests;

    // Constructors
    public RegisterRequest() {}

    // Constructor with parameters
    public RegisterRequest(String username, String email, String password, String name, Integer age, String phoneNumber, String university, String course, String skills, String interests) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.name = name;
        this.age = age;
        this.phoneNumber = phoneNumber;
        this.university = university;
        this.course = course;
        this.skills = skills;
        this.interests = interests;
    }

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getUniversity() { return university; }
    public void setUniversity(String university) { this.university = university; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getInterests() { return interests; }
    public void setInterests(String interests) { this.interests = interests; }
}