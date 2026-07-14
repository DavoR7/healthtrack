package com.smartgym.healthtrack.clinical.assessment.service.impl;

import com.smartgym.healthtrack.clinical.assessment.dto.PhysicalAssessmentRequest;
import com.smartgym.healthtrack.clinical.assessment.dto.PhysicalAssessmentResponse;
import com.smartgym.healthtrack.clinical.assessment.model.PhysicalAssessment;
import com.smartgym.healthtrack.clinical.assessment.repository.PhysicalAssessmentRepository;
import com.smartgym.healthtrack.clinical.assessment.service.PhysicalAssessmentService;
import com.smartgym.healthtrack.members.model.Member;
import com.smartgym.healthtrack.members.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class PhysicalAssessmentServiceImpl
        implements PhysicalAssessmentService {

    private final PhysicalAssessmentRepository assessmentRepository;
    private final MemberRepository memberRepository;

    public PhysicalAssessmentServiceImpl(
            PhysicalAssessmentRepository assessmentRepository,
            MemberRepository memberRepository
    ) {
        this.assessmentRepository = assessmentRepository;
        this.memberRepository = memberRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PhysicalAssessmentResponse> findAll(Boolean active) {
        List<PhysicalAssessment> assessments = active == null
                ? assessmentRepository
                    .findAllByOrderByAssessmentDateDesc()
                : assessmentRepository
                    .findByActiveOrderByAssessmentDateDesc(active);

        return assessments.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PhysicalAssessmentResponse> findByMemberId(
            Long memberId,
            Boolean active
    ) {
        findMemberById(memberId);

        List<PhysicalAssessment> assessments = active == null
                ? assessmentRepository
                    .findByMemberIdOrderByAssessmentDateDesc(memberId)
                : assessmentRepository
                    .findByMemberIdAndActiveOrderByAssessmentDateDesc(
                            memberId,
                            active
                    );

        return assessments.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PhysicalAssessmentResponse findById(Long id) {
        return toResponse(findEntityById(id));
    }

    @Override
    public PhysicalAssessmentResponse create(
            PhysicalAssessmentRequest request
    ) {
        Member member = findMemberById(request.memberId());

        PhysicalAssessment assessment =
                new PhysicalAssessment();

        assessment.setMember(member);
        applyRequest(assessment, request);

        assessment.setAssessmentDate(
                request.assessmentDate() == null
                        ? LocalDate.now()
                        : request.assessmentDate()
        );

        assessment.setActive(
                request.active() == null
                        || request.active()
        );

        return toResponse(
                assessmentRepository.save(assessment)
        );
    }

    @Override
    public PhysicalAssessmentResponse update(
            Long id,
            PhysicalAssessmentRequest request
    ) {
        PhysicalAssessment assessment =
                findEntityById(id);

        Member member =
                findMemberById(request.memberId());

        assessment.setMember(member);
        applyRequest(assessment, request);

        if (request.assessmentDate() != null) {
            assessment.setAssessmentDate(
                    request.assessmentDate()
            );
        }

        if (request.active() != null) {
            assessment.setActive(request.active());
        }

        return toResponse(
                assessmentRepository.save(assessment)
        );
    }

    @Override
    public void deactivate(Long id) {
        PhysicalAssessment assessment =
                findEntityById(id);

        assessment.setActive(false);

        assessmentRepository.save(assessment);
    }

    private PhysicalAssessment findEntityById(Long id) {
        return assessmentRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No se encontró la evaluación física "
                                        + "con ID: "
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
            PhysicalAssessment assessment,
            PhysicalAssessmentRequest request
    ) {
        assessment.setWeightKg(request.weightKg());
        assessment.setHeightCm(request.heightCm());

        assessment.setBodyFatPercentage(
                request.bodyFatPercentage()
        );

        assessment.setMuscleMassKg(
                request.muscleMassKg()
        );

        assessment.setWaistCircumferenceCm(
                request.waistCircumferenceCm()
        );

        assessment.setRestingHeartRate(
                request.restingHeartRate()
        );

        assessment.setSystolicPressure(
                request.systolicPressure()
        );

        assessment.setDiastolicPressure(
                request.diastolicPressure()
        );

        assessment.setOxygenSaturation(
                request.oxygenSaturation()
        );

        assessment.setObservations(
                normalizeOptional(request.observations())
        );
    }

    private String normalizeOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private PhysicalAssessmentResponse toResponse(
            PhysicalAssessment assessment
    ) {
        Member member = assessment.getMember();

        String fullName =
                member.getFirstName()
                        + " "
                        + member.getLastName();

        return new PhysicalAssessmentResponse(
                assessment.getId(),
                member.getId(),
                member.getIdentification(),
                fullName,
                assessment.getAssessmentDate(),
                assessment.getWeightKg(),
                assessment.getHeightCm(),
                assessment.getBmi(),
                classifyBmi(assessment.getBmi()),
                assessment.getBodyFatPercentage(),
                assessment.getMuscleMassKg(),
                assessment.getWaistCircumferenceCm(),
                assessment.getRestingHeartRate(),
                assessment.getSystolicPressure(),
                assessment.getDiastolicPressure(),
                assessment.getOxygenSaturation(),
                assessment.getObservations(),
                assessment.getActive(),
                assessment.getCreatedAt(),
                assessment.getUpdatedAt()
        );
    }

    private String classifyBmi(BigDecimal bmi) {
        if (bmi == null) {
            return "No calculado";
        }

        if (bmi.compareTo(
                BigDecimal.valueOf(18.5)
        ) < 0) {
            return "Bajo peso";
        }

        if (bmi.compareTo(
                BigDecimal.valueOf(25)
        ) < 0) {
            return "Normal";
        }

        if (bmi.compareTo(
                BigDecimal.valueOf(30)
        ) < 0) {
            return "Sobrepeso";
        }

        return "Obesidad";
    }
}
