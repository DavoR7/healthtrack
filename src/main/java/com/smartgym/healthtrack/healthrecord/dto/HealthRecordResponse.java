package com.smartgym.healthtrack.healthrecord.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record HealthRecordResponse(
        Long id,
        Long memberId,
        String memberIdentification,
        String memberFullName,
        String memberBloodType,
        Integer memberAge,
        String memberEmail,
        String memberPhone,
        String medicalHistory,
        String allergies,
        String injuries,
        String medications,
        String physicalRestrictions,
        String clinicalObservations,
        LocalDate openedAt,
        Boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
