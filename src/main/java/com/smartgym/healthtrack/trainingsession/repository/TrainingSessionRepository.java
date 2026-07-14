package com.smartgym.healthtrack.trainingsession.repository;

import com.smartgym.healthtrack.trainingsession.model.TrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainingSessionRepository
        extends JpaRepository<TrainingSession, Long> {

    List<TrainingSession>
    findAllByOrderBySessionDateDescStartTimeDesc();

    List<TrainingSession>
    findByActiveOrderBySessionDateDescStartTimeDesc(
            Boolean active
    );

    List<TrainingSession>
    findByMemberIdOrderBySessionDateDescStartTimeDesc(
            Long memberId
    );

    List<TrainingSession>
    findByMemberIdAndActiveOrderBySessionDateDescStartTimeDesc(
            Long memberId,
            Boolean active
    );

    List<TrainingSession>
    findByRoutineIdOrderBySessionDateDescStartTimeDesc(
            Long routineId
    );

    List<TrainingSession>
    findByRoutineIdAndActiveOrderBySessionDateDescStartTimeDesc(
            Long routineId,
            Boolean active
    );
}
