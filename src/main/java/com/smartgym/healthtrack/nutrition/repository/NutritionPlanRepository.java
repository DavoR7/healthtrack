package com.smartgym.healthtrack.nutrition.repository;

import com.smartgym.healthtrack.nutrition.model.NutritionPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NutritionPlanRepository
        extends JpaRepository<NutritionPlan, Long> {

    List<NutritionPlan> findAllByOrderByStartDateDesc();

    List<NutritionPlan> findByActiveOrderByStartDateDesc(
            Boolean active
    );

    List<NutritionPlan> findByMemberIdOrderByStartDateDesc(
            Long memberId
    );

    List<NutritionPlan>
    findByMemberIdAndActiveOrderByStartDateDesc(
            Long memberId,
            Boolean active
    );
}
