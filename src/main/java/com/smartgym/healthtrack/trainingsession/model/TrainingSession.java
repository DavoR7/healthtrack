package com.smartgym.healthtrack.trainingsession.model;

import com.smartgym.healthtrack.members.model.Member;
import com.smartgym.healthtrack.training.model.TrainingRoutine;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "training_sessions")
public class TrainingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routine_id")
    private TrainingRoutine routine;

    @Column(name = "session_date", nullable = false)
    private LocalDate sessionDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false, length = 40)
    private ActivityType activityType = ActivityType.FUERZA;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    private Integer steps;

    @Column(name = "distance_km", precision = 8, scale = 2)
    private BigDecimal distanceKm;

    @Column(name = "cardio_minutes")
    private Integer cardioMinutes;

    @Column(name = "calories_burned")
    private Integer caloriesBurned;

    @Column(name = "floors_climbed")
    private Integer floorsClimbed;

    @Column(name = "average_heart_rate")
    private Integer averageHeartRate;

    @Column(name = "maximum_heart_rate")
    private Integer maximumHeartRate;

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

    @OneToMany(
            mappedBy = "trainingSession",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("exerciseOrder ASC")
    private List<PerformedExercise> performedExercises =
            new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public TrainingSession() {
    }

    @PrePersist
    public void prePersist() {
        if (sessionDate == null) {
            sessionDate = LocalDate.now();
        }

        if (activityType == null) {
            activityType = ActivityType.FUERZA;
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

    public void addPerformedExercise(
            PerformedExercise performedExercise
    ) {
        performedExercises.add(performedExercise);
        performedExercise.setTrainingSession(this);
    }

    public void clearPerformedExercises() {
        performedExercises.clear();
    }

    public Long getId() {
        return id;
    }

    public Member getMember() {
        return member;
    }

    public TrainingRoutine getRoutine() {
        return routine;
    }

    public LocalDate getSessionDate() {
        return sessionDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public ActivityType getActivityType() {
        return activityType;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public Integer getSteps() {
        return steps;
    }

    public BigDecimal getDistanceKm() {
        return distanceKm;
    }

    public Integer getCardioMinutes() {
        return cardioMinutes;
    }

    public Integer getCaloriesBurned() {
        return caloriesBurned;
    }

    public Integer getFloorsClimbed() {
        return floorsClimbed;
    }

    public Integer getAverageHeartRate() {
        return averageHeartRate;
    }

    public Integer getMaximumHeartRate() {
        return maximumHeartRate;
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

    public List<PerformedExercise> getPerformedExercises() {
        return performedExercises;
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

    public void setRoutine(TrainingRoutine routine) {
        this.routine = routine;
    }

    public void setSessionDate(LocalDate sessionDate) {
        this.sessionDate = sessionDate;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public void setActivityType(ActivityType activityType) {
        this.activityType = activityType;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public void setSteps(Integer steps) {
        this.steps = steps;
    }

    public void setDistanceKm(BigDecimal distanceKm) {
        this.distanceKm = distanceKm;
    }

    public void setCardioMinutes(Integer cardioMinutes) {
        this.cardioMinutes = cardioMinutes;
    }

    public void setCaloriesBurned(Integer caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
    }

    public void setFloorsClimbed(Integer floorsClimbed) {
        this.floorsClimbed = floorsClimbed;
    }

    public void setAverageHeartRate(
            Integer averageHeartRate
    ) {
        this.averageHeartRate = averageHeartRate;
    }

    public void setMaximumHeartRate(
            Integer maximumHeartRate
    ) {
        this.maximumHeartRate = maximumHeartRate;
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
}
