# API Testing Checklist After Deployment

Use this checklist to verify all API endpoints are working after deployment.

## Prerequisites

1. Backend is deployed and running
2. Backend URL is accessible (e.g., `https://your-backend.railway.app`)
3. `VITE_API_URL` is set in Vercel environment variables

## Testing Steps

### 1. Health Check ✅

**Endpoint:** `GET /api/health`

**Test:**
```bash
curl https://your-backend-url.com/api/health
```

**Expected:** `{"status":"ok","message":"Server is running"}`

---

### 2. Authentication Endpoints

#### A. User Registration ✅

**Endpoint:** `POST /api/auth/register`

**Test:**
```bash
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123456"
  }'
```

**Expected:** Returns token and user object

#### B. User Login ✅

**Endpoint:** `POST /api/auth/login`

**Test:**
```bash
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

**Expected:** Returns token and user object

#### C. Admin Login ✅

**Endpoint:** `POST /api/auth/login`

**Test (Hardcoded Admin):**
```bash
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin",
    "password": "admin123"
  }'
```

**Test (Database Admin):**
```bash
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lorgroup.dj@gmail.com",
    "password": "their-password"
  }'
```

**Expected:** Returns token with `role: "admin"`

#### D. Get Current User ✅

**Endpoint:** `GET /api/auth/me`

**Test:**
```bash
curl https://your-backend-url.com/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected:** Returns user profile

---

### 3. Products Endpoints

#### A. Get All Products ✅

**Endpoint:** `GET /api/products`

**Test:**
```bash
curl https://your-backend-url.com/api/products
```

**Expected:** Returns array of products

#### B. Get Single Product ✅

**Endpoint:** `GET /api/products/:id`

**Test:**
```bash
curl https://your-backend-url.com/api/products/1
```

**Expected:** Returns single product object

#### C. Create Product (Admin Only) ✅

**Endpoint:** `POST /api/products`

**Test:**
```bash
curl -X POST https://your-backend-url.com/api/products \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -F "name=Test Product" \
  -F "category=Serum" \
  -F "price=49.99" \
  -F "description=Test description" \
  -F "images=@/path/to/image.jpg"
```

**Expected:** Returns created product

---

### 4. Orders Endpoints

#### A. Get All Orders (Admin Only) ✅

**Endpoint:** `GET /api/orders`

**Test:**
```bash
curl https://your-backend-url.com/api/orders \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected:** Returns array of orders

#### B. Create Order ✅

**Endpoint:** `POST /api/orders`

**Test:**
```bash
curl -X POST https://your-backend-url.com/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"id": 1, "name": "Product", "price": 49.99, "quantity": 1}],
    "shipping": {
      "firstName": "John",
      "lastName": "Doe",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA",
      "phone": "1234567890"
    },
    "payment": {
      "method": "card"
    },
    "total": 49.99
  }'
```

**Expected:** Returns created order

---

### 5. Franchise Endpoints

#### A. Get All Applications (Admin Only) ✅

**Endpoint:** `GET /api/franchise`

**Test:**
```bash
curl https://your-backend-url.com/api/franchise \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected:** Returns array of franchise applications

#### B. Create Franchise Application ✅

**Endpoint:** `POST /api/franchise`

**Test:**
```bash
curl -X POST https://your-backend-url.com/api/franchise \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "franchise@example.com",
    "phone": "1234567890",
    "company": "Test Company",
    "location": "New York",
    "investmentRange": "$50,000 - $100,000",
    "experience": "5 years",
    "message": "Interested in franchise opportunity"
  }'
```

**Expected:** Returns created application

---

### 6. Customers Endpoints

#### A. Get All Customers (Admin Only) ✅

**Endpoint:** `GET /api/customers`

**Test:**
```bash
curl https://your-backend-url.com/api/customers \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected:** Returns array of customers

#### B. Create Customer ✅

**Endpoint:** `POST /api/customers`

**Test:**
```bash
curl -X POST https://your-backend-url.com/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "customer@example.com",
    "phone": "1234567890",
    "address": {"street": "123 Main St", "city": "New York"}
  }'
```

**Expected:** Returns created customer

---

## Quick Test Script

Run the automated test:

```bash
cd server
npm run test-api https://your-backend-url.com/api
```

## Common Issues & Solutions

### ❌ "Cannot connect to server"
- **Solution:** Verify backend is deployed and running
- Check backend URL is correct
- Verify `VITE_API_URL` is set in Vercel

### ❌ CORS Errors
- **Solution:** Add your Vercel domain to `FRONTEND_URL` in backend environment variables
- Format: `https://your-app.vercel.app,https://your-custom-domain.com`

### ❌ 401 Unauthorized
- **Solution:** Check if token is valid
- Verify token is being sent in Authorization header
- Check if user has correct role (admin vs user)

### ❌ 500 Internal Server Error
- **Solution:** Check backend logs
- Verify database connection
- Check environment variables are set correctly

### ❌ Database Connection Errors
- **Solution:** Verify `DATABASE_URL` is set correctly
- Check Neon database is accessible
- Ensure Prisma Client is generated

## Testing from Browser Console

You can also test from your browser console on the deployed site:

```javascript
// Test health check
fetch('https://your-backend-url.com/api/health')
  .then(r => r.json())
  .then(console.log);

// Test products
fetch('https://your-backend-url.com/api/products')
  .then(r => r.json())
  .then(console.log);
```
