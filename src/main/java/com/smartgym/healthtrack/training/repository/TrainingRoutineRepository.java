package com.smartgym.healthtrack.training.repository;

import com.smartgym.healthtrack.training.model.TrainingRoutine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainingRoutineRepository
        extends JpaRepository<TrainingRoutine, Long> {

    List<TrainingRoutine> findAllByOrderByStartDateDesc();

    List<TrainingRoutine> findByActiveOrderByStartDateDesc(
            Boolean active
    );

    List<TrainingRoutine> findByMemberIdOrderByStartDateDesc(
            Long memberId
    );

    List<TrainingRoutine>
    findByMemberIdAndActiveOrderByStartDateDesc(
            Long memberId,
            Boolean active
    );
}
