package com.smartgym.healthtrack.nutrition.service.impl;

import com.smartgym.healthtrack.members.model.Member;
import com.smartgym.healthtrack.members.repository.MemberRepository;
import com.smartgym.healthtrack.nutrition.dto.NutritionMealRequest;
import com.smartgym.healthtrack.nutrition.dto.NutritionMealResponse;
import com.smartgym.healthtrack.nutrition.dto.NutritionPlanRequest;
import com.smartgym.healthtrack.nutrition.dto.NutritionPlanResponse;
import com.smartgym.healthtrack.nutrition.model.NutritionMeal;
import com.smartgym.healthtrack.nutrition.model.NutritionPlan;
import com.smartgym.healthtrack.nutrition.repository.NutritionPlanRepository;
import com.smartgym.healthtrack.nutrition.service.NutritionPlanService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class NutritionPlanServiceImpl
        implements NutritionPlanService {

    private final NutritionPlanRepository nutritionPlanRepository;
    private final MemberRepository memberRepository;

    public NutritionPlanServiceImpl(
            NutritionPlanRepository nutritionPlanRepository,
            MemberRepository memberRepository
    ) {
        this.nutritionPlanRepository = nutritionPlanRepository;
        this.memberRepository = memberRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<NutritionPlanResponse> findAll(Boolean active) {
        List<NutritionPlan> plans = active == null
                ? nutritionPlanRepository.findAllByOrderByStartDateDesc()
                : nutritionPlanRepository.findByActiveOrderByStartDateDesc(
                        active
                );

        return plans.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NutritionPlanResponse> findByMemberId(
            Long memberId,
            Boolean active
    ) {
        findMemberById(memberId);

        List<NutritionPlan> plans = active == null
                ? nutritionPlanRepository
                    .findByMemberIdOrderByStartDateDesc(memberId)
                : nutritionPlanRepository
                    .findByMemberIdAndActiveOrderByStartDateDesc(
                            memberId,
                            active
                    );

        return plans.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public NutritionPlanResponse findById(Long id) {
        return toResponse(findEntityById(id));
    }

    @Override
    public NutritionPlanResponse create(
            NutritionPlanRequest request
    ) {
        Member member = findMemberById(request.memberId());

        validateDates(
                request.startDate(),
                request.endDate()
        );

        NutritionPlan plan = new NutritionPlan();

        plan.setMember(member);

        applyRequest(plan, request);
        replaceMeals(plan, request.meals());

        NutritionPlan saved =
                nutritionPlanRepository.save(plan);

        return toResponse(saved);
    }

    @Override
    public NutritionPlanResponse update(
            Long id,
            NutritionPlanRequest request
    ) {
        NutritionPlan plan = findEntityById(id);
        Member member = findMemberById(request.memberId());

        validateDates(
                request.startDate(),
                request.endDate()
        );

        plan.setMember(member);

        applyRequest(plan, request);
        replaceMeals(plan, request.meals());

        NutritionPlan updated =
                nutritionPlanRepository.save(plan);

        return toResponse(updated);
    }

    @Override
    public void deactivate(Long id) {
        NutritionPlan plan = findEntityById(id);

        plan.setActive(false);

        nutritionPlanRepository.save(plan);
    }

    private NutritionPlan findEntityById(Long id) {
        return nutritionPlanRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No se encontró el plan nutricional con ID: "
                                        + id
                        )
                );
    }

    private Member findMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No se encontró el deportista con ID: "
                                        + memberId
                        )
                );
    }

    private void applyRequest(
            NutritionPlan plan,
            NutritionPlanRequest request
    ) {
        plan.setName(request.name().trim());

        plan.setObjective(
                normalizeOptional(request.objective())
        );

        plan.setStartDate(
                request.startDate() == null
                        ? LocalDate.now()
                        : request.startDate()
        );

        plan.setEndDate(request.endDate());
        plan.setDailyCalories(request.dailyCalories());
        plan.setProteinGrams(request.proteinGrams());

        plan.setCarbohydrateGrams(
                request.carbohydrateGrams()
        );

        plan.setFatGrams(request.fatGrams());

        plan.setDailyWaterLiters(
                request.dailyWaterLiters()
        );

        plan.setObservations(
                normalizeOptional(request.observations())
        );

        if (request.active() != null) {
            plan.setActive(request.active());
        }
    }

    private void replaceMeals(
            NutritionPlan plan,
            List<NutritionMealRequest> requests
    ) {
        plan.clearMeals();

        if (requests == null || requests.isEmpty()) {
            return;
        }

        int automaticOrder = 1;

        for (NutritionMealRequest request : requests) {
            NutritionMeal meal = new NutritionMeal();

            meal.setName(request.name().trim());

            meal.setSuggestedTime(
                    request.suggestedTime()
            );

            meal.setDescription(
                    normalizeOptional(request.description())
            );

            meal.setCalories(request.calories());

            meal.setProteinGrams(
                    request.proteinGrams()
            );

            meal.setCarbohydrateGrams(
                    request.carbohydrateGrams()
            );

            meal.setFatGrams(request.fatGrams());

            meal.setMealOrder(
                    request.mealOrder() == null
                            ? automaticOrder
                            : request.mealOrder()
            );

            meal.setActive(
                    request.active() == null
                            || request.active()
            );

            plan.addMeal(meal);
            automaticOrder++;
        }
    }

    private void validateDates(
            LocalDate startDate,
            LocalDate endDate
    ) {
        LocalDate effectiveStartDate = startDate == null
                ? LocalDate.now()
                : startDate;

        if (
                endDate != null
                && endDate.isBefore(effectiveStartDate)
        ) {
            throw new IllegalArgumentException(
                    "La fecha final no puede ser anterior "
                            + "a la fecha inicial"
            );
        }
    }

    private String normalizeOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private NutritionPlanResponse toResponse(
            NutritionPlan plan
    ) {
        Member member = plan.getMember();

        List<NutritionMealResponse> meals =
                plan.getMeals()
                        .stream()
                        .sorted(
                                Comparator.comparing(
                                        NutritionMeal::getMealOrder
                                )
                        )
                        .map(this::toMealResponse)
                        .toList();

        int totalMealCalories = meals.stream()
                .map(NutritionMealResponse::calories)
                .filter(value -> value != null)
                .mapToInt(Integer::intValue)
                .sum();

        return new NutritionPlanResponse(
                plan.getId(),
                member.getId(),
                member.getIdentification(),
                member.getFirstName()
                        + " "
                        + member.getLastName(),
                plan.getName(),
                plan.getObjective(),
                plan.getStartDate(),
                plan.getEndDate(),
                plan.getDailyCalories(),
                plan.getProteinGrams(),
                plan.getCarbohydrateGrams(),
                plan.getFatGrams(),
                plan.getDailyWaterLiters(),
                plan.getObservations(),
                plan.getActive(),
                meals.size(),
                totalMealCalories,
                meals,
                plan.getCreatedAt(),
                plan.getUpdatedAt()
        );
    }

    private NutritionMealResponse toMealResponse(
            NutritionMeal meal
    ) {
        return new NutritionMealResponse(
                meal.getId(),
                meal.getName(),
                meal.getSuggestedTime(),
                meal.getDescription(),
                meal.getCalories(),
                meal.getProteinGrams(),
                meal.getCarbohydrateGrams(),
                meal.getFatGrams(),
                meal.getMealOrder(),
                meal.getActive()
        );
    }
}
