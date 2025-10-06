package com.careerpredictor.repository;

import com.careerpredictor.entity.Student;
import com.careerpredictor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUser(User user);
    Optional<Student> findByUserId(Long userId);
}
