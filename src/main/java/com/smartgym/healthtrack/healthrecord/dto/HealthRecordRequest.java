package com.smartgym.healthtrack.healthrecord.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record HealthRecordRequest(

        @NotNull(message = "El deportista es obligatorio")
        Long memberId,

        @Size(max = 5000)
        String medicalHistory,

        @Size(max = 5000)
        String allergies,

        @Size(max = 5000)
        String injuries,

        @Size(max = 5000)
        String medications,

        @Size(max = 5000)
        String physicalRestrictions,

        @Size(max = 5000)
        String clinicalObservations,

        @PastOrPresent(
                message = "La fecha de apertura no puede ser futura"
        )
        LocalDate openedAt,

        Boolean active
) {
}
