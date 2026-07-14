package com.smartgym.healthtrack.healthrecord.model;

import com.smartgym.healthtrack.members.model.Member;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_records")
public class HealthRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "member_id",
            nullable = false,
            unique = true
    )
    private Member member;

    @Column(name = "medical_history", columnDefinition = "TEXT")
    private String medicalHistory;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(columnDefinition = "TEXT")
    private String injuries;

    @Column(columnDefinition = "TEXT")
    private String medications;

    @Column(name = "physical_restrictions", columnDefinition = "TEXT")
    private String physicalRestrictions;

    @Column(name = "clinical_observations", columnDefinition = "TEXT")
    private String clinicalObservations;

    @Column(name = "opened_at", nullable = false)
    private LocalDate openedAt;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public HealthRecord() {
    }

    @PrePersist
    public void prePersist() {
        if (openedAt == null) {
            openedAt = LocalDate.now();
        }

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        if (active == null) {
            active = true;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Member getMember() {
        return member;
    }

    public String getMedicalHistory() {
        return medicalHistory;
    }

    public String getAllergies() {
        return allergies;
    }

    public String getInjuries() {
        return injuries;
    }

    public String getMedications() {
        return medications;
    }

    public String getPhysicalRestrictions() {
        return physicalRestrictions;
    }

    public String getClinicalObservations() {
        return clinicalObservations;
    }

    public LocalDate getOpenedAt() {
        return openedAt;
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

    public void setMedicalHistory(String medicalHistory) {
        this.medicalHistory = medicalHistory;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public void setInjuries(String injuries) {
        this.injuries = injuries;
    }

    public void setMedications(String medications) {
        this.medications = medications;
    }

    public void setPhysicalRestrictions(String physicalRestrictions) {
        this.physicalRestrictions = physicalRestrictions;
    }

    public void setClinicalObservations(String clinicalObservations) {
        this.clinicalObservations = clinicalObservations;
    }

    public void setOpenedAt(LocalDate openedAt) {
        this.openedAt = openedAt;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
