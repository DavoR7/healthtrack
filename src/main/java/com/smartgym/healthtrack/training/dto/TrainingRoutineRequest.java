package com.smartgym.healthtrack.training.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public record TrainingRoutineRequest(

        @NotNull(message = "El deportista es obligatorio")
        Long memberId,

        @NotBlank(message = "El nombre de la rutina es obligatorio")
        @Size(max = 150)
        String name,

        @Size(max = 250)
        String objective,

        @Size(max = 30)
        String level,

        LocalDate startDate,

        @FutureOrPresent(
                message = "La fecha de finalización no puede ser anterior a hoy"
        )
        LocalDate endDate,

        @Min(value = 1, message = "Debe entrenar al menos un día por semana")
        @Max(value = 7, message = "No puede superar siete días por semana")
        Integer daysPerWeek,

        @Min(
                value = 1,
                message = "La duración estimada debe ser mayor que cero"
        )
        Integer estimatedDurationMinutes,

        @Size(max = 5000)
        String observations,

        Boolean active,

        @Valid
        List<RoutineExerciseRequest> exercises
) {
}
