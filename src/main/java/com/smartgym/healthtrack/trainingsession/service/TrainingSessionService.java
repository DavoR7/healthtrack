package com.smartgym.healthtrack.trainingsession.service;

import com.smartgym.healthtrack.trainingsession.dto.TrainingSessionRequest;
import com.smartgym.healthtrack.trainingsession.dto.TrainingSessionResponse;

import java.util.List;

public interface TrainingSessionService {

    List<TrainingSessionResponse> findAll(
            Boolean active
    );

    TrainingSessionResponse findById(
            Long id
    );

    List<TrainingSessionResponse> findByMemberId(
            Long memberId,
            Boolean active
    );

    List<TrainingSessionResponse> findByRoutineId(
            Long routineId,
            Boolean active
    );

    TrainingSessionResponse create(
            TrainingSessionRequest request
    );

    TrainingSessionResponse update(
            Long id,
            TrainingSessionRequest request
    );

    void deactivate(
            Long id
    );
}
