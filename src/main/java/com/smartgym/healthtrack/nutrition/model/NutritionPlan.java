package com.smartgym.healthtrack.nutrition.model;

import com.smartgym.healthtrack.members.model.Member;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "nutrition_plans")
public class NutritionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 250)
    private String objective;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "daily_calories")
    private Integer dailyCalories;

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

    @Column(
            name = "daily_water_liters",
            precision = 5,
            scale = 2
    )
    private BigDecimal dailyWaterLiters;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @Column(nullable = false)
    private Boolean active = true;

    @OneToMany(
            mappedBy = "nutritionPlan",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("mealOrder ASC")
    private List<NutritionMeal> meals =
            new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public NutritionPlan() {
    }

    @PrePersist
    public void prePersist() {
        if (startDate == null) {
            startDate = LocalDate.now();
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

    public void addMeal(NutritionMeal meal) {
        meals.add(meal);
        meal.setNutritionPlan(this);
    }

    public void clearMeals() {
        meals.clear();
    }

    public Long getId() {
        return id;
    }

    public Member getMember() {
        return member;
    }

    public String getName() {
        return name;
    }

    public String getObjective() {
        return objective;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public Integer getDailyCalories() {
        return dailyCalories;
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

    public BigDecimal getDailyWaterLiters() {
        return dailyWaterLiters;
    }

    public String getObservations() {
        return observations;
    }

    public Boolean getActive() {
        return active;
    }

    public List<NutritionMeal> getMeals() {
        return meals;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setObjective(String objective) {
        this.objective = objective;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public void setDailyCalories(Integer dailyCalories) {
        this.dailyCalories = dailyCalories;
    }

    public void setProteinGrams(BigDecimal proteinGrams) {
        this.proteinGrams = proteinGrams;
    }

    public void setCarbohydrateGrams(
            BigDecimal carbohydrateGrams
    ) {
        this.carbohydrateGrams = carbohydrateGrams;
    }

    public void setFatGrams(BigDecimal fatGrams) {
        this.fatGrams = fatGrams;
    }

    public void setDailyWaterLiters(
            BigDecimal dailyWaterLiters
    ) {
        this.dailyWaterLiters = dailyWaterLiters;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
