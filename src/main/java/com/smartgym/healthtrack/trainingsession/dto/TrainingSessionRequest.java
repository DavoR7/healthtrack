package com.smartgym.healthtrack.trainingsession.dto;

import com.smartgym.healthtrack.trainingsession.model.ActivityType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record TrainingSessionRequest(

        @NotNull(
                message = "El deportista es obligatorio"
        )
        Long memberId,

        Long routineId,

        @PastOrPresent(
                message = "La fecha de la sesión no puede ser futura"
        )
        LocalDate sessionDate,

        LocalTime startTime,

        LocalTime endTime,

        @NotNull(
                message = "El tipo de actividad es obligatorio"
        )
        ActivityType activityType,

        @PositiveOrZero(
                message = "La duración no puede ser negativa"
        )
        Integer durationMinutes,

        @PositiveOrZero(
                message = "Los pasos no pueden ser negativos"
        )
        Integer steps,

        @PositiveOrZero(
                message = "La distancia no puede ser negativa"
        )
        BigDecimal distanceKm,

        @PositiveOrZero(
                message = "El tiempo de cardio no puede ser negativo"
        )
        Integer cardioMinutes,

        @PositiveOrZero(
                message = "Las calorías no pueden ser negativas"
        )
        Integer caloriesBurned,

        @PositiveOrZero(
                message = "Los pisos subidos no pueden ser negativos"
        )
        Integer floorsClimbed,

        @Positive(
                message = "La frecuencia cardíaca promedio debe ser positiva"
        )
        Integer averageHeartRate,

        @Positive(
                message = "La frecuencia cardíaca máxima debe ser positiva"
        )
        Integer maximumHeartRate,

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

        @Valid
        List<PerformedExerciseRequest> performedExercises
) {
}
