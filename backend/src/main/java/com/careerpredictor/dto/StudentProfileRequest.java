package com.careerpredictor.dto;

public class StudentProfileRequest {
    private String name;
    private Integer age;
    private String phoneNumber;
    private String university;
    private String course;
    private String skills;
    private String interests;

    public StudentProfileRequest() {}

    // Getters and Setters
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