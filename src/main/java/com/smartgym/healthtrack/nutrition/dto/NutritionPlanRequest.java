package com.smartgym.healthtrack.nutrition.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record NutritionPlanRequest(

        @NotNull(message = "El deportista es obligatorio")
        Long memberId,

        @NotBlank(message = "El nombre del plan es obligatorio")
        @Size(max = 150)
        String name,

        @Size(max = 250)
        String objective,

        LocalDate startDate,

        LocalDate endDate,

        @Min(
                value = 1,
                message = "Las calorías diarias deben ser mayores que cero"
        )
        Integer dailyCalories,

        @DecimalMin(
                value = "0.0",
                message = "Las proteínas no pueden ser negativas"
        )
        BigDecimal proteinGrams,

        @DecimalMin(
                value = "0.0",
                message = "Los carbohidratos no pueden ser negativos"
        )
        BigDecimal carbohydrateGrams,

        @DecimalMin(
                value = "0.0",
                message = "Las grasas no pueden ser negativas"
        )
        BigDecimal fatGrams,

        @DecimalMin(
                value = "0.0",
                message = "El agua diaria no puede ser negativa"
        )
        BigDecimal dailyWaterLiters,

        @Size(max = 5000)
        String observations,

        Boolean active,

        @Valid
        List<NutritionMealRequest> meals
) {
}
