package com.smartgym.healthtrack.training.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "routine_exercises")
public class RoutineExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "routine_id", nullable = false)
    private TrainingRoutine routine;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "muscle_group", length = 100)
    private String muscleGroup;

    @Column(name = "sets_count")
    private Integer setsCount;

    @Column(length = 50)
    private String repetitions;

    @Column(name = "load_kg", precision = 7, scale = 2)
    private BigDecimal loadKg;

    @Column(name = "rest_seconds")
    private Integer restSeconds;

    @Column(name = "exercise_order", nullable = false)
    private Integer exerciseOrder = 1;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public RoutineExercise() {
    }

    @PrePersist
    public void prePersist() {
        if (exerciseOrder == null) {
            exerciseOrder = 1;
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

    public TrainingRoutine getRoutine() {
        return routine;
    }

    public String getName() {
        return name;
    }

    public String getMuscleGroup() {
        return muscleGroup;
    }

    public Integer getSetsCount() {
        return setsCount;
    }

    public String getRepetitions() {
        return repetitions;
    }

    public BigDecimal getLoadKg() {
        return loadKg;
    }

    public Integer getRestSeconds() {
        return restSeconds;
    }

    public Integer getExerciseOrder() {
        return exerciseOrder;
    }

    public String getInstructions() {
        return instructions;
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

    public void setRoutine(TrainingRoutine routine) {
        this.routine = routine;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setMuscleGroup(String muscleGroup) {
        this.muscleGroup = muscleGroup;
    }

    public void setSetsCount(Integer setsCount) {
        this.setsCount = setsCount;
    }

    public void setRepetitions(String repetitions) {
        this.repetitions = repetitions;
    }

    public void setLoadKg(BigDecimal loadKg) {
        this.loadKg = loadKg;
    }

    public void setRestSeconds(Integer restSeconds) {
        this.restSeconds = restSeconds;
    }

    public void setExerciseOrder(Integer exerciseOrder) {
        this.exerciseOrder = exerciseOrder;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
