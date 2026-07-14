package com.smartgym.healthtrack.clinical.assessment.model;

import com.smartgym.healthtrack.members.model.Member;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "physical_assessments")
public class PhysicalAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "assessment_date", nullable = false)
    private LocalDate assessmentDate;

    @Column(name = "weight_kg", precision = 6, scale = 2)
    private BigDecimal weightKg;

    @Column(name = "height_cm", precision = 6, scale = 2)
    private BigDecimal heightCm;

    @Column(precision = 6, scale = 2)
    private BigDecimal bmi;

    @Column(
            name = "body_fat_percentage",
            precision = 5,
            scale = 2
    )
    private BigDecimal bodyFatPercentage;

    @Column(
            name = "muscle_mass_kg",
            precision = 6,
            scale = 2
    )
    private BigDecimal muscleMassKg;

    @Column(
            name = "waist_circumference_cm",
            precision = 6,
            scale = 2
    )
    private BigDecimal waistCircumferenceCm;

    @Column(name = "resting_heart_rate")
    private Integer restingHeartRate;

    @Column(name = "systolic_pressure")
    private Integer systolicPressure;

    @Column(name = "diastolic_pressure")
    private Integer diastolicPressure;

    @Column(
            name = "oxygen_saturation",
            precision = 5,
            scale = 2
    )
    private BigDecimal oxygenSaturation;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public PhysicalAssessment() {
    }

    @PrePersist
    public void prePersist() {
        if (assessmentDate == null) {
            assessmentDate = LocalDate.now();
        }

        if (active == null) {
            active = true;
        }

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        calculateBmi();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
        calculateBmi();
    }

    public void calculateBmi() {
        if (
                weightKg == null
                || heightCm == null
                || heightCm.compareTo(BigDecimal.ZERO) <= 0
        ) {
            bmi = null;
            return;
        }

        BigDecimal heightMeters = heightCm
                .divide(
                        BigDecimal.valueOf(100),
                        4,
                        java.math.RoundingMode.HALF_UP
                );

        bmi = weightKg.divide(
                heightMeters.multiply(heightMeters),
                2,
                java.math.RoundingMode.HALF_UP
        );
    }

    public Long getId() {
        return id;
    }

    public Member getMember() {
        return member;
    }

    public LocalDate getAssessmentDate() {
        return assessmentDate;
    }

    public BigDecimal getWeightKg() {
        return weightKg;
    }

    public BigDecimal getHeightCm() {
        return heightCm;
    }

    public BigDecimal getBmi() {
        return bmi;
    }

    public BigDecimal getBodyFatPercentage() {
        return bodyFatPercentage;
    }

    public BigDecimal getMuscleMassKg() {
        return muscleMassKg;
    }

    public BigDecimal getWaistCircumferenceCm() {
        return waistCircumferenceCm;
    }

    public Integer getRestingHeartRate() {
        return restingHeartRate;
    }

    public Integer getSystolicPressure() {
        return systolicPressure;
    }

    public Integer getDiastolicPressure() {
        return diastolicPressure;
    }

    public BigDecimal getOxygenSaturation() {
        return oxygenSaturation;
    }

    public String getObservations() {
        return observations;
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

    public void setMember(Member member) {
        this.member = member;
    }

    public void setAssessmentDate(LocalDate assessmentDate) {
        this.assessmentDate = assessmentDate;
    }

    public void setWeightKg(BigDecimal weightKg) {
        this.weightKg = weightKg;
    }

    public void setHeightCm(BigDecimal heightCm) {
        this.heightCm = heightCm;
    }

    public void setBodyFatPercentage(
            BigDecimal bodyFatPercentage
    ) {
        this.bodyFatPercentage = bodyFatPercentage;
    }

    public void setMuscleMassKg(BigDecimal muscleMassKg) {
        this.muscleMassKg = muscleMassKg;
    }

    public void setWaistCircumferenceCm(
            BigDecimal waistCircumferenceCm
    ) {
        this.waistCircumferenceCm =
                waistCircumferenceCm;
    }

    public void setRestingHeartRate(
            Integer restingHeartRate
    ) {
        this.restingHeartRate = restingHeartRate;
    }

    public void setSystolicPressure(
            Integer systolicPressure
    ) {
        this.systolicPressure = systolicPressure;
    }

    public void setDiastolicPressure(
            Integer diastolicPressure
    ) {
        this.diastolicPressure = diastolicPressure;
    }

    public void setOxygenSaturation(
            BigDecimal oxygenSaturation
    ) {
        this.oxygenSaturation = oxygenSaturation;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
