package com.smartgym.healthtrack.training.model;

import com.smartgym.healthtrack.members.model.Member;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "training_routines")
public class TrainingRoutine {

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

    @Column(length = 30)
    private String level;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "days_per_week")
    private Integer daysPerWeek;

    @Column(name = "estimated_duration_minutes")
    private Integer estimatedDurationMinutes;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @Column(nullable = false)
    private Boolean active = true;

    @OneToMany(
            mappedBy = "routine",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("exerciseOrder ASC")
    private List<RoutineExercise> exercises =
            new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public TrainingRoutine() {
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

    public void addExercise(RoutineExercise exercise) {
        exercises.add(exercise);
        exercise.setRoutine(this);
    }

    public void clearExercises() {
        exercises.clear();
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

    public String getLevel() {
        return level;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public Integer getDaysPerWeek() {
        return daysPerWeek;
    }

    public Integer getEstimatedDurationMinutes() {
        return estimatedDurationMinutes;
    }

    public String getObservations() {
        return observations;
    }

    public Boolean getActive() {
        return active;
    }

    public List<RoutineExercise> getExercises() {
        return exercises;
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

    public void setLevel(String level) {
        this.level = level;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public void setDaysPerWeek(Integer daysPerWeek) {
        this.daysPerWeek = daysPerWeek;
    }

    public void setEstimatedDurationMinutes(
            Integer estimatedDurationMinutes
    ) {
        this.estimatedDurationMinutes =
                estimatedDurationMinutes;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
