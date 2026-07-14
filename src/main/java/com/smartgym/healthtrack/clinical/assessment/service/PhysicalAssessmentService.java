package com.smartgym.healthtrack.clinical.assessment.service;

import com.smartgym.healthtrack.clinical.assessment.dto.PhysicalAssessmentRequest;
import com.smartgym.healthtrack.clinical.assessment.dto.PhysicalAssessmentResponse;

import java.util.List;

public interface PhysicalAssessmentService {

    List<PhysicalAssessmentResponse> findAll(Boolean active);

    List<PhysicalAssessmentResponse> findByMemberId(
            Long memberId,
            Boolean active
    );

    PhysicalAssessmentResponse findById(Long id);

    PhysicalAssessmentResponse create(
            PhysicalAssessmentRequest request
    );

    PhysicalAssessmentResponse update(
            Long id,
            PhysicalAssessmentRequest request
    );

    void deactivate(Long id);
}
