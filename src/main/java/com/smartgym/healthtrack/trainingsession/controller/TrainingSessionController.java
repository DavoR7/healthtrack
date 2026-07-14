package com.smartgym.healthtrack.trainingsession.controller;

import com.smartgym.healthtrack.trainingsession.dto.TrainingSessionRequest;
import com.smartgym.healthtrack.trainingsession.dto.TrainingSessionResponse;
import com.smartgym.healthtrack.trainingsession.service.TrainingSessionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/training-sessions")
public class TrainingSessionController {

    private final TrainingSessionService sessionService;

    public TrainingSessionController(
            TrainingSessionService sessionService
    ) {
        this.sessionService = sessionService;
    }

    @GetMapping
    public ResponseEntity<List<TrainingSessionResponse>>
    findAll(
            @RequestParam(required = false)
            Boolean active
    ) {
        return ResponseEntity.ok(
                sessionService.findAll(active)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingSessionResponse>
    findById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                sessionService.findById(id)
        );
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<TrainingSessionResponse>>
    findByMemberId(
            @PathVariable Long memberId,

            @RequestParam(required = false)
            Boolean active
    ) {
        return ResponseEntity.ok(
                sessionService.findByMemberId(
                        memberId,
                        active
                )
        );
    }

    @GetMapping("/routine/{routineId}")
    public ResponseEntity<List<TrainingSessionResponse>>
    findByRoutineId(
            @PathVariable Long routineId,

            @RequestParam(required = false)
            Boolean active
    ) {
        return ResponseEntity.ok(
                sessionService.findByRoutineId(
                        routineId,
                        active
                )
        );
    }

    @PostMapping
    public ResponseEntity<TrainingSessionResponse>
    create(
            @Valid
            @RequestBody
            TrainingSessionRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        sessionService.create(request)
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainingSessionResponse>
    update(
            @PathVariable Long id,

            @Valid
            @RequestBody
            TrainingSessionRequest request
    ) {
        return ResponseEntity.ok(
                sessionService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(
            @PathVariable Long id
    ) {
        sessionService.deactivate(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}
