# EquiClimate Analytics API Documentation

## Base URL
```
http://localhost:8080/api/analytics
```

## Authentication
Currently, no authentication is required for demo purposes. Production deployment should implement JWT or OAuth2.

---

## Endpoints

### 1. Climate Data Endpoints

#### Get All Regions with Climate Data
```
GET /api/analytics/regions
```

**Response:**
```json
{
  "success": true,
  "count": 21,
  "data": [
    {
      "region": "Delhi",
      "pollution": 90,
      "floodRisk": 60,
      "poverty": 55,
      "tempRise": 3.0,
      "riskScore": 75.5,
      "equityScore": 24.5,
      "status": "Critical",
      "color": "#d32f2f",
      "population": 3200000,
      "affectedPopulation": 2412000
    }
  ]
}
```

#### Get Specific Region Details
```
GET /api/analytics/region/{name}
```

**Example:**
```
GET /api/analytics/region/Delhi
```

**Response:**
```json
{
  "success": true,
  "data": {
    "region": "Delhi",
    "pollution": 90,
    "floodRisk": 60,
    "poverty": 55,
    "tempRise": 3.0,
    "riskScore": 75.5,
    "equityScore": 24.5,
    "status": "Critical",
    "color": "#d32f2f"
  }
}
```

#### Search Regions
```
GET /api/analytics/search?q={keyword}
```

**Example:**
```
GET /api/analytics/search?q=Mumbai
```

**Response:**
```json
{
  "success": true,
  "query": "Mumbai",
  "count": 1,
  "data": [...]
}
```

---

### 2. Risk Analysis Endpoints

#### Calculate Risk Score
```
POST /api/analytics/calculate-risk
```

**Parameters:**
- `pollution` (double, 0-100) - Air pollution index
- `floodRisk` (double, 0-100) - Flood risk percentage
- `poverty` (double, 0-100) - Poverty level percentage
- `tempRise` (double, 0-10) - Temperature rise in °C

**Example:**
```
POST /api/analytics/calculate-risk?pollution=75&floodRisk=80&poverty=45&tempRise=2.5
```

**Response:**
```json
{
  "success": true,
  "riskScore": 72.0,
  "equityScore": 28.0,
  "status": "High",
  "color": "#f57c00"
}
```

#### Get All Risk Scores
```
GET /api/analytics/risk
```

**Response:**
```json
{
  "success": true,
  "count": 21,
  "data": [
    {
      "region": "Delhi",
      "riskScore": 75.5,
      "status": "Critical",
      "color": "#d32f2f"
    }
  ]
}
```

#### Get High-Risk Regions (Risk >= 50)
```
GET /api/analytics/high-risk
```

**Response:**
```json
{
  "success": true,
  "count": 18,
  "data": [...]
}
```

#### Get Critical Regions (Risk >= 75)
```
GET /api/analytics/critical
```

**Response:**
```json
{
  "success": true,
  "count": 8,
  "data": [...]
}
```

#### Get Regions by Status
```
GET /api/analytics/by-status/{status}
```

**Status Options:** Critical, High, Medium, Low

**Example:**
```
GET /api/analytics/by-status/Critical
```

---

### 3. Recommendation Endpoints

#### Get AI Recommendations
```
POST /api/analytics/recommendations
```

**Parameters:**
- `pollution` (double, 0-100)
- `floodRisk` (double, 0-100)
- `poverty` (double, 0-100)
- `tempRise` (double, 0-10)

**Example:**
```
POST /api/analytics/recommendations?pollution=75&floodRisk=80&poverty=45&tempRise=2.5
```

**Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    "🌊 Build advanced drainage systems and flood shelters immediately.",
    "🌳 Plant trees in residential and industrial areas. Target: 5,000 trees.",
    "💰 Allocate climate resilience funds for vulnerable populations.",
    "❄️ Set up cooling centers in urban areas for vulnerable populations."
  ]
}
```

#### Get NGO-Specific Recommendations
```
GET /api/analytics/recommendations/ngo/{region}
```

**Example:**
```
GET /api/analytics/recommendations/ngo/Delhi
```

**Response:**
```json
{
  "success": true,
  "region": "Delhi",
  "riskScore": 75.5,
  "count": 6,
  "data": [
    "🚨 CRITICAL PRIORITY: Delhi needs immediate intervention",
    "💧 Water & Sanitation: Deploy water purification units and safe drinking water",
    "🏥 Health: Set up medical camps and mental health counseling services"
  ]
}
```

#### Get Government-Specific Recommendations
```
GET /api/analytics/recommendations/govt/{region}
```

**Example:**
```
GET /api/analytics/recommendations/govt/Delhi
```

**Response:**
```json
{
  "success": true,
  "region": "Delhi",
  "riskScore": 75.5,
  "count": 5,
  "data": [
    "🚨 DECLARE CLIMATE EMERGENCY: Delhi",
    "💵 Budget Allocation: Allocate 50% more funds for climate resilience",
    "🏗️ Infrastructure: Fast-track drainage, flood barriers, and cooling centers"
  ]
}
```

#### Get Resource Allocation Suggestions
```
GET /api/analytics/resource-allocation/{region}
```

**Example:**
```
GET /api/analytics/resource-allocation/Delhi
```

**Response:**
```json
{
  "success": true,
  "region": "Delhi",
  "riskScore": 75.5,
  "allocation": {
    "Water & Sanitation": 30,
    "Medical Aid": 25,
    "Shelter": 20,
    "Food Security": 15,
    "Education": 10
  }
}
```

---

### 4. Visualization & Charts Endpoints

#### Risk Distribution (Pie Chart Data)
```
GET /api/analytics/charts/risk-distribution
```

**Response:**
```json
{
  "success": true,
  "chartType": "pie",
  "data": [
    {
      "name": "Critical",
      "value": 5,
      "color": "#d32f2f"
    },
    {
      "name": "High",
      "value": 10,
      "color": "#f57c00"
    },
    {
      "name": "Medium",
      "value": 4,
      "color": "#fbc02d"
    },
    {
      "name": "Low",
      "value": 2,
      "color": "#388e3c"
    }
  ]
}
```

#### Pollution Comparison (Bar Chart)
```
GET /api/analytics/charts/pollution
```

**Response:**
```json
{
  "success": true,
  "chartType": "bar",
  "data": [
    {
      "region": "Delhi",
      "pollution": 90,
      "color": "#ff6b6b"
    },
    {
      "region": "Kolkata",
      "pollution": 85,
      "color": "#ff6b6b"
    }
  ]
}
```

#### Temperature Trend (Bar Chart)
```
GET /api/analytics/charts/temperature
```

**Response:**
```json
{
  "success": true,
  "chartType": "bar",
  "data": [
    {
      "region": "Jaipur",
      "tempRise": 3.2,
      "color": "#ff4757"
    },
    {
      "region": "Delhi",
      "tempRise": 3.0,
      "color": "#ff4757"
    }
  ]
}
```

#### Heatmap Data
```
GET /api/analytics/charts/heatmap
```

**Response:**
```json
{
  "success": true,
  "chartType": "heatmap",
  "data": [
    {
      "region": "Delhi",
      "riskScore": 75.5,
      "color": "#d32f2f",
      "status": "Critical",
      "affectedPopulation": 2412000
    }
  ]
}
```

#### Equity Score Comparison
```
GET /api/analytics/charts/equity
```

**Response:**
```json
{
  "success": true,
  "chartType": "bar",
  "data": [
    {
      "region": "Chandigarh",
      "equityScore": 66.5,
      "color": "#2ecc71"
    }
  ]
}
```

---

### 5. Alerts & Insights Endpoints

#### Get Climate Alerts
```
GET /api/analytics/alerts
```

**Response:**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "region": "Delhi",
      "riskScore": 75.5,
      "status": "Critical",
      "color": "#d32f2f",
      "message": "⚠ Critical climate impact detected in Delhi",
      "priority": "CRITICAL"
    }
  ]
}
```

#### Get Overall Statistics
```
GET /api/analytics/statistics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRegions": 21,
    "averageRisk": 68.4,
    "criticalRegions": 5,
    "highRiskRegions": 10,
    "totalPopulation": 25000000,
    "affectedPopulation": 17100000,
    "percentageAffected": 68.4
  }
}
```

#### Get Dashboard Overview
```
GET /api/analytics/dashboard
```

**Response:**
```json
{
  "success": true,
  "statistics": {
    "totalRegions": 21,
    "averageRisk": 68.4,
    "criticalRegions": 5,
    "highRiskRegions": 10,
    "totalPopulation": 25000000,
    "affectedPopulation": 17100000,
    "percentageAffected": 68.4
  },
  "alerts": [
    // Top 5 alerts
  ],
  "totalRegions": 21
}
```

---

### 6. Health Check

#### API Health Status
```
GET /api/analytics/health
```

**Response:**
```json
{
  "status": "UP",
  "service": "EquiClimate Analytics",
  "version": "1.0",
  "timestamp": 1715420000000
}
```

---

## Error Responses

### 404 Not Found
```json
{
  "success": false,
  "message": "Region not found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid parameters"
}
```

---

## Response Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Server Error |

---

## Risk Score Formula

```
Risk Score = (Pollution × 0.3) + (Flood Risk × 0.3) + (Poverty × 0.2) + (Temperature Rise × 0.2)
```

### Risk Status Mapping
- **Critical**: Risk Score ≥ 75 → Color: #d32f2f (Red)
- **High**: Risk Score 50-75 → Color: #f57c00 (Orange)
- **Medium**: Risk Score 25-50 → Color: #fbc02d (Yellow)
- **Low**: Risk Score < 25 → Color: #388e3c (Green)

---

## Example cURL Commands

### Get All Regions
```bash
curl -X GET "http://localhost:8080/api/analytics/regions"
```

### Calculate Risk Score
```bash
curl -X POST "http://localhost:8080/api/analytics/calculate-risk?pollution=75&floodRisk=80&poverty=45&tempRise=2.5"
```

### Get Recommendations
```bash
curl -X POST "http://localhost:8080/api/analytics/recommendations?pollution=75&floodRisk=80&poverty=45&tempRise=2.5"
```

### Get NGO Recommendations
```bash
curl -X GET "http://localhost:8080/api/analytics/recommendations/ngo/Delhi"
```

### Get Government Recommendations
```bash
curl -X GET "http://localhost:8080/api/analytics/recommendations/govt/Delhi"
```

### Get Statistics
```bash
curl -X GET "http://localhost:8080/api/analytics/statistics"
```

---

## Rate Limiting
Currently not implemented. Production deployment should implement rate limiting (e.g., 1000 requests per hour).

---

## CORS Configuration
CORS is enabled for all origins. Production deployment should restrict to specific domains.

---

## Version History

### Version 1.0 (Current)
- Initial release
- 21 Indian cities with climate data
- AI-powered risk scoring
- Multi-role recommendations
- Real-time analytics APIs
- Chart data endpoints

---

## Support
For API issues, check:
1. Backend logs (terminal where `mvn spring-boot:run` is running)
2. Ensure correct base URL
3. Verify parameters are correct type and range
4. Check CORS configuration

---

**Last Updated**: May 2024
