package com.smartgym.healthtrack.identity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RoleRequest(

        @NotBlank(message = "El código es obligatorio")
        @Size(max = 50, message = "El código no puede superar 50 caracteres")
        String code,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
        String name,

        @Size(max = 255, message = "La descripción no puede superar 255 caracteres")
        String description,

        Boolean active
) {
}