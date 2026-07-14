package com.smartgym.healthtrack.clinical.assessment.repository;

import com.smartgym.healthtrack.clinical.assessment.model.PhysicalAssessment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PhysicalAssessmentRepository
        extends JpaRepository<PhysicalAssessment, Long> {

    List<PhysicalAssessment> findAllByOrderByAssessmentDateDesc();

    List<PhysicalAssessment> findByActiveOrderByAssessmentDateDesc(
            Boolean active
    );

    List<PhysicalAssessment> findByMemberIdOrderByAssessmentDateDesc(
            Long memberId
    );

    List<PhysicalAssessment>
    findByMemberIdAndActiveOrderByAssessmentDateDesc(
            Long memberId,
            Boolean active
    );
}
