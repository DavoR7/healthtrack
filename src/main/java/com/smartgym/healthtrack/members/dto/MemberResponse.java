package com.smartgym.healthtrack.members.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record MemberResponse(
        Long id,
        String identification,
        String firstName,
        String lastName,
        String fullName,
        String gender,
        LocalDate birthDate,
        Integer age,
        String email,
        String phone,
        String address,
        String bloodType,
        String emergencyContactName,
        String emergencyContactPhone,
        String photoUrl,
        Boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}