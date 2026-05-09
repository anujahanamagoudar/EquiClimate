package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:3000")
public class NotesController {

    private List<Map<String, String>> notes = new ArrayList<>();

    @GetMapping
    public List<Map<String, String>> getAll() {
        return notes;
    }

    @PostMapping
    public Map<String, String> add(@RequestBody Map<String, String> note) {
        notes.add(note);
        return note;
    }
}