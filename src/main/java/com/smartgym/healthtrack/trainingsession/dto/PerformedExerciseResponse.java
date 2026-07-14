package com.smartgym.healthtrack.trainingsession.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PerformedExerciseResponse(
        Long id,
        Long routineExerciseId,
        String exerciseName,
        String exerciseType,
        Integer setsCompleted,
        String repetitionsCompleted,
        BigDecimal weightKg,
        Integer durationMinutes,
        BigDecimal distanceKm,
        Integer caloriesBurned,
        Integer averageHeartRate,
        Integer effortLevel,
        Integer painLevel,
        Boolean completed,
        Boolean active,
        String observations,
        Integer exerciseOrder,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
