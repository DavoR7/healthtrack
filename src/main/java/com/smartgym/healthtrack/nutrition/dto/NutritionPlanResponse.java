package com.smartgym.healthtrack.nutrition.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record NutritionPlanResponse(
        Long id,
        Long memberId,
        String memberIdentification,
        String memberFullName,
        String name,
        String objective,
        LocalDate startDate,
        LocalDate endDate,
        Integer dailyCalories,
        BigDecimal proteinGrams,
        BigDecimal carbohydrateGrams,
        BigDecimal fatGrams,
        BigDecimal dailyWaterLiters,
        String observations,
        Boolean active,
        Integer mealCount,
        Integer totalMealCalories,
        List<NutritionMealResponse> meals,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
