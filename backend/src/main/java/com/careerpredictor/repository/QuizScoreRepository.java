package com.careerpredictor.repository;

import com.careerpredictor.entity.QuizScore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizScoreRepository extends JpaRepository<QuizScore, Long> {
    List<QuizScore> findByStudentId(Long studentId);
}
