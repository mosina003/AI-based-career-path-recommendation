# 🎯 AI based Career Path Generator

## 📋 Project Overview

An intelligent, full-stack web application that leverages AI and machine learning to provide personalized career recommendations for students. The system offers two distinct pathways for career prediction: an interactive quiz-based assessment and a manual skills input system, both powered by machine learning models trained on comprehensive career data.

## ✨ Key Features

### 🔐 **Authentication & Authorization**
- JWT-based secure authentication system
- User registration and login with email/password
- Protected API endpoints with token validation
- Role-based access control (USER/ADMIN)
- Password encryption using BCrypt

### 🎓 **Dual Career Prediction Pathways**

#### Path 1: Quiz-Based Assessment
- **5 Quiz Categories**: TechQuiz (7 questions), CodeChallenge (5 questions), InterestProfile (3 questions), ScenarioSolver (5 questions), Personality (5 questions)
- **25 Total Questions**: Comprehensive evaluation of technical skills, interests, and personality traits
- Real-time quiz submission and evaluation
- AI-powered scoring and analysis per category
- Machine learning models for accurate career predictions

#### Path 2: Manual Skills Input
- Direct input of technical skills, interests, and personality traits
- Instant career prediction based on user-provided data
- Flexible assessment for experienced professionals
- Quick results without quiz completion

### 🚀 **Career Guidance System**
- Personalized career recommendations based on comprehensive analysis
- Detailed career roadmaps with step-by-step guidance
- Match percentage scoring
- Multiple career path suggestions
- Industry-standard career profiles

### 📊 **User Dashboard**
- View prediction history
- Track quiz completion status
- Access saved career recommendations
- Manage user profile and preferences

## 🛠️ Technology Stack

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.5.6
- **Language**: Java 21
- **Security**: Spring Security with JWT authentication
- **Database**: MySQL (JPA/Hibernate)
- **Build Tool**: Maven
- **Key Dependencies**:
  - Spring Boot Starter Web
  - Spring Boot Starter Data JPA
  - Spring Boot Starter Security
  - MySQL Connector
  - Lombok
  - JWT Libraries

### Frontend (React)
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Routing**: React Router DOM 7.9.3
- **Language**: JavaScript (ES6+)
- **Styling**: CSS3 with modular component styles

### AI/ML Components
- **Python Scripts**: Multiple ML models for career prediction
- **Models**: Pre-trained models for each quiz category
  - TechQuiz Model (techquiz_model.pkl)
  - CodeChallenge Model (codechallenge_model.pkl)
  - InterestProfile Model (interest_profile_model.pkl)
  - ScenarioSolver Model (scenario_model.pkl)
  - Personality Model (personality_model.pkl)
- **Label Encoders**: For each category
- **Data**: Synthetic training datasets (CSV format)

## 📁 Project Structure

```
AI career path generator/
├── backend/                                    # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/careerpredictor/
│   │   │   │   ├── controller/              # REST API Controllers
│   │   │   │   │   ├── AuthController.java  # Authentication endpoints
│   │   │   │   │   ├── StudentController.java # Student management
│   │   │   │   │   ├── QuizController.java  # Quiz operations
│   │   │   │   │   ├── CareerPredictionController.java
│   │   │   │   │   └── RoadmapController.java
│   │   │   │   ├── entity/                  # Database entities
│   │   │   │   ├── dto/                     # Data Transfer Objects
│   │   │   │   ├── service/                 # Business logic
│   │   │   │   ├── repository/              # Database repositories
│   │   │   │   ├── util/                    # Utility classes (JWT)
│   │   │   │   └── config/                  # Security & app configuration
│   │   │   └── resources/
│   │   │       ├── application.properties   # Application configuration
│   │   │       └── data/                    # ML models & quiz data
│   │   │           ├── *.pkl                # Pre-trained ML models
│   │   │           ├── *.json               # Quiz question data
│   │   │           ├── *.py                 # Python ML scripts
│   │   │           └── *.csv                # Training datasets
│   │   └── test/                            # Unit tests
│   ├── pom.xml                              # Maven dependencies
│   ├── HYBRID_RECOMMENDATION_SYSTEM.md      # System architecture docs
│   ├── JWT_AUTHENTICATION_README.md         # Auth implementation guide
│   └── POSTMAN_TESTING_GUIDE.md            # API testing guide
│
└── frontend/                                # React Frontend
    ├── src/
    │   ├── components/                      # Reusable UI components
    │   │   ├── Navbar.jsx
    │   │   ├── CareerCard.jsx
    │   │   ├── QuizCard.jsx
    │   │   ├── RoadmapCard.jsx
    │   │   ├── Loader.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/                           # Application pages
    │   │   ├── Home.jsx                     # Landing page
    │   │   ├── Login.jsx                    # User login
    │   │   ├── Register.jsx                 # User registration
    │   │   ├── Dashboard.jsx                # User dashboard
    │   │   ├── Quiz.jsx                     # Quiz interface
    │   │   ├── ManualPrediction.jsx        # Manual input form
    │   │   ├── Results.jsx                  # Prediction results
    │   │   └── Profile.jsx                  # User profile
    │   ├── services/                        # API & Auth services
    │   │   ├── api.js                       # API client
    │   │   └── auth.js                      # Auth utilities
    │   ├── App.jsx                          # Main app component
    │   ├── main.jsx                         # Entry point
    │   └── index.css                        # Global styles
    ├── package.json                         # NPM dependencies
    └── vite.config.js                       # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- **Java Development Kit (JDK) 21** or higher
- **Node.js** (v16+) and **npm**
- **MySQL Server** (v8.0+)
- **Python 3.x** (for ML model execution)
- **Maven** (included via wrapper)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "AI career path generator/backend"
   ```

2. **Configure MySQL Database**
   
   Create a database:
   ```sql
   CREATE DATABASE career_predictor_db;
   ```
   
   Update `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/career_predictor_db
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```

3. **Configure JWT Secret**
   
   Update the JWT secret in `application.properties`:
   ```properties
   jwt.secret=your_secure_secret_key_here
   jwt.expiration=86400000
   ```

4. **Install Python Dependencies** (if needed for ML models)
   ```bash
   pip install scikit-learn pandas numpy
   ```

5. **Build and Run Backend**
   ```bash
   # Using Maven wrapper (Windows)
   .\mvnw.cmd clean install
   .\mvnw.cmd spring-boot:run
   
   # Using Maven wrapper (Linux/Mac)
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

   Backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend will start on `http://localhost:5173` (default Vite port)

## 📡 API Endpoints

### Authentication Endpoints (Public)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

### Student Endpoints (Protected)

#### Register Student Profile
```http
POST /api/students/register
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "name": "John Doe",
  "age": 22,
  "education": "Bachelor's in Computer Science"
}
```

### Quiz Endpoints (Protected)

#### Get All Quiz Questions
```http
GET /api/quiz/questions
Authorization: Bearer <jwt_token>
```

**Response:** Returns 25 questions across 5 categories

#### Submit Quiz for Prediction
```http
POST /api/students/{studentId}/predict/quiz
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "answers": {
    "1": "A",
    "2": "B",
    "3": "C",
    ...
    "25": "D"
  }
}
```

### Manual Prediction Endpoint (Protected)

#### Predict Career from Manual Input
```http
POST /api/students/{studentId}/predict/manual
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "technicalSkills": "Java, Python, React, SQL",
  "interests": "Web Development, Data Analysis",
  "personality": "Problem Solver, Team Player"
}
```

### Career & Roadmap Endpoints (Protected)

#### Get Career Recommendations
```http
GET /api/careers/predict
Authorization: Bearer <jwt_token>
```

#### Get Career Roadmap
```http
GET /api/roadmap/{careerPath}
Authorization: Bearer <jwt_token>
```

## 🔑 Environment Variables

### Backend (application.properties)
```properties
# Server Configuration
spring.application.name=career-path-predictor
server.port=8080

# MySQL Database
spring.datasource.url=jdbc:mysql://localhost:3306/career_predictor_db
spring.datasource.username=root
spring.datasource.password=your_password

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT Configuration
jwt.secret=your_secret_key_minimum_256_bits
jwt.expiration=86400000

# OpenAI (Optional for advanced AI features)
openai.api.key=your_openai_api_key
```

### Frontend
Create `.env` file in frontend directory:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
./mvnw test
```

### API Testing with Postman
- Import the Postman collection: `Career-Path-Predictor-Postman-Collection.json`
- Refer to `POSTMAN_TESTING_GUIDE.md` for detailed testing instructions

### Frontend Testing
```bash
cd frontend
npm run lint
```

## 📊 Database Schema

### Core Tables
- **users**: User authentication and authorization
- **students**: Student profiles and information
- **quiz_results**: Quiz submission records
- **predictions**: Career prediction history
- **careers**: Available career paths
- **roadmaps**: Career development roadmaps

## 🎯 ML Models & Data

The system uses pre-trained machine learning models located in `backend/src/main/resources/data/`:

- **TechQuiz Model**: Evaluates technical knowledge
- **CodeChallenge Model**: Assesses coding abilities
- **InterestProfile Model**: Analyzes career interests
- **ScenarioSolver Model**: Tests problem-solving skills
- **Personality Model**: Evaluates personality traits

Each model includes:
- `.pkl` model file
- `.pkl` label encoder
- `.json` question data
- `.csv` training data

## 🔒 Security Features

- **JWT Token Authentication**: Secure token-based authentication
- **Password Encryption**: BCrypt hashing for password security
- **CORS Configuration**: Controlled cross-origin resource sharing
- **Role-Based Access**: USER and ADMIN role separation
- **Protected Routes**: Frontend route protection
- **Token Expiration**: Automatic token invalidation after 24 hours

## 🚀 Deployment

### Backend Deployment
1. Build the JAR file:
   ```bash
   ./mvnw clean package
   ```
2. Deploy `target/demo-0.0.1-SNAPSHOT.jar` to your server
3. Run with: `java -jar demo-0.0.1-SNAPSHOT.jar`

### Frontend Deployment
1. Build production bundle:
   ```bash
   npm run build
   ```
2. Deploy the `dist/` folder to your hosting service (Netlify, Vercel, etc.)

### Database Deployment
- Ensure MySQL server is accessible
- Update connection strings in production `application.properties`
- Run database migrations if needed

## 📚 Additional Documentation

- **[HYBRID_RECOMMENDATION_SYSTEM.md](backend/HYBRID_RECOMMENDATION_SYSTEM.md)**: Detailed system architecture and implementation
- **[JWT_AUTHENTICATION_README.md](backend/JWT_AUTHENTICATION_README.md)**: JWT authentication setup guide
- **[POSTMAN_TESTING_GUIDE.md](backend/POSTMAN_TESTING_GUIDE.md)**: Comprehensive API testing guide
- **[STUDENT_FIXES_README.md](backend/STUDENT_FIXES_README.md)**: Student entity fixes and improvements

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Verify MySQL is running: `mysql -u root -p`
- Check database credentials in `application.properties`
- Ensure port 8080 is available

**Frontend can't connect to backend:**
- Verify backend is running on port 8080
- Check CORS configuration in backend
- Ensure API base URL is correct

**JWT Token Issues:**
- Verify token is being sent in Authorization header
- Check token expiration time
- Ensure JWT secret is properly configured

**ML Model Errors:**
- Verify Python is installed and accessible
- Check that all `.pkl` model files exist in `resources/data/`
- Ensure scikit-learn version compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push to branch: `git push origin feature/YourFeature`
5. Open a Pull Request

---

**Built with ❤️ using Spring Boot, React, and Machine Learning**
