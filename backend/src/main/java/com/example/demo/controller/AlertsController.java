package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "http://localhost:3000")
public class AlertsController {

    private final List<Map<String, String>> alerts = new ArrayList<>();

    public AlertsController() {
        alerts.add(Map.of(
            "id", "1",
            "region", "Kolkata",
            "message", "High pollution alert in Kolkata",
            "priority", "HIGH",
            "riskScore", "82"
        ));
        alerts.add(Map.of(
            "id", "2",
            "region", "Delhi",
            "message", "Flood watch near low-lying districts",
            "priority", "MEDIUM",
            "riskScore", "68"
        ));
    }

    @GetMapping
    public List<Map<String, String>> getAll() {
        return alerts;
    }

    @PostMapping
    public Map<String, String> add(@RequestBody Map<String, String> alert) {
        alerts.add(alert);
        return alert;
    }
}