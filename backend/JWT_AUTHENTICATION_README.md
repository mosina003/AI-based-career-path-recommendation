# JWT Authentication Setup - Career Path Predictor

## Overview
JWT (JSON Web Token) authentication has been successfully implemented in your Spring Boot application. This provides secure token-based authentication for your REST API endpoints.

## What's Included

### 🔐 **Security Components**
- **User Entity**: Complete user management with roles (USER/ADMIN)
- **JWT Utilities**: Token generation, validation, and parsing
- **Security Configuration**: Protected and public endpoints
- **Authentication Filter**: Intercepts and validates JWT tokens
- **Password Encryption**: BCrypt password hashing

### 📡 **API Endpoints**

#### **Public Endpoints (No Authentication Required)**
```
POST /api/auth/register - Register new user
POST /api/auth/login    - Login and get JWT token
POST /api/students/register - Register student profile
```

#### **Protected Endpoints (JWT Required)**
```
GET  /api/auth/validate    - Validate JWT token
GET  /api/careers/predict  - Get career predictions
GET  /api/careers/test     - Test JWT authentication
GET  /api/students/**      - Student operations
POST /api/quiz/**          - Quiz operations
```

## 🚀 How to Use

### 1. **Register a New User**
```bash
POST /api/auth/register
Content-Type: application/json

{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securePassword123"
}
```

**Response:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "username": "john_doe",
    "role": "USER",
    "message": "Authentication successful"
}
```

### 2. **Login Existing User**
```bash
POST /api/auth/login
Content-Type: application/json

{
    "username": "john_doe",
    "password": "securePassword123"
}
```

### 3. **Access Protected Endpoints**
```bash
GET /api/careers/test
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Response:**
```
Hello john_doe! JWT authentication is working.
```

## 🔧 Configuration

### **JWT Settings** (application.properties)
```properties
jwt.secret=mySecretKey123456789012345678901234567890123456789012345678901234567890
jwt.expiration=86400000  # 24 hours in milliseconds
```

### **Database Schema**
A new `users` table will be automatically created with columns:
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique) 
- `password` (Encrypted)
- `role` (USER/ADMIN)
- `enabled` (Boolean)
- `created_at` (Timestamp)

## 🛠️ Testing with Tools

### **Using Postman/Insomnia**

1. **Register/Login** to get JWT token
2. **Copy the token** from response
3. **Add Authorization header** to protected requests:
   - Header: `Authorization`
   - Value: `Bearer YOUR_JWT_TOKEN_HERE`

### **Using cURL**
```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Test protected endpoint
curl -X GET http://localhost:8080/api/careers/test \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔒 Security Features

- **Password Encryption**: BCrypt hashing
- **Token Expiration**: Configurable (default 24 hours)
- **Role-based Access**: USER and ADMIN roles
- **CORS Support**: Configured for cross-origin requests
- **Stateless Sessions**: No server-side session storage

## 🚨 Important Notes

1. **Change the JWT Secret**: Update `jwt.secret` in production with a strong, unique key
2. **HTTPS in Production**: Always use HTTPS in production environments
3. **Token Storage**: Store tokens securely on the client side
4. **Token Refresh**: Consider implementing refresh tokens for longer sessions

## 🔍 Troubleshooting

### **Common Issues:**

1. **401 Unauthorized**: Check if token is included in Authorization header
2. **403 Forbidden**: User may not have required role for the endpoint
3. **Token Expired**: Login again to get a new token
4. **Invalid Token Format**: Ensure "Bearer " prefix is included

### **Error Responses:**
```json
{
    "message": "Invalid username or password"
}
```
```json
{
    "message": "Invalid or expired token"
}
```

Your JWT authentication system is now fully operational! 🎉