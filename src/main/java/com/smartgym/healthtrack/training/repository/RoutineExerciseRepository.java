package com.smartgym.healthtrack.training.repository;

import com.smartgym.healthtrack.training.model.RoutineExercise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoutineExerciseRepository
        extends JpaRepository<RoutineExercise, Long> {

    List<RoutineExercise>
    findByRoutineIdOrderByExerciseOrderAsc(
            Long routineId
    );
}
