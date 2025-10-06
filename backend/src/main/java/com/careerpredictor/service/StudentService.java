package com.careerpredictor.service;

import com.careerpredictor.dto.RegisterRequest;
import com.careerpredictor.dto.StudentProfileRequest;
import com.careerpredictor.entity.Student;
import com.careerpredictor.entity.User;
import com.careerpredictor.repository.StudentRepository;
import com.careerpredictor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Student registerStudent(RegisterRequest request) {
        // Step 1: Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Step 2: Create User (authentication data)
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.USER);
        user.setEnabled(true);

        // Save user first
        user = userRepository.save(user);

        // Step 3: Create Student (profile data)
        Student student = new Student();
        student.setUser(user);
        student.setName(request.getName());
        student.setAge(request.getAge());
        student.setPhoneNumber(request.getPhoneNumber());
        student.setUniversity(request.getUniversity());
        student.setCourse(request.getCourse());
        student.setSkills(request.getSkills());
        student.setInterests(request.getInterests());

        // Step 4: Save student (this links them together)
        student = studentRepository.save(student);

        return student;
    }

    public List<Student> getAll() {
        return studentRepository.findAll();
    }

    public Student getById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    public Student getByUserId(Long userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student not found for user id: " + userId));
    }

    public Student updateStudent(Long id, Student updatedStudent) {
        Student existingStudent = getById(id);
        
        // Update fields (keep user relationship intact)
        existingStudent.setName(updatedStudent.getName());
        existingStudent.setAge(updatedStudent.getAge());
        existingStudent.setPhoneNumber(updatedStudent.getPhoneNumber());
        existingStudent.setUniversity(updatedStudent.getUniversity());
        existingStudent.setCourse(updatedStudent.getCourse());
        existingStudent.setSkills(updatedStudent.getSkills());
        existingStudent.setInterests(updatedStudent.getInterests());
        existingStudent.setPersonalityScores(updatedStudent.getPersonalityScores());
        
        return studentRepository.save(existingStudent);
    }

    public void deleteStudent(Long id) {
        Student student = getById(id);
        studentRepository.delete(student);
    }

    public Student getByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        return studentRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student not found for user: " + username));
    }

    public Student createProfile(String username, StudentProfileRequest request) {
        // Find existing user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        // Check if profile already exists
        if (studentRepository.findByUser(user).isPresent()) {
            throw new RuntimeException("Student profile already exists");
        }

        // Create student profile
        Student student = new Student();
        student.setUser(user);
        student.setName(request.getName());
        student.setAge(request.getAge());
        student.setPhoneNumber(request.getPhoneNumber());
        student.setUniversity(request.getUniversity());
        student.setCourse(request.getCourse());
        student.setSkills(request.getSkills());
        student.setInterests(request.getInterests());

        return studentRepository.save(student);
    }

    public boolean profileExists(String username) {
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return studentRepository.findByUser(user).isPresent();
        } catch (Exception e) {
            return false;
        }
    }

    public Student getByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return studentRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student not found for user: " + email));
    }

    public Student updateProfile(String username, StudentProfileRequest request) {
        try {
            // Find existing student by username
            Student student = getByUsername(username);
            
            // ✅ UPDATE ONLY EXISTING FIELDS IN YOUR STUDENT ENTITY
            student.setName(request.getName());
            student.setAge(request.getAge());
            student.setPhoneNumber(request.getPhoneNumber());
            student.setUniversity(request.getUniversity());
            student.setCourse(request.getCourse());
            student.setSkills(request.getSkills());
            student.setInterests(request.getInterests());
            
            // Save updated student
            return studentRepository.save(student);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to update profile: " + e.getMessage());
        }
    }
}
