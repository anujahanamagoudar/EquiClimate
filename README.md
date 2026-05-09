# EquiClimate

**AI-based climate inequality intelligence for communities and decision makers.**

EquiClimate is a platform that identifies regions where environmental impact is high despite lower contribution levels, helping citizens, government officials, and NGOs understand and address climate inequality.

## Project Structure

```
EquiClimate/
├── frontend/          React web application
│   ├── src/
│   │   ├── components/    UI components for all user types
│   │   ├── utils/         API client, mock data, utilities
│   │   └── App.js
│   └── package.json
│
└── backend/           Spring Boot REST API
    ├── src/
    │   ├── controller/    REST endpoints
    │   ├── model/         Data models
    │   ├── repository/    Data persistence
    │   ├── service/       Business logic
    │   └── config/        Configuration
    ├── pom.xml
    └── README.md          Backend setup guide
```

## Quick Start

### Prerequisites
- Node.js 14+
- Java 11+
- Maven 3.6+
- Git

### 1. Clone Repository
```bash
git clone https://github.com/anujahanamagoudar/EquiClimate.git
cd EquiClimate
```

### 2. Start Backend (Spring Boot on port 8081)
```bash
cd backend
mvn spring-boot:run
```

### 3. Start Frontend (React on port 3000)
```bash
cd frontend
npm install
npm start
```

The application will be available at `http://localhost:3000`

## Features

### For Citizens
- View personalized climate risk analysis for their location
- Compare vulnerability scores across regions
- Access government relief schemes and support programs
- Receive community alerts

### For Government Officials
- Create and manage climate relief schemes
- Monitor high-risk regions
- Track regional emissions and contribute metrics
- Adjust policies based on inequality gaps

### For NGOs
- Post support services (health camps, water stations, etc.)
- Issue community alerts
- Document region-specific interventions
- Track resource allocation

## User Roles & Endpoints

| Role | Endpoints | Permissions |
|------|-----------|------------|
| **Citizen** | `/dashboard/citizen` | View regions, schemes, alerts |
| **Government** | `/dashboard/government` | Manage schemes, view regions |
| **NGO** | `/dashboard/ngo` | Manage support, alerts, notes |

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /user/{id}` - Get user profile

### Data (`/api`)
- `GET /regions` - All regions
- `GET /high-risk` - High-risk regions
- `GET /alerts` - Community alerts
- `GET /support` - Support services
- `GET /notes` - Regional notes

## Key Metrics

The platform calculates three critical scores for each region:

1. **Contribution Score** - Environmental impact (AQI, emissions, temperature)
2. **Vulnerability Score** - Population susceptibility (income, population density)
3. **Gap Score** - Inequality gap (vulnerability - contribution)

Regions with high gap scores represent climate inequalities requiring immediate attention.

## Technology Stack

**Frontend:**
- React 19
- Axios for API calls
- Mock fallback for offline functionality
- CSS for styling

**Backend:**
- Spring Boot 3.x
- JPA/Hibernate
- H2 Database
- REST API
- CORS enabled

## Features & Status

- ✅ User authentication (register/login)
- ✅ Role-based dashboards (Citizen, Government, NGO)
- ✅ Region data management
- ✅ Mock data fallback (works offline)
- ✅ CORS configuration
- ✅ H2 in-memory database
- 🔄 Dashboard analytics (in progress)
- 🔄 Data visualization (in progress)

## Running Tests

Backend:
```bash
cd backend
mvn test
```

Frontend:
```bash
cd frontend
npm test
```

## Development Mode

Frontend falls back to mock data if backend is unavailable:

```bash
# Only Frontend (uses mock data)
cd frontend
npm start
```

The app will work with demo data stored in localStorage.

## Documentation

- [Backend Setup Guide](./backend/README.md)
- [Frontend Setup Guide](./frontend/README.md)

## API Response Format

### Success Response
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "Citizen",
  "message": "Success message"
}
```

### Error Response
```json
{
  "message": "Error description",
  "status": 400
}
```

## Database Schema

### Users Table
- id (Primary Key)
- email (Unique)
- password
- name
- role (Citizen/Government/NGO)

### Regions Table
- id
- city
- aqi
- temperature
- income
- populationDensity
- emissions
- vulnerabilityScore
- gapScore

## Configuration

### Frontend (`frontend/src/config.js`)
```javascript
API_BASE_URL = http://localhost:8081
```

### Backend (`backend/src/main/resources/application.properties`)
```properties
server.port=8081
spring.datasource.url=jdbc:h2:mem:testdb
spring.h2.console.enabled=true
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

---

**EquiClimate** - Making climate action equitable for all communities.
