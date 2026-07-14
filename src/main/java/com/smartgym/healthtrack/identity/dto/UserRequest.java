package com.smartgym.healthtrack.identity.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record UserRequest(

        @NotBlank(message = "El nombre de usuario es obligatorio")
        @Size(min = 4, max = 60,
                message = "El usuario debe contener entre 4 y 60 caracteres")
        String username,

        @NotBlank(message = "El correo electrónico es obligatorio")
        @Email(message = "El correo electrónico no tiene un formato válido")
        @Size(max = 150)
        String email,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 8, max = 100,
                message = "La contraseña debe contener al menos 8 caracteres")
        String password,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100)
        String firstName,

        @NotBlank(message = "El apellido es obligatorio")
        @Size(max = 100)
        String lastName,

        @NotEmpty(message = "Debe seleccionar al menos un rol")
        Set<Long> roleIds,

        Boolean active,

        Boolean locked
) {
}