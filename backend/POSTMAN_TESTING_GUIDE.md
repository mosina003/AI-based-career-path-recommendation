# 🚀 Postman Testing Guide - JWT Authentication

## Backend Status
✅ **Your backend should be running on:** `http://localhost:8080`
✅ **Started with:** `mvn spring-boot:run`

---

## 📝 **Step-by-Step Postman Testing**

### **Step 1: Test Server Connection**

**Request:**
```
Method: GET
URL: http://localhost:8080/api/auth/validate
```

**Expected Result:** 
- ❌ Should return `401 Unauthorized` (this means server is running but endpoint needs authentication)

---

### **Step 2: Register a New User** 

**Request:**
```
Method: POST
URL: http://localhost:8080/api/auth/register
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
}
```

**Expected Success Response (201 Created):**
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInN1YiI6InRlc3R1c2VyIiwiaWF0IjoxNzI3NTg2MDAwLCJleHAiOjE3Mjc2NzI0MDB9.signature",
    "username": "testuser",
    "role": "USER",
    "message": "Authentication successful"
}
```

**⚠️ IMPORTANT:** Copy the `token` value for next steps!

---

### **Step 3: Test Login (Alternative to Registration)**

**Request:**
```
Method: POST
URL: http://localhost:8080/api/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
    "username": "testuser",
    "password": "password123"
}
```

**Expected Response (200 OK):**
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "username": "testuser",
    "role": "USER",
    "message": "Authentication successful"
}
```

---

### **Step 4: Test Protected Endpoint**

**Request:**
```
Method: GET
URL: http://localhost:8080/api/careers/test
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInN1YiI6InRlc3R1c2VyIiwiaWF0IjoxNzI3NTg2MDAwLCJleHAiOjE3Mjc2NzI0MDB9.YOUR_TOKEN_HERE
```
⚠️ **Replace `YOUR_TOKEN_HERE` with the actual token from Step 2!**

**Expected Success Response (200 OK):**
```
Hello testuser! JWT authentication is working.
```

---

### **Step 5: Test Career Prediction Endpoint**

**Request:**
```
Method: GET
URL: http://localhost:8080/api/careers/predict?skills=Python,Java,Machine Learning
```

**Headers:**
```
Authorization: Bearer YOUR_ACTUAL_TOKEN_HERE
```

**Expected Response:**
```
User: testuser - [AI Career Advice Response]
```

---

### **Step 6: Validate JWT Token**

**Request:**
```
Method: GET
URL: http://localhost:8080/api/auth/validate
```

**Headers:**
```
Authorization: Bearer YOUR_ACTUAL_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
{
    "token": "your_token",
    "username": "testuser",
    "role": "USER",
    "message": "Authentication successful"
}
```

---

## 🔧 **Postman Setup Instructions**

### **1. Create New Collection**
- Open Postman
- Click "New" → "Collection"
- Name: "Career Path Predictor API"

### **2. Add Environment Variables**
- Click "Environment" tab (top right)
- Create "Local Development" environment
- Add variables:
  ```
  base_url = http://localhost:8080
  jwt_token = (leave empty, will be set after login)
  ```

### **3. Configure Requests**

#### **For Registration/Login requests:**
- Method: POST
- URL: `{{base_url}}/api/auth/register`
- Headers: `Content-Type: application/json`
- Body: Raw JSON (see examples above)

#### **For Protected requests:**
- Method: GET
- URL: `{{base_url}}/api/careers/test`
- Headers: `Authorization: Bearer {{jwt_token}}`

---

## 🚨 **Common Issues & Solutions**

### **❌ Error 1: Connection Refused**
```
Could not get any response
```
**Solution:** 
- Ensure backend is running: `mvn spring-boot:run`
- Check if port 8080 is free
- Verify URL: `http://localhost:8080`

### **❌ Error 2: 401 Unauthorized**
```json
{
    "message": "Invalid or expired token"
}
```
**Solutions:**
- Check Authorization header format: `Bearer TOKEN`
- Ensure no extra spaces in token
- Token might be expired (24 hours) - login again

### **❌ Error 3: 400 Bad Request**
```json
{
    "message": "Username already exists"
}
```
**Solution:** Use different username or test login instead

### **❌ Error 4: 500 Internal Server Error**
**Solutions:**
- Check backend console for detailed error logs
- Ensure MySQL database is running
- Verify database connection in `application.properties`

---

## 📊 **Testing Checklist**

- [ ] ✅ Server responds (any response = server is running)
- [ ] ✅ User registration works (201 Created + JWT token)
- [ ] ✅ User login works (200 OK + JWT token) 
- [ ] ✅ Protected endpoint works with token (200 OK)
- [ ] ✅ Protected endpoint fails without token (401 Unauthorized)
- [ ] ✅ Token validation works (200 OK)
- [ ] ✅ Career prediction endpoint works with authentication

---

## 🎯 **Quick Test Sequence**

1. **POST** `/api/auth/register` → Get JWT token
2. **GET** `/api/careers/test` with token → Should work
3. **GET** `/api/careers/test` without token → Should fail (401)
4. **POST** `/api/auth/login` with same credentials → Should work

---

## 💡 **Pro Tips**

1. **Save tokens**: Copy JWT tokens to Postman environment variables
2. **Check expiry**: Tokens expire in 24 hours - re-login if needed
3. **Test both**: Try both registration and login endpoints
4. **Monitor console**: Watch backend console for detailed error logs
5. **Database check**: Ensure MySQL is running and `career_predictor_db` exists

---

**🚀 Your JWT authentication is ready to test!** Start with the registration endpoint and work your way through the checklist.