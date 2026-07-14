package com.smartgym.healthtrack.nutrition.controller;

import com.smartgym.healthtrack.nutrition.dto.NutritionPlanRequest;
import com.smartgym.healthtrack.nutrition.dto.NutritionPlanResponse;
import com.smartgym.healthtrack.nutrition.service.NutritionPlanService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/nutrition-plans")
public class NutritionPlanController {

    private final NutritionPlanService nutritionPlanService;

    public NutritionPlanController(
            NutritionPlanService nutritionPlanService
    ) {
        this.nutritionPlanService = nutritionPlanService;
    }

    @GetMapping
    public ResponseEntity<List<NutritionPlanResponse>> findAll(
            @RequestParam(required = false) Boolean active
    ) {
        return ResponseEntity.ok(
                nutritionPlanService.findAll(active)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<NutritionPlanResponse> findById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                nutritionPlanService.findById(id)
        );
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<NutritionPlanResponse>>
    findByMemberId(
            @PathVariable Long memberId,
            @RequestParam(required = false) Boolean active
    ) {
        return ResponseEntity.ok(
                nutritionPlanService.findByMemberId(
                        memberId,
                        active
                )
        );
    }

    @PostMapping
    public ResponseEntity<NutritionPlanResponse> create(
            @Valid
            @RequestBody
            NutritionPlanRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        nutritionPlanService.create(request)
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<NutritionPlanResponse> update(
            @PathVariable Long id,
            @Valid
            @RequestBody
            NutritionPlanRequest request
    ) {
        return ResponseEntity.ok(
                nutritionPlanService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(
            @PathVariable Long id
    ) {
        nutritionPlanService.deactivate(id);

        return ResponseEntity.noContent().build();
    }
}
