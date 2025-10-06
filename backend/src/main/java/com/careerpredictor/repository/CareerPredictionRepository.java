package com.careerpredictor.repository;

import com.careerpredictor.entity.CareerPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CareerPredictionRepository extends JpaRepository<CareerPrediction, Long> {
    List<CareerPrediction> findByStudentId(Long studentId);
}
