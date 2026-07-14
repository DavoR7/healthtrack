package com.smartgym.healthtrack.clinical.assessment.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PhysicalAssessmentRequest(

        @NotNull(message = "El deportista es obligatorio")
        Long memberId,

        @PastOrPresent(
                message = "La fecha no puede ser futura"
        )
        LocalDate assessmentDate,

        @Positive(message = "El peso debe ser mayor que cero")
        BigDecimal weightKg,

        @Positive(message = "La estatura debe ser mayor que cero")
        BigDecimal heightCm,

        @DecimalMin(value = "0.0")
        @DecimalMax(value = "100.0")
        BigDecimal bodyFatPercentage,

        @Positive
        BigDecimal muscleMassKg,

        @Positive
        BigDecimal waistCircumferenceCm,

        @Positive
        Integer restingHeartRate,

        @Positive
        Integer systolicPressure,

        @Positive
        Integer diastolicPressure,

        @DecimalMin(value = "0.0")
        @DecimalMax(value = "100.0")
        BigDecimal oxygenSaturation,

        @Size(max = 5000)
        String observations,

        Boolean active
) {
}
