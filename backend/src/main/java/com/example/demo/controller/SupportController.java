package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/support")
@CrossOrigin(origins = "http://localhost:3000")
public class SupportController {

    private List<Map<String, String>> data = new ArrayList<>();

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