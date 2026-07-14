package com.smartgym.healthtrack.trainingsession.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record PerformedExerciseRequest(

        Long routineExerciseId,

        @NotBlank(
                message = "El nombre del ejercicio es obligatorio"
        )
        @Size(
                max = 150,
                message = "El nombre no puede superar 150 caracteres"
        )
        String exerciseName,

        @Size(
                max = 40,
                message = "El tipo no puede superar 40 caracteres"
        )
        String exerciseType,

        @PositiveOrZero(
                message = "Las series no pueden ser negativas"
        )
        Integer setsCompleted,

        @Size(
                max = 50,
                message = "Las repeticiones no pueden superar 50 caracteres"
        )
        String repetitionsCompleted,

        @PositiveOrZero(
                message = "El peso no puede ser negativo"
        )
        BigDecimal weightKg,

        @PositiveOrZero(
                message = "La duración no puede ser negativa"
        )
        Integer durationMinutes,

        @PositiveOrZero(
                message = "La distancia no puede ser negativa"
        )
        BigDecimal distanceKm,

        @PositiveOrZero(
                message = "Las calorías no pueden ser negativas"
        )
        Integer caloriesBurned,

        @Positive(
                message = "La frecuencia cardíaca debe ser mayor que cero"
        )
        Integer averageHeartRate,

        @Min(
                value = 1,
                message = "El esfuerzo mínimo es 1"
        )
        @Max(
                value = 10,
                message = "El esfuerzo máximo es 10"
        )
        Integer effortLevel,

        @Min(
                value = 0,
                message = "El dolor mínimo es 0"
        )
        @Max(
                value = 10,
                message = "El dolor máximo es 10"
        )
        Integer painLevel,

        Boolean completed,

        Boolean active,

        @Size(
                max = 5000,
                message = "Las observaciones son demasiado extensas"
        )
        String observations,

        @Positive(
                message = "El orden debe ser mayor que cero"
        )
        Integer exerciseOrder
) {
}
