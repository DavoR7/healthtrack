package com.smartgym.healthtrack.members.controller;

import com.smartgym.healthtrack.members.dto.MemberRequest;
import com.smartgym.healthtrack.members.dto.MemberResponse;
import com.smartgym.healthtrack.members.service.MemberService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/members")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping
    public ResponseEntity<List<MemberResponse>> findAll(
            @RequestParam(required = false) Boolean active
    ) {
        return ResponseEntity.ok(memberService.findAll(active));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MemberResponse> findById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(memberService.findById(id));
    }

    @PostMapping
    public ResponseEntity<MemberResponse> create(
            @Valid @RequestBody MemberRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(memberService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MemberResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody MemberRequest request
    ) {
        return ResponseEntity.ok(
                memberService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(
            @PathVariable Long id
    ) {
        memberService.deactivate(id);
        return ResponseEntity.noContent().build();
    }
}