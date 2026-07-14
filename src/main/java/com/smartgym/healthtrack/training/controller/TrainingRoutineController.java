package com.smartgym.healthtrack.training.controller;

import com.smartgym.healthtrack.training.dto.TrainingRoutineRequest;
import com.smartgym.healthtrack.training.dto.TrainingRoutineResponse;
import com.smartgym.healthtrack.training.service.TrainingRoutineService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/training-routines")
public class TrainingRoutineController {

    private final TrainingRoutineService routineService;

    public TrainingRoutineController(
            TrainingRoutineService routineService
    ) {
        this.routineService = routineService;
    }

    @GetMapping
    public ResponseEntity<List<TrainingRoutineResponse>> findAll(
            @RequestParam(required = false) Boolean active
    ) {
        return ResponseEntity.ok(
                routineService.findAll(active)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingRoutineResponse> findById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                routineService.findById(id)
        );
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<TrainingRoutineResponse>>
    findByMemberId(
            @PathVariable Long memberId,
            @RequestParam(required = false) Boolean active
    ) {
        return ResponseEntity.ok(
                routineService.findByMemberId(
                        memberId,
                        active
                )
        );
    }

    @PostMapping
    public ResponseEntity<TrainingRoutineResponse> create(
            @Valid
            @RequestBody
            TrainingRoutineRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        routineService.create(request)
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainingRoutineResponse> update(
            @PathVariable Long id,
            @Valid
            @RequestBody
            TrainingRoutineRequest request
    ) {
        return ResponseEntity.ok(
                routineService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(
            @PathVariable Long id
    ) {
        routineService.deactivate(id);

        return ResponseEntity.noContent().build();
    }
}
