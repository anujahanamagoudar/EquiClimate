# EquiClimate Backend

Spring Boot REST API backend for the EquiClimate application.

## Prerequisites

- Java 11+
- Maven 3.6+
- H2 Database (in-memory, included)

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/anujahanamagoudar/EquiClimate.git
   cd EquiClimate/backend
   ```

2. **Build the project**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```
   
   The backend will start on `http://localhost:8081`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user/{id}` - Get user by ID

### Regions
- `GET /api/regions` - Get all regions
- `POST /api/region` - Add new region
- `GET /api/high-risk` - Get high-risk regions (gap score > 0.5)

### Alerts
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create new alert

### Support
- `GET /api/support` - Get all support entries
- `POST /api/support` - Create new support entry

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create new note

## Database

The application uses H2 in-memory database which is automatically initialized on startup.

Access H2 console: `http://localhost:8081/h2-console`

## Configuration

Update `src/main/resources/application.properties` for configuration:
- Server port: `server.port=8081`
- CORS is enabled for `http://localhost:3000`

## Frontend Integration

The React frontend expects the backend to run on `http://localhost:8081`. Both services can run simultaneously:

1. **Terminal 1 - Backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Terminal 2 - Frontend**
   ```bash
   cd frontend
   npm start
   ```

The app will be available at `http://localhost:3000`
