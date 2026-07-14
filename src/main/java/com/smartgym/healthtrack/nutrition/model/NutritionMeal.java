package com.smartgym.healthtrack.nutrition.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "nutrition_meals")
public class NutritionMeal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "nutrition_plan_id",
            nullable = false
    )
    private NutritionPlan nutritionPlan;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(name = "suggested_time")
    private LocalTime suggestedTime;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer calories;

    @Column(
            name = "protein_grams",
            precision = 7,
            scale = 2
    )
    private BigDecimal proteinGrams;

    @Column(
            name = "carbohydrate_grams",
            precision = 7,
            scale = 2
    )
    private BigDecimal carbohydrateGrams;

    @Column(
            name = "fat_grams",
            precision = 7,
            scale = 2
    )
    private BigDecimal fatGrams;

    @Column(name = "meal_order", nullable = false)
    private Integer mealOrder = 1;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public NutritionMeal() {
    }

    @PrePersist
    public void prePersist() {
        if (mealOrder == null) {
            mealOrder = 1;
        }

        if (active == null) {
            active = true;
        }

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public NutritionPlan getNutritionPlan() {
        return nutritionPlan;
    }

    public String getName() {
        return name;
    }

    public LocalTime getSuggestedTime() {
        return suggestedTime;
    }

    public String getDescription() {
        return description;
    }

    public Integer getCalories() {
        return calories;
    }

    public BigDecimal getProteinGrams() {
        return proteinGrams;
    }

    public BigDecimal getCarbohydrateGrams() {
        return carbohydrateGrams;
    }

    public BigDecimal getFatGrams() {
        return fatGrams;
    }

    public Integer getMealOrder() {
        return mealOrder;
    }

    public Boolean getActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setNutritionPlan(
            NutritionPlan nutritionPlan
    ) {
        this.nutritionPlan = nutritionPlan;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSuggestedTime(
            LocalTime suggestedTime
    ) {
        this.suggestedTime = suggestedTime;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCalories(Integer calories) {
        this.calories = calories;
    }

    public void setProteinGrams(
            BigDecimal proteinGrams
    ) {
        this.proteinGrams = proteinGrams;
    }

    public void setCarbohydrateGrams(
            BigDecimal carbohydrateGrams
    ) {
        this.carbohydrateGrams =
                carbohydrateGrams;
    }

    public void setFatGrams(BigDecimal fatGrams) {
        this.fatGrams = fatGrams;
    }

    public void setMealOrder(Integer mealOrder) {
        this.mealOrder = mealOrder;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
