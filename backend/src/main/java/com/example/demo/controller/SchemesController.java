package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/schemes")
@CrossOrigin(origins = "http://localhost:3000")
public class SchemesController {

    private final List<Map<String, String>> schemes = new ArrayList<>();

    public SchemesController() {
        schemes.add(Map.of(
            "id", "1",
            "name", "Clean Water Access",
            "description", "Install water purification systems in high-risk districts.",
            "targetRegion", "Mumbai"
        ));
        schemes.add(Map.of(
            "id", "2",
            "name", "Urban Heat Relief",
            "description", "Create shaded walkways and cooling centers.",
            "targetRegion", "Delhi"
        ));
    }

    @GetMapping
    public List<Map<String, String>> getAll() {
        return schemes;
    }

    @PostMapping
    public Map<String, String> add(@RequestBody Map<String, String> scheme) {
        schemes.add(scheme);
        return scheme;
    }
}
