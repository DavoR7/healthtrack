package com.smartgym.healthtrack.clinical.assessment.controller;

import com.smartgym.healthtrack.clinical.assessment.dto.PhysicalAssessmentRequest;
import com.smartgym.healthtrack.clinical.assessment.dto.PhysicalAssessmentResponse;
import com.smartgym.healthtrack.clinical.assessment.service.PhysicalAssessmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/physical-assessments")
public class PhysicalAssessmentController {

    private final PhysicalAssessmentService assessmentService;

    public PhysicalAssessmentController(
            PhysicalAssessmentService assessmentService
    ) {
        this.assessmentService = assessmentService;
    }

    @GetMapping
    public ResponseEntity<List<PhysicalAssessmentResponse>> findAll(
            @RequestParam(required = false) Boolean active
    ) {
        return ResponseEntity.ok(
                assessmentService.findAll(active)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhysicalAssessmentResponse> findById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                assessmentService.findById(id)
        );
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<PhysicalAssessmentResponse>>
    findByMemberId(
            @PathVariable Long memberId,
            @RequestParam(required = false) Boolean active
    ) {
        return ResponseEntity.ok(
                assessmentService.findByMemberId(
                        memberId,
                        active
                )
        );
    }

    @PostMapping
    public ResponseEntity<PhysicalAssessmentResponse> create(
            @Valid
            @RequestBody
            PhysicalAssessmentRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        assessmentService.create(request)
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<PhysicalAssessmentResponse> update(
            @PathVariable Long id,
            @Valid
            @RequestBody
            PhysicalAssessmentRequest request
    ) {
        return ResponseEntity.ok(
                assessmentService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(
            @PathVariable Long id
    ) {
        assessmentService.deactivate(id);

        return ResponseEntity.noContent().build();
    }
}
