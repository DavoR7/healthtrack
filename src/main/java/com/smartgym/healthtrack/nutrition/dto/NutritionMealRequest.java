package com.smartgym.healthtrack.nutrition.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalTime;

public record NutritionMealRequest(

        @NotBlank(message = "El nombre de la comida es obligatorio")
        @Size(max = 120)
        String name,

        LocalTime suggestedTime,

        @Size(max = 5000)
        String description,

        @PositiveOrZero(
                message = "Las calorías no pueden ser negativas"
        )
        Integer calories,

        @PositiveOrZero
        BigDecimal proteinGrams,

        @PositiveOrZero
        BigDecimal carbohydrateGrams,

        @PositiveOrZero
        BigDecimal fatGrams,

        @Positive(
                message = "El orden debe ser mayor que cero"
        )
        Integer mealOrder,

        Boolean active
) {
}
