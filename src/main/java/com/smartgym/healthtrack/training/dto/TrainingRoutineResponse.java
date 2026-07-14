package com.smartgym.healthtrack.training.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record TrainingRoutineResponse(
        Long id,
        Long memberId,
        String memberIdentification,
        String memberFullName,
        String name,
        String objective,
        String level,
        LocalDate startDate,
        LocalDate endDate,
        Integer daysPerWeek,
        Integer estimatedDurationMinutes,
        String observations,
        Boolean active,
        Integer exerciseCount,
        List<RoutineExerciseResponse> exercises,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
