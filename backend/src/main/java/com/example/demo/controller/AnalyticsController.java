package com.example.demo.controller;

import com.example.demo.service.ClimateAnalysisService;
import com.example.demo.service.RecommendationService;
import com.example.demo.service.DemoDataLoader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {

    @Autowired
    private ClimateAnalysisService climateAnalysisService;

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private DemoDataLoader demoDataLoader;

    // ========== CLIMATE DATA ==========

    /**
     * Get all regions with climate data and risk scores
     * GET /api/analytics/regions
     */
    @GetMapping("/regions")
    public Map<String, Object> getAllRegions() {
        List<Map<String, Object>> regions = demoDataLoader.generateDemoClimateData();
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("count", regions.size());
        response.put("data", regions);
        return response;
    }

    /**
     * Get specific region details
     * GET /api/analytics/region/{name}
     */
    @GetMapping("/region/{name}")
    public Map<String, Object> getRegionDetails(@PathVariable String name) {
        List<Map<String, Object>> regions = demoDataLoader.generateDemoClimateData();
        for (Map<String, Object> region : regions) {
            if (region.get("region").toString().equalsIgnoreCase(name)) {
                Map<String, Object> response = new LinkedHashMap<>();
                response.put("success", true);
                response.put("data", region);
                return response;
            }
        }
        return Map.of("success", false, "message", "Region not found");
    }

    // ========== RISK ANALYSIS ==========

    /**
     * Calculate risk score
     * POST /api/analytics/calculate-risk
     */
    @PostMapping("/calculate-risk")
    public Map<String, Object> calculateRisk(
            @RequestParam double pollution,
            @RequestParam double floodRisk,
            @RequestParam double poverty,
            @RequestParam double tempRise) {

        double riskScore = climateAnalysisService.calculateRiskScore(pollution, floodRisk, poverty, tempRise);
        String status = climateAnalysisService.getRiskStatus(riskScore);
        double equityScore = climateAnalysisService.calculateEquityScore(riskScore);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("riskScore", riskScore);
        response.put("equityScore", equityScore);
        response.put("status", status);
        response.put("color", climateAnalysisService.getRiskColor(riskScore));
        return response;
    }

    /**
     * Get all risk scores
     * GET /api/analytics/risk
     */
    @GetMapping("/risk")
    public Map<String, Object> getAllRiskScores() {
        List<Map<String, Object>> regions = demoDataLoader.generateDemoClimateData();
        List<Map<String, Object>> riskData = new ArrayList<>();

        for (Map<String, Object> region : regions) {
            Map<String, Object> risk = new LinkedHashMap<>();
            risk.put("region", region.get("region"));
            risk.put("riskScore", region.get("riskScore"));
            risk.put("status", region.get("status"));
            risk.put("color", region.get("color"));
            riskData.add(risk);
        }

        riskData.sort((a, b) -> Double.compare(
            ((Number) b.get("riskScore")).doubleValue(),
            ((Number) a.get("riskScore")).doubleValue()
        ));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("count", riskData.size());
        response.put("data", riskData);
        return response;
    }

    /**
     * Get high-risk regions
     * GET /api/analytics/high-risk
     */
    @GetMapping("/high-risk")
    public Map<String, Object> getHighRiskRegions() {
        List<Map<String, Object>> regions = demoDataLoader.generateDemoClimateData();
        List<Map<String, Object>> highRisk = climateAnalysisService.getHighRiskRegions(regions);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("count", highRisk.size());
        response.put("data", highRisk);
        return response;
    }

    /**
     * Get critical regions (risk >= 75)
     * GET /api/analytics/critical
     */
    @GetMapping("/critical")
    public Map<String, Object> getCriticalRegions() {
        List<Map<String, Object>> regions = demoDataLoader.generateDemoClimateData();
        List<Map<String, Object>> critical = new ArrayList<>();

        for (Map<String, Object> region : regions) {
            double riskScore = ((Number) region.get("riskScore")).doubleValue();
            if (riskScore >= 75) {
                critical.add(region);
            }
        }

        critical.sort((a, b) -> Double.compare(
            ((Number) b.get("riskScore")).doubleValue(),
            ((Number) a.get("riskScore")).doubleValue()
        ));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("count", critical.size());
        response.put("data", critical);
        return response;
    }

    // ========== RECOMMENDATIONS ==========

    /**
     * Get AI recommendations for a region
     * POST /api/analytics/recommendations
     */
    @PostMapping("/recommendations")
    public Map<String, Object> getRecommendations(
            @RequestParam double pollution,
            @RequestParam double floodRisk,
            @RequestParam double poverty,
            @RequestParam double tempRise) {

        List<String> recommendations = recommendationService.generateRecommendations(pollution, floodRisk, poverty, tempRise);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("count", recommendations.size());
        response.put("data", recommendations);
        return response;
    }

    /**
     * Get NGO-specific recommendations
     * GET /api/analytics/recommendations/ngo/{region}
     */
    @GetMapping("/recommendations/ngo/{region}")
    public Map<String, Object> getNGORecommendations(@PathVariable String region) {
        List<Map<String, Object>> regions = demoDataLoader.generateDemoClimateData();
        for (Map<String, Object> r : regions) {
            if (r.get("region").toString().equalsIgnoreCase(region)) {
                double riskScore = ((Number) r.get("riskScore")).doubleValue();
                List<String> recommendations = recommendationService.getNGORecommendations(riskScore, region);

                Map<String, Object> response = new LinkedHashMap<>();
                response.put("success", true);
                response.put("region", region);
                response.put("riskScore", riskScore);
                response.put("count", recommendations.size());
                response.put("data", recommendations);
                return response;
            }
        }
        return Map.of("success", false, "message", "Region not found");
    }

    /**
     * Get Government-specific recommendations
     * GET /api/analytics/recommendations/govt/{region}
     */
    @GetMapping("/recommendations/govt/{region}")
    public Map<String, Object> getGovernmentRecommendations(@PathVariable String region) {
        List<Map<String, Object>> regions = demoDataLoader.generateDemoClimateData();
        for (Map<String, Object> r : regions) {
            if (r.get("region").toString().equalsIgnoreCase(region)) {
                double riskScore = ((Number) r.get("riskScore")).doubleValue();
                List<String> recommendations = recommendationService.getGovernmentRecommendations(riskScore, region);

                Map<String, Object> response = new LinkedHashMap<>();
                response.put("success", true);
                response.put("region", region);
                response.put("riskScore", riskScore);
                response.put("count", recommendations.size());
                response.put("data", recommendations);
                return response;
            }
        }
        return Map.of("success", false, "message", "Region not found");
    }

    /**
     * Get resource allocation suggestions
     * GET /api/analytics/resource-allocation/{region}
     */
    @GetMapping("/resource-allocation/{region}")
    public Map<String, Object> getResourceAllocation(@PathVariable String region) {
        List<Map<String, Object>> regions = demoDataLoader.generateDemoClimateData();
        for (Map<String, Object> r : regions) {
            if (r.get("region").toString().equalsIgnoreCase(region)) {
                double riskScore = ((Number) r.get("riskScore")).doubleValue();
                Map<String, Integer> allocation = recommendationService.suggestResourceAllocation(riskScore);

                Map<String, Object> response = new LinkedHashMap<>();
                response.put("success", true);
                response.put("region", region);
                response.put("riskScore", riskScore);
                response.put("allocation", allocation);
                return response;
            }
        }
        return Map.of("success", false, "message", "Region not found");
    }

    // ========== CHARTS & VISUALIZATION ==========

    /**
     * Get risk distribution pie chart data
     * GET /api/analytics/charts/risk-distribution
     */
    @GetMapping("/charts/risk-distribution")
    public Map<String, Object> getRiskDistributionChart() {
        List<Map<String, Object>> regions = demoDataLoader.generateDemoClimateData();
        Map<String, Object> chartData = demoDataLoader.getRiskDistributionChart(regions);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("chartType", "pie");
        response.put("data", chartData.get("data"));
        return response;
    }

    /**
     * Get pollution comparison bar chart
     * GET /api/analytics/charts/pollution
     */
    @GetMapping("/charts/pollution")
    public Map<String, Object> getPollutionChart() {
        List<Map<String, Object>> regions = demoDataLoader.generateDemoClimateData();
        List<Map<String, Object>> chartData = demoDataLoader.getPollutionComparisonChart(regions);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("chartType", "bar");
        response.put("data", chartData);
        return response;
    }

    /**
     * Get temperature rise trend
     * GET /api/analytics/charts/temperature
     */
    @GetMapping("/charts/temperature")
    public Map<String, Object> getTemperatureChart() {
        List<Map<String, Object>> regions = demoDataLoader.generateDemoClimateData();
        List<Map<String, Object>> chartData = demoDataLoader.getTemperatureTrendChart(regions);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("chartType", "bar");
        response.put("data", chartData);
        return response;
    }

    /**
     * Get heatmap data
     * GET /api/analytics/charts/heatmap
     */
    @GetMapping("/charts/heatmap")
    public Map<String, Object> getHeatmapData() {
        List<Map<String, Object>> regions = demoDataLoader.generateDemoClimateData();
        List<Map<String, Object>> heatmapData = demoDataLoader.getHeatmapData(regions);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("chartType", "heatmap");
        response.put("data", heatmapData);
        return response;
    }

    /**
     * Get equity score comparison
     * GET /api/analytics/charts/equity
     */
    @GetMapping("/charts/equity")
    public Map<String, Object> getEquityChart() {
        List<Map<String, Object>> regions = demoDataLoader.generateDemoClimateData();
        List<Map<String, Object>> chartData = demoDataLoader.getEquityScoreChart(regions);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("chartType", "bar");
        response.put("data", chartData);
        return response;
    }

    // ========== ALERTS & INSIGHTS ==========

    /**
     * Get climate alerts
     * GET /api/analytics/alerts
     */
    @GetMapping("/alerts")
    public Map<String, Object> getAlerts() {
        List<Map<String, Object>> regions = demoDataLoader.generateDemoClimateData();
        List<Map<String, Object>> alerts = demoDataLoader.getClimateAlerts(regions);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("count", alerts.size());
        response.put("data", alerts);
        return response;
    }

    /**
     * Get statistics and summary
     * GET /api/analytics/statistics
     */
    @GetMapping("/statistics")
    public Map<String, Object> getStatistics() {
        List<Map<String, Object>> regions = demoDataLoader.generateDemoClimateData();
        Map<String, Object> stats = demoDataLoader.getStatistics(regions);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("data", stats);
        return response;
    }

    /**
     * Get dashboard overview
     * GET /api/analytics/dashboard
     */
    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardOverview() {
        List<Map<String, Object>> regions = demoDataLoader.generateDemoClimateData();
        Map<String, Object> stats = demoDataLoader.getStatistics(regions);
        List<Map<String, Object>> alerts = demoDataLoader.getClimateAlerts(regions);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("statistics", stats);
        response.put("alerts", alerts.subList(0, Math.min(5, alerts.size())));
        response.put("totalRegions", regions.size());
        return response;
    }

    /**
     * Search regions by keyword
     * GET /api/analytics/search?q=keyword
     */
    @GetMapping("/search")
    public Map<String, Object> searchRegions(@RequestParam String q) {
        List<Map<String, Object>> regions = demoDataLoader.generateDemoClimateData();
        List<Map<String, Object>> results = new ArrayList<>();

        for (Map<String, Object> region : regions) {
            String regionName = region.get("region").toString().toLowerCase();
            if (regionName.contains(q.toLowerCase())) {
                results.add(region);
            }
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("query", q);
        response.put("count", results.size());
        response.put("data", results);
        return response;
    }

    /**
     * Get regions by status
     * GET /api/analytics/by-status/{status}
     */
    @GetMapping("/by-status/{status}")
    public Map<String, Object> getRegionsByStatus(@PathVariable String status) {
        List<Map<String, Object>> regions = demoDataLoader.generateDemoClimateData();
        List<Map<String, Object>> filtered = new ArrayList<>();

        for (Map<String, Object> region : regions) {
            if (region.get("status").toString().equalsIgnoreCase(status)) {
                filtered.add(region);
            }
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("status", status);
        response.put("count", filtered.size());
        response.put("data", filtered);
        return response;
    }

    /**
     * Health check
     * GET /api/analytics/health
     */
    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
            "status", "UP",
            "service", "EquiClimate Analytics",
            "version", "1.0",
            "timestamp", System.currentTimeMillis()
        );
    }
}
