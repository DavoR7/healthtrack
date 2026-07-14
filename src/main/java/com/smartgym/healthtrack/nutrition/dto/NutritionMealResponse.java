package com.smartgym.healthtrack.nutrition.dto;

import java.math.BigDecimal;
import java.time.LocalTime;

public record NutritionMealResponse(
        Long id,
        String name,
        LocalTime suggestedTime,
        String description,
        Integer calories,
        BigDecimal proteinGrams,
        BigDecimal carbohydrateGrams,
        BigDecimal fatGrams,
        Integer mealOrder,
        Boolean active
) {
}
