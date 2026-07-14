package com.smartgym.healthtrack.trainingsession.model;

import com.smartgym.healthtrack.training.model.RoutineExercise;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "performed_exercises")
public class PerformedExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "training_session_id",
            nullable = false
    )
    private TrainingSession trainingSession;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routine_exercise_id")
    private RoutineExercise routineExercise;

    @Column(
            name = "exercise_name",
            nullable = false,
            length = 150
    )
    private String exerciseName;

    @Column(name = "exercise_type", length = 40)
    private String exerciseType;

    @Column(name = "sets_completed")
    private Integer setsCompleted;

    @Column(
            name = "repetitions_completed",
            length = 50
    )
    private String repetitionsCompleted;

    @Column(name = "weight_kg", precision = 8, scale = 2)
    private BigDecimal weightKg;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "distance_km", precision = 8, scale = 2)
    private BigDecimal distanceKm;

    @Column(name = "calories_burned")
    private Integer caloriesBurned;

    @Column(name = "average_heart_rate")
    private Integer averageHeartRate;

    @Column(name = "effort_level")
    private Integer effortLevel;

    @Column(name = "pain_level")
    private Integer painLevel;

    @Column(nullable = false)
    private Boolean completed = false;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @Column(name = "exercise_order", nullable = false)
    private Integer exerciseOrder = 1;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public PerformedExercise() {
    }

    @PrePersist
    public void prePersist() {
        if (exerciseOrder == null) {
            exerciseOrder = 1;
        }

        if (completed == null) {
            completed = false;
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

    public TrainingSession getTrainingSession() {
        return trainingSession;
    }

    public RoutineExercise getRoutineExercise() {
        return routineExercise;
    }

    public String getExerciseName() {
        return exerciseName;
    }

    public String getExerciseType() {
        return exerciseType;
    }

    public Integer getSetsCompleted() {
        return setsCompleted;
    }

    public String getRepetitionsCompleted() {
        return repetitionsCompleted;
    }

    public BigDecimal getWeightKg() {
        return weightKg;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public BigDecimal getDistanceKm() {
        return distanceKm;
    }

    public Integer getCaloriesBurned() {
        return caloriesBurned;
    }

    public Integer getAverageHeartRate() {
        return averageHeartRate;
    }

    public Integer getEffortLevel() {
        return effortLevel;
    }

    public Integer getPainLevel() {
        return painLevel;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public Boolean getActive() {
        return active;
    }

    public String getObservations() {
        return observations;
    }

    public Integer getExerciseOrder() {
        return exerciseOrder;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setTrainingSession(
            TrainingSession trainingSession
    ) {
        this.trainingSession = trainingSession;
    }

    public void setRoutineExercise(
            RoutineExercise routineExercise
    ) {
        this.routineExercise = routineExercise;
    }

    public void setExerciseName(String exerciseName) {
        this.exerciseName = exerciseName;
    }

    public void setExerciseType(String exerciseType) {
        this.exerciseType = exerciseType;
    }

    public void setSetsCompleted(Integer setsCompleted) {
        this.setsCompleted = setsCompleted;
    }

    public void setRepetitionsCompleted(
            String repetitionsCompleted
    ) {
        this.repetitionsCompleted =
                repetitionsCompleted;
    }

    public void setWeightKg(BigDecimal weightKg) {
        this.weightKg = weightKg;
    }

    public void setDurationMinutes(
            Integer durationMinutes
    ) {
        this.durationMinutes = durationMinutes;
    }

    public void setDistanceKm(BigDecimal distanceKm) {
        this.distanceKm = distanceKm;
    }

    public void setCaloriesBurned(
            Integer caloriesBurned
    ) {
        this.caloriesBurned = caloriesBurned;
    }

    public void setAverageHeartRate(
            Integer averageHeartRate
    ) {
        this.averageHeartRate = averageHeartRate;
    }

    public void setEffortLevel(Integer effortLevel) {
        this.effortLevel = effortLevel;
    }

    public void setPainLevel(Integer painLevel) {
        this.painLevel = painLevel;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }

    public void setExerciseOrder(Integer exerciseOrder) {
        this.exerciseOrder = exerciseOrder;
    }
}
