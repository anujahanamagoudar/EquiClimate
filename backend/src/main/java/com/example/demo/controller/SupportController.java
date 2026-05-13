package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
@CrossOrigin(origins = "http://localhost:3000")
public class SupportController {

    private final List<Map<String, String>> data = new ArrayList<>();

    public SupportController() {
        data.add(Map.of(
            "id", "1",
            "category", "Health",
            "description", "Mobile clinics for vulnerable communities",
            "region", "Delhi"
        ));
        data.add(Map.of(
            "id", "2",
            "category", "Water",
            "description", "Emergency clean water support",
            "region", "Mumbai"
        ));
    }

    @GetMapping
    public List<Map<String, String>> getAll() {
        return data;
    }

    @PostMapping
    public Map<String, String> add(@RequestBody Map<String, String> entry) {
        data.add(entry);
        return entry;
    }
}