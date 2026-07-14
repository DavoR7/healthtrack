package com.smartgym.healthtrack.identity.dto;

public record RoleResponse(
        Long id,
        String code,
        String name,
        String description,
        Boolean active
) {
}