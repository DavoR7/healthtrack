package com.smartgym.healthtrack.trainingsession.dto;

import com.smartgym.healthtrack.trainingsession.model.ActivityType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record TrainingSessionResponse(
        Long id,

        Long memberId,
        String memberIdentification,
        String memberFullName,

        Long routineId,
        String routineName,

        LocalDate sessionDate,
        LocalTime startTime,
        LocalTime endTime,
        ActivityType activityType,

        Integer durationMinutes,
        Integer steps,
        BigDecimal distanceKm,
        Integer cardioMinutes,
        Integer caloriesBurned,
        Integer floorsClimbed,

        Integer averageHeartRate,
        Integer maximumHeartRate,
        Integer effortLevel,
        Integer painLevel,

        Boolean completed,
        Boolean active,
        String observations,

        Integer exerciseCount,
        Integer completedExerciseCount,
        BigDecimal completionPercentage,
        BigDecimal totalWeightVolumeKg,

        List<PerformedExerciseResponse> performedExercises,

        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
