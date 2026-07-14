package com.smartgym.healthtrack.healthrecord.service.impl;

import com.smartgym.healthtrack.healthrecord.dto.HealthRecordRequest;
import com.smartgym.healthtrack.healthrecord.dto.HealthRecordResponse;
import com.smartgym.healthtrack.healthrecord.model.HealthRecord;
import com.smartgym.healthtrack.healthrecord.repository.HealthRecordRepository;
import com.smartgym.healthtrack.healthrecord.service.HealthRecordService;
import com.smartgym.healthtrack.members.model.Member;
import com.smartgym.healthtrack.members.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
@Transactional
public class HealthRecordServiceImpl implements HealthRecordService {

    private final HealthRecordRepository healthRecordRepository;
    private final MemberRepository memberRepository;

    public HealthRecordServiceImpl(
            HealthRecordRepository healthRecordRepository,
            MemberRepository memberRepository
    ) {
        this.healthRecordRepository = healthRecordRepository;
        this.memberRepository = memberRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<HealthRecordResponse> findAll(Boolean active) {
        List<HealthRecord> records = active == null
                ? healthRecordRepository.findAllByOrderByCreatedAtDesc()
                : healthRecordRepository.findByActiveOrderByCreatedAtDesc(active);

        return records.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public HealthRecordResponse findById(Long id) {
        return toResponse(findEntityById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public HealthRecordResponse findByMemberId(Long memberId) {
        HealthRecord healthRecord = healthRecordRepository
                .findByMemberId(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "El deportista con ID "
                                        + memberId
                                        + " no tiene un expediente clínico"
                        )
                );

        return toResponse(healthRecord);
    }

    @Override
    public HealthRecordResponse create(
            HealthRecordRequest request
    ) {
        Member member = findMemberById(request.memberId());

        if (healthRecordRepository.existsByMemberId(request.memberId())) {
            throw new IllegalArgumentException(
                    "El deportista "
                            + member.getFirstName()
                            + " "
                            + member.getLastName()
                            + " ya tiene un expediente clínico"
            );
        }

        HealthRecord healthRecord = new HealthRecord();
        healthRecord.setMember(member);

        applyRequest(healthRecord, request);

        healthRecord.setOpenedAt(
                request.openedAt() == null
                        ? LocalDate.now()
                        : request.openedAt()
        );

        healthRecord.setActive(
                request.active() == null || request.active()
        );

        return toResponse(
                healthRecordRepository.save(healthRecord)
        );
    }

    @Override
    public HealthRecordResponse update(
            Long id,
            HealthRecordRequest request
    ) {
        HealthRecord healthRecord = findEntityById(id);
        Member requestedMember = findMemberById(request.memberId());

        healthRecordRepository
                .findByMemberId(request.memberId())
                .filter(existing ->
                        !existing.getId().equals(id)
                )
                .ifPresent(existing -> {
                    throw new IllegalArgumentException(
                            "El deportista seleccionado ya tiene otro expediente clínico"
                    );
                });

        healthRecord.setMember(requestedMember);
        applyRequest(healthRecord, request);

        if (request.openedAt() != null) {
            healthRecord.setOpenedAt(request.openedAt());
        }

        if (request.active() != null) {
            healthRecord.setActive(request.active());
        }

        return toResponse(
                healthRecordRepository.save(healthRecord)
        );
    }

    @Override
    public void deactivate(Long id) {
        HealthRecord healthRecord = findEntityById(id);
        healthRecord.setActive(false);
        healthRecordRepository.save(healthRecord);
    }

    private HealthRecord findEntityById(Long id) {
        return healthRecordRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No se encontró el expediente clínico con ID: "
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
            HealthRecord healthRecord,
            HealthRecordRequest request
    ) {
        healthRecord.setMedicalHistory(
                normalizeOptional(request.medicalHistory())
        );

        healthRecord.setAllergies(
                normalizeOptional(request.allergies())
        );

        healthRecord.setInjuries(
                normalizeOptional(request.injuries())
        );

        healthRecord.setMedications(
                normalizeOptional(request.medications())
        );

        healthRecord.setPhysicalRestrictions(
                normalizeOptional(request.physicalRestrictions())
        );

        healthRecord.setClinicalObservations(
                normalizeOptional(request.clinicalObservations())
        );
    }

    private String normalizeOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private HealthRecordResponse toResponse(
            HealthRecord healthRecord
    ) {
        Member member = healthRecord.getMember();

        String fullName =
                member.getFirstName()
                        + " "
                        + member.getLastName();

        return new HealthRecordResponse(
                healthRecord.getId(),
                member.getId(),
                member.getIdentification(),
                fullName,
                member.getBloodType(),
                calculateAge(member.getBirthDate()),
                member.getEmail(),
                member.getPhone(),
                healthRecord.getMedicalHistory(),
                healthRecord.getAllergies(),
                healthRecord.getInjuries(),
                healthRecord.getMedications(),
                healthRecord.getPhysicalRestrictions(),
                healthRecord.getClinicalObservations(),
                healthRecord.getOpenedAt(),
                healthRecord.getActive(),
                healthRecord.getCreatedAt(),
                healthRecord.getUpdatedAt()
        );
    }

    private Integer calculateAge(LocalDate birthDate) {
        if (birthDate == null) {
            return null;
        }

        return Period.between(
                birthDate,
                LocalDate.now()
        ).getYears();
    }
}
