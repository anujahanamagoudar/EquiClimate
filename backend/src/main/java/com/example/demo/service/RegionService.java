package com.example.demo.service;

import org.springframework.stereotype.Service;
import com.example.demo.model.Region;

@Service
public class RegionService {

    public double calculateVulnerability(Region r) {
        return (0.4 * r.getTemperature()/100) +
                (0.3 * r.getAqi()/100) +
                (0.3 * r.getPopulationDensity()/1000);
    }

    public double calculateGap(Region r) {
        return r.getVulnerabilityScore() - (r.getEmissions() / 100);
    }
}