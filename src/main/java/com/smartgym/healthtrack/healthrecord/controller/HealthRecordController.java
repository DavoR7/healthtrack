package com.smartgym.healthtrack.healthrecord.controller;

import com.smartgym.healthtrack.healthrecord.dto.HealthRecordRequest;
import com.smartgym.healthtrack.healthrecord.dto.HealthRecordResponse;
import com.smartgym.healthtrack.healthrecord.service.HealthRecordService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/health-records")
public class HealthRecordController {

    private final HealthRecordService healthRecordService;

    public HealthRecordController(
            HealthRecordService healthRecordService
    ) {
        this.healthRecordService = healthRecordService;
    }

    @GetMapping
    public ResponseEntity<List<HealthRecordResponse>> findAll(
            @RequestParam(required = false) Boolean active
    ) {
        return ResponseEntity.ok(
                healthRecordService.findAll(active)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<HealthRecordResponse> findById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                healthRecordService.findById(id)
        );
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<HealthRecordResponse> findByMemberId(
            @PathVariable Long memberId
    ) {
        return ResponseEntity.ok(
                healthRecordService.findByMemberId(memberId)
        );
    }

    @PostMapping
    public ResponseEntity<HealthRecordResponse> create(
            @Valid @RequestBody HealthRecordRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        healthRecordService.create(request)
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<HealthRecordResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody HealthRecordRequest request
    ) {
        return ResponseEntity.ok(
                healthRecordService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(
            @PathVariable Long id
    ) {
        healthRecordService.deactivate(id);
        return ResponseEntity.noContent().build();
    }
}
