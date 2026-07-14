package com.smartgym.healthtrack.nutrition.service;

import com.smartgym.healthtrack.nutrition.dto.NutritionPlanRequest;
import com.smartgym.healthtrack.nutrition.dto.NutritionPlanResponse;

import java.util.List;

public interface NutritionPlanService {

    List<NutritionPlanResponse> findAll(Boolean active);

    List<NutritionPlanResponse> findByMemberId(
            Long memberId,
            Boolean active
    );

    NutritionPlanResponse findById(Long id);

    NutritionPlanResponse create(
            NutritionPlanRequest request
    );

    NutritionPlanResponse update(
            Long id,
            NutritionPlanRequest request
    );

    void deactivate(Long id);
}
