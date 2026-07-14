package com.smartgym.healthtrack.clinical.assessment.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record PhysicalAssessmentResponse(
        Long id,
        Long memberId,
        String memberIdentification,
        String memberFullName,
        LocalDate assessmentDate,
        BigDecimal weightKg,
        BigDecimal heightCm,
        BigDecimal bmi,
        String bmiClassification,
        BigDecimal bodyFatPercentage,
        BigDecimal muscleMassKg,
        BigDecimal waistCircumferenceCm,
        Integer restingHeartRate,
        Integer systolicPressure,
        Integer diastolicPressure,
        BigDecimal oxygenSaturation,
        String observations,
        Boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
