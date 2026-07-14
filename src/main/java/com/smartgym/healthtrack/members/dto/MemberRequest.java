package com.smartgym.healthtrack.members.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record MemberRequest(

        @NotBlank(message = "La identificación es obligatoria")
        @Size(max = 20)
        String identification,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100)
        String firstName,

        @NotBlank(message = "El apellido es obligatorio")
        @Size(max = 100)
        String lastName,

        @Size(max = 20)
        String gender,

        @Past(message = "La fecha de nacimiento debe ser anterior a la fecha actual")
        LocalDate birthDate,

        @Email(message = "El correo no tiene un formato válido")
        @Size(max = 150)
        String email,

        @Size(max = 30)
        String phone,

        @Size(max = 255)
        String address,

        @Size(max = 5)
        String bloodType,

        @Size(max = 150)
        String emergencyContactName,

        @Size(max = 30)
        String emergencyContactPhone,

        @Size(max = 500)
        String photoUrl,

        Boolean active
) {
}
