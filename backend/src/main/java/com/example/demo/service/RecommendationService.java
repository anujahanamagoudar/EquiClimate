package com.example.demo.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class RecommendationService {

    /**
     * Generate AI-powered recommendations based on climate factors
     */
    public List<String> generateRecommendations(
            double pollution,
            double floodRisk,
            double poverty,
            double tempRise) {

        List<String> recommendations = new ArrayList<>();

        // Pollution-based recommendations
        if (pollution > 70) {
            recommendations.add("🌳 URGENT: Plant 10,000+ trees to reduce air pollution. Set up air quality monitoring stations.");
            recommendations.add("🏭 Implement stricter emission controls on industries and vehicular traffic.");
            recommendations.add("👥 Conduct public awareness campaigns on air quality management.");
        } else if (pollution > 50) {
            recommendations.add("🌱 Plant trees in residential and industrial areas. Target: 5,000 trees.");
            recommendations.add("🚗 Promote electric vehicles and public transportation usage.");
        } else if (pollution > 30) {
            recommendations.add("✅ Maintain regular air quality monitoring.");
            recommendations.add("🚴 Encourage cycling infrastructure development.");
        }

        // Flood Risk-based recommendations
        if (floodRisk > 70) {
            recommendations.add("🌊 CRITICAL: Build advanced drainage systems and flood shelters immediately.");
            recommendations.add("🏗️ Construct flood barriers and early warning systems in vulnerable areas.");
            recommendations.add("📱 Deploy SMS-based flood alert system to residents.");
            recommendations.add("🚑 Establish emergency response units and rescue equipment stockpiles.");
        } else if (floodRisk > 50) {
            recommendations.add("💧 Improve drainage infrastructure and build flood prevention channels.");
            recommendations.add("🏠 Relocate settlements from flood-prone areas. Provide rehabilitation.");
            recommendations.add("⏰ Implement community-based flood early warning system.");
        } else if (floodRisk > 30) {
            recommendations.add("🔍 Conduct flood risk assessment and mapping.");
            recommendations.add("👨‍👩‍👧‍👦 Conduct flood preparedness drills in communities.");
        }

        // Poverty-based recommendations
        if (poverty > 60) {
            recommendations.add("💰 URGENT: Allocate emergency climate resilience funds for vulnerable populations.");
            recommendations.add("👷 Create 5,000+ green jobs in renewable energy and tree plantation.");
            recommendations.add("🎓 Establish skill development centers for climate-related professions.");
            recommendations.add("🍎 Launch food security and livelihood support programs.");
        } else if (poverty > 40) {
            recommendations.add("💼 Support livelihood diversification programs in agriculture and small businesses.");
            recommendations.add("🏥 Establish health clinics and nutritional support in poor areas.");
            recommendations.add("📚 Provide educational scholarships for underprivileged children.");
        } else if (poverty > 20) {
            recommendations.add("🤝 Strengthen social support networks and community organizations.");
            recommendations.add("📊 Implement microfinance schemes for small businesses.");
        }

        // Temperature Rise-based recommendations
        if (tempRise > 2.5) {
            recommendations.add("❄️ CRITICAL: Set up 50+ cooling centers in urban areas for vulnerable populations.");
            recommendations.add("💨 Implement urban greenery initiatives - green roofs and parks.");
            recommendations.add("⚡ Promote renewable energy (solar/wind) to reduce emissions.");
            recommendations.add("📖 Launch heat stress awareness and prevention campaigns.");
        } else if (tempRise > 1.5) {
            recommendations.add("🏞️ Increase urban green spaces and parks by 30%.");
            recommendations.add("☀️ Provide solar power solutions to households and institutions.");
            recommendations.add("💧 Implement water conservation and harvesting systems.");
        } else if (tempRise > 0.5) {
            recommendations.add("🌳 Continue afforestation programs in urban and rural areas.");
            recommendations.add("🌐 Monitor climate trends and update adaptation plans accordingly.");
        }

        // Overall smart recommendations
        recommendations.add("📊 Monitor all climate indicators quarterly and adjust strategies.");
        recommendations.add("🤖 Implement IoT sensors for real-time climate data collection.");
        recommendations.add("👥 Engage NGOs and government agencies for coordinated action.");

        return recommendations;
    }

    /**
     * Get targeted recommendations for NGOs
     */
    public List<String> getNGORecommendations(double riskScore, String regionName) {
        List<String> ngoRecos = new ArrayList<>();

        if (riskScore >= 75) {
            ngoRecos.add("🚨 CRITICAL PRIORITY: " + regionName + " needs immediate intervention");
            ngoRecos.add("💧 Water & Sanitation: Deploy water purification units and safe drinking water");
            ngoRecos.add("🏥 Health: Set up medical camps and mental health counseling services");
            ngoRecos.add("🏘️ Shelter: Provide temporary shelters and rehabilitation kits");
            ngoRecos.add("🍲 Food: Distribute nutrition packages and establish community kitchens");
            ngoRecos.add("👨‍👩‍👧 Family Support: Counseling and livelihood assistance for displaced families");
        } else if (riskScore >= 50) {
            ngoRecos.add("📌 HIGH PRIORITY: " + regionName + " needs significant support");
            ngoRecos.add("🌾 Agricultural Support: Provide drought-resistant seeds and farming techniques");
            ngoRecos.add("💪 Skill Training: Vocational training for alternative livelihoods");
            ngoRecos.add("🏘️ Housing: Improve housing standards in vulnerable areas");
        } else if (riskScore >= 25) {
            ngoRecos.add("✅ MEDIUM PRIORITY: " + regionName + " needs developmental support");
            ngoRecos.add("📚 Education: Scholarships and learning centers for children");
            ngoRecos.add("🏥 Prevention: Health awareness and preventive healthcare programs");
        } else {
            ngoRecos.add("🟢 LOW PRIORITY: " + regionName + " is relatively resilient");
            ngoRecos.add("📈 Focus: Capacity building and preparedness programs");
        }

        return ngoRecos;
    }

    /**
     * Get targeted recommendations for Government
     */
    public List<String> getGovernmentRecommendations(double riskScore, String regionName) {
        List<String> govRecos = new ArrayList<>();

        if (riskScore >= 75) {
            govRecos.add("🚨 DECLARE CLIMATE EMERGENCY: " + regionName);
            govRecos.add("💵 Budget Allocation: Allocate 50% more funds for climate resilience");
            govRecos.add("🏗️ Infrastructure: Fast-track drainage, flood barriers, and cooling centers");
            govRecos.add("📋 Policy: Implement climate-sensitive urban planning regulations");
            govRecos.add("🚓 Emergency: Activate disaster management protocols");
        } else if (riskScore >= 50) {
            govRecos.add("📌 CLIMATE ADAPTATION ZONE: " + regionName);
            govRecos.add("📊 Planning: Integrate climate resilience into 5-year development plans");
            govRecos.add("🤝 Partnership: Establish inter-agency climate task forces");
            govRecos.add("🏞️ Nature: Invest in natural solutions (wetlands, mangroves, forests)");
        } else if (riskScore >= 25) {
            govRecos.add("✅ DEVELOPMENT ZONE: " + regionName);
            govRecos.add("🌳 Prevention: Implement preventive afforestation and conservation");
            govRecos.add("📱 Tech: Deploy climate monitoring infrastructure");
        } else {
            govRecos.add("🟢 THRIVING REGION: " + regionName);
            govRecos.add("📚 Leadership: Share best practices with vulnerable regions");
        }

        return govRecos;
    }

    /**
     * Get resource allocation suggestions
     */
    public Map<String, Integer> suggestResourceAllocation(double riskScore) {
        Map<String, Integer> allocation = new LinkedHashMap<>();

        if (riskScore >= 75) {
            allocation.put("Water & Sanitation", 30);
            allocation.put("Medical Aid", 25);
            allocation.put("Shelter", 20);
            allocation.put("Food Security", 15);
            allocation.put("Education", 10);
        } else if (riskScore >= 50) {
            allocation.put("Infrastructure", 25);
            allocation.put("Education", 20);
            allocation.put("Healthcare", 20);
            allocation.put("Livelihood", 20);
            allocation.put("Research", 15);
        } else if (riskScore >= 25) {
            allocation.put("Education", 30);
            allocation.put("Healthcare", 25);
            allocation.put("Infrastructure", 20);
            allocation.put("Research", 15);
            allocation.put("Prevention", 10);
        } else {
            allocation.put("Prevention", 40);
            allocation.put("Research", 30);
            allocation.put("Education", 20);
            allocation.put("Infrastructure", 10);
        }

        return allocation;
    }
}
