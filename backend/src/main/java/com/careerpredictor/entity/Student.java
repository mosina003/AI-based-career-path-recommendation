package com.careerpredictor.entity;

import com.careerpredictor.converter.JpaConverterJson;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "students")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ CRITICAL: Reference to User entity
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // ✅ ADD THIS TO PREVENT CIRCULAR REFERENCE
    private User user;

    @Column(nullable = false)
    private String name;

    private Integer age;
    private String phoneNumber;
    private String university;  // ✅ Add this
    private String course;

    @Column(columnDefinition = "TEXT")
    private String skills;      // ✅ Add this

    private String grades;

    @Column(columnDefinition = "TEXT")
    private String interests;

    @Convert(converter = JpaConverterJson.class)
    @Column(columnDefinition = "JSON")
    private Map<String, Double> personalityScores;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructors
    public Student() {}

    public Student(User user, String name) {
        this.user = user;
        this.name = name;
    }

    // ✅ ALL GETTERS AND SETTERS:
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public String getGrades() { return grades; }
    public void setGrades(String grades) { this.grades = grades; }

    public String getInterests() { return interests; }
    public void setInterests(String interests) { this.interests = interests; }

    public Map<String, Double> getPersonalityScores() { return personalityScores; }
    public void setPersonalityScores(Map<String, Double> personalityScores) { this.personalityScores = personalityScores; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
