package com.smartgym.healthtrack.shared.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/api/v1/status")
    public Map<String, Object> status() {
        return Map.of(
                "application", "SMARTGYM Health Track",
                "version", "1.0.0",
                "status", "UP",
                "timestamp", OffsetDateTime.now()
        );
    }
}