package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.example.demo.model.Region;
import com.example.demo.repository.RegionRepository;
import com.example.demo.service.RegionService;



@RestController
@RequestMapping("/api")
@CrossOrigin
public class RegionController {

    @Autowired
    private RegionRepository repo;

    @Autowired
    private RegionService service;

    @PostMapping("/region")
    public Region addRegion(@RequestBody Region region) {
        region.setVulnerabilityScore(service.calculateVulnerability(region));
        region.setGapScore(service.calculateGap(region));
        return repo.save(region);
    }

    @GetMapping("/regions")
    public List<Region> getAll() {
        return repo.findAll();
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/high-risk")
    public List<Region> getHighRisk() {
        return repo.findAll().stream()
                .filter(r -> r.getGapScore() > 0.5)
                .toList();
    }
}