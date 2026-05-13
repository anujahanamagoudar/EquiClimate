package com.example.demo.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class DemoDataLoader {

    private final ClimateAnalysisService climateAnalysisService;

    public DemoDataLoader(ClimateAnalysisService climateAnalysisService) {
        this.climateAnalysisService = climateAnalysisService;
    }

    /**
     * Generate demo climate data for 20+ regions
     */
    public List<Map<String, Object>> generateDemoClimateData() {
        List<Map<String, Object>> regions = new ArrayList<>();

        // Region data: [Region, Pollution, FloodRisk, Poverty, TempRise]
        String[][] regionData = {
            {"Delhi", "90", "60", "55", "3.0"},
            {"Mumbai", "75", "85", "45", "2.5"},
            {"Bangalore", "70", "80", "45", "2.1"},
            {"Kolkata", "85", "90", "60", "2.8"},
            {"Chennai", "72", "75", "50", "2.3"},
            {"Hyderabad", "68", "70", "40", "2.0"},
            {"Pune", "65", "65", "35", "1.8"},
            {"Ahmedabad", "80", "70", "48", "2.6"},
            {"Jaipur", "75", "55", "50", "3.2"},
            {"Lucknow", "78", "72", "52", "2.9"},
            {"Chandigarh", "55", "45", "25", "1.5"},
            {"Indore", "72", "60", "42", "2.2"},
            {"Surat", "68", "80", "45", "2.4"},
            {"Nagpur", "70", "65", "48", "2.3"},
            {"Bhopal", "75", "68", "50", "2.5"},
            {"Vadodara", "65", "70", "40", "2.1"},
            {"Visakhapatnam", "60", "75", "45", "2.0"},
            {"Coimbatore", "62", "65", "38", "1.9"},
            {"Vadodara", "64", "72", "42", "2.2"},
            {"Ranchi", "58", "70", "55", "2.0"},
            {"Guwahati", "65", "85", "50", "2.1"},
            {"Thiruvananthapuram", "55", "80", "35", "1.7"}
        };

        for (String[] data : regionData) {
            double pollution = Double.parseDouble(data[1]);
            double floodRisk = Double.parseDouble(data[2]);
            double poverty = Double.parseDouble(data[3]);
            double tempRise = Double.parseDouble(data[4]);

            double riskScore = climateAnalysisService.calculateRiskScore(pollution, floodRisk, poverty, tempRise);
            double equityScore = climateAnalysisService.calculateEquityScore(riskScore);
            String status = climateAnalysisService.getRiskStatus(riskScore);
            String color = climateAnalysisService.getRiskColor(riskScore);

            Map<String, Object> region = new LinkedHashMap<>();
            region.put("region", data[0]);
            region.put("pollution", pollution);
            region.put("floodRisk", floodRisk);
            region.put("poverty", poverty);
            region.put("tempRise", tempRise);
            region.put("riskScore", riskScore);
            region.put("equityScore", equityScore);
            region.put("status", status);
            region.put("color", color);
            region.put("population", generateRandomPopulation());
            region.put("affectedPopulation", calculateAffectedPopulation(riskScore));

            regions.add(region);
        }

        return regions;
    }

    /**
     * Get risk distribution data for chart
     */
    public Map<String, Object> getRiskDistributionChart(List<Map<String, Object>> regions) {
        Map<String, Integer> distribution = new LinkedHashMap<>();
        distribution.put("Critical", 0);
        distribution.put("High", 0);
        distribution.put("Medium", 0);
        distribution.put("Low", 0);

        Map<String, String> colorMap = new LinkedHashMap<>();
        colorMap.put("Critical", "#d32f2f");
        colorMap.put("High", "#f57c00");
        colorMap.put("Medium", "#fbc02d");
        colorMap.put("Low", "#388e3c");

        for (Map<String, Object> region : regions) {
            String status = (String) region.get("status");
            distribution.put(status, distribution.get(status) + 1);
        }

        List<Map<String, Object>> chartData = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : distribution.entrySet()) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("name", entry.getKey());
            item.put("value", entry.getValue());
            item.put("color", colorMap.get(entry.getKey()));
            chartData.add(item);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", chartData);
        return result;
    }

    /**
     * Get pollution comparison data
     */
    public List<Map<String, Object>> getPollutionComparisonChart(List<Map<String, Object>> regions) {
        List<Map<String, Object>> chartData = new ArrayList<>();
        for (Map<String, Object> region : regions) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("region", region.get("region"));
            item.put("pollution", region.get("pollution"));
            item.put("color", "#ff6b6b");
            chartData.add(item);
        }
        chartData.sort((a, b) -> Double.compare(
            ((Number) b.get("pollution")).doubleValue(),
            ((Number) a.get("pollution")).doubleValue()
        ));
        return chartData.subList(0, Math.min(10, chartData.size()));
    }

    /**
     * Get temperature rise trend data
     */
    public List<Map<String, Object>> getTemperatureTrendChart(List<Map<String, Object>> regions) {
        List<Map<String, Object>> chartData = new ArrayList<>();
        for (Map<String, Object> region : regions) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("region", region.get("region"));
            item.put("tempRise", region.get("tempRise"));
            item.put("color", "#ff4757");
            chartData.add(item);
        }
        chartData.sort((a, b) -> Double.compare(
            ((Number) b.get("tempRise")).doubleValue(),
            ((Number) a.get("tempRise")).doubleValue()
        ));
        return chartData;
    }

    /**
     * Get heatmap data
     */
    public List<Map<String, Object>> getHeatmapData(List<Map<String, Object>> regions) {
        List<Map<String, Object>> heatmapData = new ArrayList<>();
        for (Map<String, Object> region : regions) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("region", region.get("region"));
            item.put("riskScore", region.get("riskScore"));
            item.put("color", region.get("color"));
            item.put("status", region.get("status"));
            item.put("affectedPopulation", region.get("affectedPopulation"));
            heatmapData.add(item);
        }
        heatmapData.sort((a, b) -> Double.compare(
            ((Number) b.get("riskScore")).doubleValue(),
            ((Number) a.get("riskScore")).doubleValue()
        ));
        return heatmapData;
    }

    /**
     * Get equity score distribution
     */
    public List<Map<String, Object>> getEquityScoreChart(List<Map<String, Object>> regions) {
        List<Map<String, Object>> chartData = new ArrayList<>();
        for (Map<String, Object> region : regions) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("region", region.get("region"));
            item.put("equityScore", region.get("equityScore"));
            item.put("color", "#2ecc71");
            chartData.add(item);
        }
        chartData.sort((a, b) -> Double.compare(
            ((Number) b.get("equityScore")).doubleValue(),
            ((Number) a.get("equityScore")).doubleValue()
        ));
        return chartData;
    }

    /**
     * Get climate alerts
     */
    public List<Map<String, Object>> getClimateAlerts(List<Map<String, Object>> regions) {
        List<Map<String, Object>> alerts = new ArrayList<>();
        for (Map<String, Object> region : regions) {
            double riskScore = ((Number) region.get("riskScore")).doubleValue();
            if (riskScore >= 50) {
                Map<String, Object> alert = new LinkedHashMap<>();
                alert.put("region", region.get("region"));
                alert.put("riskScore", riskScore);
                alert.put("status", region.get("status"));
                alert.put("color", region.get("color"));
                alert.put("message", generateAlertMessage(region));
                alert.put("priority", riskScore >= 75 ? "CRITICAL" : "HIGH");
                alerts.add(alert);
            }
        }
        alerts.sort((a, b) -> Double.compare(
            ((Number) b.get("riskScore")).doubleValue(),
            ((Number) a.get("riskScore")).doubleValue()
        ));
        return alerts;
    }

    /**
     * Generate statistics
     */
    public Map<String, Object> getStatistics(List<Map<String, Object>> regions) {
        Map<String, Object> stats = new LinkedHashMap<>();

        double totalRisk = 0;
        double highRiskCount = 0;
        double criticalCount = 0;
        long totalPopulation = 0;
        long affectedPopulation = 0;

        for (Map<String, Object> region : regions) {
            double riskScore = ((Number) region.get("riskScore")).doubleValue();
            long affected = ((Number) region.get("affectedPopulation")).longValue();
            long pop = ((Number) region.get("population")).longValue();

            totalRisk += riskScore;
            totalPopulation += pop;
            affectedPopulation += affected;

            if (riskScore >= 50) highRiskCount++;
            if (riskScore >= 75) criticalCount++;
        }

        stats.put("totalRegions", regions.size());
        stats.put("averageRisk", Math.round((totalRisk / regions.size()) * 100.0) / 100.0);
        stats.put("criticalRegions", (int) criticalCount);
        stats.put("highRiskRegions", (int) highRiskCount);
        stats.put("totalPopulation", totalPopulation);
        stats.put("affectedPopulation", affectedPopulation);
        stats.put("percentageAffected", Math.round((affectedPopulation / (double) totalPopulation) * 10000.0) / 100.0);

        return stats;
    }

    // Helper methods
    private long generateRandomPopulation() {
        return 500000L + (long) (Math.random() * 4000000L);
    }

    private long calculateAffectedPopulation(double riskScore) {
        long basePopulation = generateRandomPopulation();
        return (long) (basePopulation * (riskScore / 100.0));
    }

    private String generateAlertMessage(Map<String, Object> region) {
        String regionName = (String) region.get("region");
        String status = (String) region.get("status");
        double riskScore = ((Number) region.get("riskScore")).doubleValue();
        double poverty = ((Number) region.get("poverty")).doubleValue();
        double floodRisk = ((Number) region.get("floodRisk")).doubleValue();

        if (poverty > 60 && floodRisk > 70) {
            return "🌊🏚️ Vulnerable population at high flood risk!";
        } else if (riskScore >= 75) {
            return "🚨 Critical climate emergency - immediate intervention needed!";
        } else if (riskScore >= 50) {
            return "⚠️ High climate impact - urgent action required!";
        }
        return "Alert: Monitor climate indicators closely";
    }
}
