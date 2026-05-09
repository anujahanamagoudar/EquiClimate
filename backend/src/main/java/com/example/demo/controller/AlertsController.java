package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "http://localhost:3000")
public class AlertsController {

    private List<Map<String, String>> alerts = new ArrayList<>();

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