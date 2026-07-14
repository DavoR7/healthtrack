package com.smartgym.healthtrack.training.service;

import com.smartgym.healthtrack.training.dto.TrainingRoutineRequest;
import com.smartgym.healthtrack.training.dto.TrainingRoutineResponse;

import java.util.List;

public interface TrainingRoutineService {

    List<TrainingRoutineResponse> findAll(Boolean active);

    List<TrainingRoutineResponse> findByMemberId(
            Long memberId,
            Boolean active
    );

    TrainingRoutineResponse findById(Long id);

    TrainingRoutineResponse create(
            TrainingRoutineRequest request
    );

    TrainingRoutineResponse update(
            Long id,
            TrainingRoutineRequest request
    );

    void deactivate(Long id);
}
