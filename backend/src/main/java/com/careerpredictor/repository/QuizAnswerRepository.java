package com.careerpredictor.repository;

import com.careerpredictor.entity.QuizAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizAnswerRepository extends JpaRepository<QuizAnswer, Long> {
    List<QuizAnswer> findByUserId(Long userId);
    List<QuizAnswer> findByQuizSessionId(String quizSessionId);
    List<QuizAnswer> findByQuestionId(String questionId);
}