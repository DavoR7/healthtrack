package com.smartgym.healthtrack.identity.dto;

import java.time.LocalDateTime;
import java.util.Set;

public record UserResponse(
        Long id,
        String username,
        String email,
        String firstName,
        String lastName,
        Boolean active,
        Boolean locked,
        Set<RoleResponse> roles,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}