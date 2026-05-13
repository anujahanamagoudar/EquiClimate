# EquiClimate - AI-Powered Climate Intelligence & Equity Platform

## 🌍 Project Overview

EquiClimate is a comprehensive AI-powered platform designed to analyze climate inequality and recommend targeted interventions for vulnerable populations. The platform uses advanced analytics, machine learning, and real-time data visualization to help governments, NGOs, and citizens understand and address climate equity issues.

### 🎯 Key Features

- **AI-Powered Risk Scoring**: Calculates climate risk using weighted factors (pollution, flood risk, poverty, temperature rise)
- **Climate Inequality Analysis**: Identifies vulnerable regions and populations
- **Smart Recommendations**: AI-driven suggestions for governments, NGOs, and citizens
- **Real-time Visualization**: Interactive heatmaps, charts, and analytics dashboards
- **Multi-role Support**: Customized interfaces for Citizens, Government, and NGOs
- **Resource Allocation**: Intelligent distribution of resources based on risk assessment
- **Equity Scoring**: Measures climate resilience and vulnerability

---

## 📁 Project Structure

```
EquiClimate/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/example/demo/
│   │       ├── controller/
│   │       │   ├── AnalyticsController.java      ⭐ NEW
│   │       │   ├── AuthController.java
│   │       │   ├── RegionController.java
│   │       │   ├── AlertsController.java
│   │       │   ├── NotesController.java
│   │       │   └── SupportController.java
│   │       ├── service/
│   │       │   ├── ClimateAnalysisService.java   ⭐ NEW
│   │       │   ├── RecommendationService.java    ⭐ NEW
│   │       │   ├── DemoDataLoader.java           ⭐ NEW
│   │       │   └── RegionService.java
│   │       ├── model/
│   │       ├── repository/
│   │       ├── dto/
│   │       ├── config/
│   │       └── DemoApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── data/
│   │       └── climate-data.json                 ⭐ NEW
│   └── pom.xml
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalyticsDashboard.jsx            ⭐ NEW
│   │   │   ├── AnalyticsDashboard.css            ⭐ NEW
│   │   │   ├── CitizenDashboard.jsx
│   │   │   ├── GovtDashboard.jsx
│   │   │   ├── NGODashboard.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── utils/
│   │   ├── App.js                                (UPDATED)
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Backend**: Java 11+, Maven 3.6+
- **Database**: MySQL 5.7+
- **Frontend**: Node.js 14+, npm 6+
- **Git**: For version control

### 1. Backend Setup

#### Step 1: Navigate to backend directory
```bash
cd backend
```

#### Step 2: Configure MySQL Database
Create database and user:
```sql
CREATE DATABASE equiclimate;
CREATE USER 'equiclimate_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON equiclimate.* TO 'equiclimate_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Step 3: Update application.properties
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/equiclimate
spring.datasource.username=equiclimate_user
spring.datasource.password=password123
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.application.name=EquiClimate

# Server Configuration
server.port=8080
server.servlet.context-path=/

# Logging
logging.level.root=INFO
```

#### Step 4: Build and Run
```bash
# Clean build
mvn clean install

# Run the application
mvn spring-boot:run

# OR run the JAR file
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

The backend will be available at: **http://localhost:8080**

### 2. Frontend Setup

#### Step 1: Navigate to frontend directory
```bash
cd frontend
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Configure API endpoint
Create/update `.env` file:
```
REACT_APP_API_URL=http://localhost:8080
```

#### Step 4: Start development server
```bash
npm start
```

The frontend will open at: **http://localhost:3000**

---

## 📊 API Endpoints

### Analytics API

#### Climate Data
- `GET /api/analytics/regions` - Get all regions with climate data
- `GET /api/analytics/region/{name}` - Get specific region details
- `GET /api/analytics/search?q=keyword` - Search regions

#### Risk Analysis
- `GET /api/analytics/risk` - Get all risk scores
- `GET /api/analytics/high-risk` - Get high-risk regions (risk ≥ 50)
- `GET /api/analytics/critical` - Get critical regions (risk ≥ 75)
- `POST /api/analytics/calculate-risk` - Calculate risk score

**Parameters**: `pollution`, `floodRisk`, `poverty`, `tempRise`

#### Recommendations
- `POST /api/analytics/recommendations` - Get AI recommendations
- `GET /api/analytics/recommendations/ngo/{region}` - NGO recommendations
- `GET /api/analytics/recommendations/govt/{region}` - Government recommendations
- `GET /api/analytics/resource-allocation/{region}` - Resource allocation suggestions

#### Charts & Visualization
- `GET /api/analytics/charts/risk-distribution` - Risk distribution pie chart
- `GET /api/analytics/charts/pollution` - Pollution comparison bar chart
- `GET /api/analytics/charts/temperature` - Temperature trend data
- `GET /api/analytics/charts/heatmap` - Risk heatmap data
- `GET /api/analytics/charts/equity` - Equity score comparison

#### Alerts & Insights
- `GET /api/analytics/alerts` - Get climate alerts
- `GET /api/analytics/statistics` - Get overall statistics
- `GET /api/analytics/dashboard` - Get dashboard overview
- `GET /api/analytics/by-status/{status}` - Get regions by status
- `GET /api/analytics/health` - Health check endpoint

---

## 🧮 Risk Scoring Formula

```
Risk Score = (Pollution × 0.3) + (Flood Risk × 0.3) + (Poverty × 0.2) + (Temp Rise × 0.2)
```

### Risk Status Classification
- **Critical**: Risk Score ≥ 75 (Requires immediate intervention)
- **High**: Risk Score 50-75 (Significant attention needed)
- **Medium**: Risk Score 25-50 (Regular monitoring)
- **Low**: Risk Score < 25 (Stable condition)

### Equity Score
```
Equity Score = 100 - Risk Score
```
(Higher equity score = more resilient region)

---

## 🤖 AI Features

### 1. Climate Analysis Service
- Calculates multi-factor risk assessment
- Provides risk status and color coding
- Computes climate equity scores
- Analyzes high-risk regions

### 2. Recommendation Engine
- **Pollution-based recommendations**: Tree planting, emission controls, air quality monitoring
- **Flood-based recommendations**: Drainage systems, flood shelters, early warning systems
- **Poverty-based recommendations**: Livelihood support, skill development, food security
- **Temperature-based recommendations**: Cooling centers, urban greenery, renewable energy

### 3. Role-Specific Intelligence
- **Government**: Policy recommendations, budget allocation, emergency protocols
- **NGOs**: Priority areas, resource needs, targeted interventions
- **Citizens**: Personal impact assessment, local actions, community resources

### 4. Predictive Analytics
- Identifies vulnerable populations
- Forecasts climate impact severity
- Suggests preventive measures

---

## 📈 Demo Data

The application includes 21 Indian cities with realistic climate data:
- **Delhi, Mumbai, Bangalore, Kolkata, Chennai**
- **Hyderabad, Pune, Ahmedabad, Jaipur, Lucknow**
- **Chandigarh, Indore, Surat, Nagpur, Bhopal**
- **Vadodara, Visakhapatnam, Coimbatore, Ranchi, Guwahati, Thiruvananthapuram**

Each region has:
- Pollution index (0-100)
- Flood risk (0-100)
- Poverty level (0-100)
- Temperature rise (°C)
- Calculated risk score
- Status classification
- Equity score

---

## 🎨 User Interfaces

### 1. Analytics Dashboard
- **Overview Tab**: Charts and statistics
- **Regions Tab**: Detailed region information with recommendations
- **Heatmap Tab**: Visual representation of risk distribution
- **Alerts Tab**: Real-time climate alerts and notifications

### 2. Citizen Dashboard
- Personal climate impact assessment
- Local alerts and notifications
- Community resources
- Analytics insights

### 3. Government Dashboard
- Regional policy recommendations
- Budget allocation suggestions
- Emergency response protocols
- Comparative analysis

### 4. NGO Dashboard
- Priority regions for intervention
- Resource allocation guidance
- Vulnerable population identification
- Impact measurement metrics

---

## 🔧 Customization

### Adding New Regions
Edit `DemoDataLoader.java`:
```java
String[][] regionData = {
    {"City Name", "pollution", "flood", "poverty", "tempRise"},
    // Add more regions...
};
```

### Modifying Risk Formula
Edit `ClimateAnalysisService.calculateRiskScore()`:
```java
public double calculateRiskScore(...) {
    return (pollution * weight1) + (floodRisk * weight2) + (poverty * weight3) + (tempRise * weight4);
}
```

### Adding New Recommendations
Edit `RecommendationService.generateRecommendations()`:
```java
if (someCondition) {
    recommendations.add("Your new recommendation");
}
```

---

## 🐛 Troubleshooting

### Backend Issues

**Issue**: Port 8080 already in use
```bash
# Find process using port
lsof -i :8080
# Kill process
kill -9 <PID>
```

**Issue**: Database connection failed
- Check MySQL is running: `mysql -u root -p`
- Verify connection string in `application.properties`
- Ensure database and user exist

**Issue**: Maven build fails
```bash
# Clean cache and rebuild
mvn clean install -DskipTests
```

### Frontend Issues

**Issue**: API requests failing
- Verify backend is running on http://localhost:8080
- Check `.env` file has correct `REACT_APP_API_URL`
- Check CORS is enabled in `CorsConfig.java`

**Issue**: Port 3000 already in use
```bash
# Use different port
PORT=3001 npm start
```

**Issue**: Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Environment Variables

### Backend (.env or application.properties)
```
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/equiclimate
SPRING_DATASOURCE_USERNAME=equiclimate_user
SPRING_DATASOURCE_PASSWORD=password123
SERVER_PORT=8080
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8080
REACT_APP_ENV=development
```

---

## 🏆 Hackathon Presentation Tips

### Key Points to Emphasize
1. **AI-Powered Intelligence**: Demonstrates technical sophistication
2. **Climate Equity Focus**: Addresses UN SDG 10 (Reduce Inequalities)
3. **Actionable Insights**: Real recommendations that governments can implement
4. **Multi-stakeholder Design**: Different interfaces for different users
5. **Real-time Analytics**: Dynamic data visualization and insights

### Demo Flow
1. Show main dashboard with climate data
2. Display risk heatmap highlighting vulnerable regions
3. Show AI recommendations for a high-risk region
4. Switch between different user roles (Citizen, Government, NGO)
5. Demonstrate analytics insights and predictions
6. Highlight unique equity score concept

### Talking Points
- "We use AI to identify climate inequality patterns"
- "Our risk scoring helps governments allocate resources efficiently"
- "Real-time alerts enable rapid response to climate emergencies"
- "Multi-role system ensures all stakeholders have actionable insights"
- "Climate equity is not just an environmental issue—it's a social justice issue"

---

## 📚 Tech Stack

- **Backend**: Spring Boot 2.x, Spring Data JPA, MySQL
- **Frontend**: React 18, Recharts, CSS3
- **Analytics**: Custom ML algorithms, Data visualization
- **API**: RESTful API with JSON responses
- **Database**: MySQL with Hibernate ORM

---

## 📄 License

This project is open source and available for educational and hackathon purposes.

---

## 👥 Team

- **Backend Developer**: Spring Boot + Analytics Services
- **Frontend Developer**: React UI + Components
- **AI/Analytics Person**: Climate Intelligence + Recommendations

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review API documentation
3. Examine sample API responses
4. Check browser console for frontend errors
5. Check terminal for backend logs

---

## 🎓 Learning Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [RESTful API Best Practices](https://restfulapi.net/)
- [Climate Data Analysis](https://www.ipcc.ch/)

---

## 🌱 Future Enhancements

- ML model training on historical climate data
- Integration with real-time weather APIs
- Mobile app for citizen engagement
- Social impact measurement dashboard
- Blockchain for transparent fund allocation
- IoT sensor integration for real-time monitoring
- Carbon footprint calculator
- Climate action marketplace

---

**Made with ❤️ for Climate Equity** 🌍💚
