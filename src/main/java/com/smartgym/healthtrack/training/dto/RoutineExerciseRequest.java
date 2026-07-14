package com.smartgym.healthtrack.training.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record RoutineExerciseRequest(

        @NotBlank(message = "El nombre del ejercicio es obligatorio")
        @Size(max = 150)
        String name,

        @Size(max = 100)
        String muscleGroup,

        @Positive(message = "Las series deben ser mayores que cero")
        Integer setsCount,

        @Size(max = 50)
        String repetitions,

        @PositiveOrZero(
                message = "La carga no puede ser negativa"
        )
        BigDecimal loadKg,

        @PositiveOrZero(
                message = "El descanso no puede ser negativo"
        )
        Integer restSeconds,

        @Positive(
                message = "El orden debe ser mayor que cero"
        )
        Integer exerciseOrder,

        @Size(max = 5000)
        String instructions,

        Boolean active
) {
}
