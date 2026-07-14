package com.smartgym.healthtrack.training.dto;

import java.math.BigDecimal;

public record RoutineExerciseResponse(
        Long id,
        String name,
        String muscleGroup,
        Integer setsCount,
        String repetitions,
        BigDecimal loadKg,
        Integer restSeconds,
        Integer exerciseOrder,
        String instructions,
        Boolean active
) {
}
