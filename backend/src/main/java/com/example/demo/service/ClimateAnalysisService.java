package com.example.demo.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ClimateAnalysisService {

    /**
     * Calculate climate risk score based on multiple factors
     * Formula: (Pollution × 0.3) + (Flood Risk × 0.3) + (Poverty × 0.2) + (Temperature Rise × 0.2)
     */
    public double calculateRiskScore(
            double pollution,
            double floodRisk,
            double poverty,
            double tempRise) {

        // Normalize values to 0-100 scale if needed
        pollution = Math.min(100, Math.max(0, pollution));
        floodRisk = Math.min(100, Math.max(0, floodRisk));
        poverty = Math.min(100, Math.max(0, poverty));
        tempRise = Math.min(10, Math.max(0, tempRise)) * 10; // Convert temp rise to 0-100 scale

        double riskScore = (pollution * 0.3) 
                         + (floodRisk * 0.3) 
                         + (poverty * 0.2) 
                         + (tempRise * 0.2);

        return Math.round(riskScore * 100.0) / 100.0;
    }

    /**
     * Get risk status based on score
     */
    public String getRiskStatus(double riskScore) {
        if (riskScore >= 75) {
            return "Critical";
        } else if (riskScore >= 50) {
            return "High";
        } else if (riskScore >= 25) {
            return "Medium";
        } else {
            return "Low";
        }
    }

    /**
     * Calculate Climate Equity Score (100 - Risk Score)
     * Higher equity score = less vulnerable region
     */
    public double calculateEquityScore(double riskScore) {
        return Math.max(0, 100 - riskScore);
    }

    /**
     * Get risk level color for UI
     */
    public String getRiskColor(double riskScore) {
        if (riskScore >= 75) {
            return "#d32f2f"; // Red
        } else if (riskScore >= 50) {
            return "#f57c00"; // Orange
        } else if (riskScore >= 25) {
            return "#fbc02d"; // Yellow
        } else {
            return "#388e3c"; // Green
        }
    }

    /**
     * Get risk alert message
     */
    public String getRiskAlert(String regionName, double riskScore) {
        String status = getRiskStatus(riskScore);
        return String.format("⚠ %s climate impact detected in %s (Risk: %.1f%%)", 
                            status, regionName, riskScore);
    }

    /**
     * Calculate average risk across multiple regions
     */
    public double calculateAverageRisk(List<Double> riskScores) {
        if (riskScores.isEmpty()) return 0;
        double sum = riskScores.stream().mapToDouble(Double::doubleValue).sum();
        return Math.round((sum / riskScores.size()) * 100.0) / 100.0;
    }

    /**
     * Get high-risk regions (risk score >= 50)
     */
    public List<Map<String, Object>> getHighRiskRegions(List<Map<String, Object>> regions) {
        List<Map<String, Object>> highRiskRegions = new ArrayList<>();
        for (Map<String, Object> region : regions) {
            double risk = ((Number) region.get("riskScore")).doubleValue();
            if (risk >= 50) {
                highRiskRegions.add(region);
            }
        }
        highRiskRegions.sort((a, b) -> Double.compare(
            ((Number) b.get("riskScore")).doubleValue(),
            ((Number) a.get("riskScore")).doubleValue()
        ));
        return highRiskRegions;
    }

    /**
     * Risk distribution analysis
     */
    public Map<String, Integer> getRiskDistribution(List<Double> riskScores) {
        Map<String, Integer> distribution = new LinkedHashMap<>();
        distribution.put("Critical", 0);
        distribution.put("High", 0);
        distribution.put("Medium", 0);
        distribution.put("Low", 0);

        for (Double score : riskScores) {
            String status = getRiskStatus(score);
            distribution.put(status, distribution.get(status) + 1);
        }

        return distribution;
    }

    /**
     * Get regions by risk status
     */
    public List<String> getRegionsByStatus(List<Map<String, Object>> regions, String status) {
        List<String> regionsByStatus = new ArrayList<>();
        for (Map<String, Object> region : regions) {
            String regionStatus = getRiskStatus(((Number) region.get("riskScore")).doubleValue());
            if (regionStatus.equals(status)) {
                regionsByStatus.add((String) region.get("region"));
            }
        }
        return regionsByStatus;
    }
}
