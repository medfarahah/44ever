# API Testing Guide

After deploying your backend, use this guide to test all API endpoints.

## Quick Test

Run the automated test script:

```bash
cd server
npm run test-api
```

Or test a deployed backend:

```bash
npm run test-api https://your-backend-url.com/api
```

## Manual Testing

### 1. Health Check

```bash
curl https://your-backend-url.com/api/health
```

Expected: `{"status":"ok","message":"Server is running"}`

### 2. Authentication Endpoints

#### Register User
```bash
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123456",
    "phone": "1234567890"
  }'
```

#### Login User
```bash
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

#### Admin Login (Hardcoded)
```bash
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin",
    "password": "admin123"
  }'
```

#### Get Current User (Protected)
```bash
curl https://your-backend-url.com/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Products Endpoints

#### Get All Products
```bash
curl https://your-backend-url.com/api/products
```

#### Get Single Product
```bash
curl https://your-backend-url.com/api/products/1
```

#### Create Product (Admin Only)
```bash
curl -X POST https://your-backend-url.com/api/products \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "category": "Serum",
    "price": 49.99,
    "description": "Test product description"
  }'
```

### 4. Orders Endpoints

#### Get All Orders (Admin Only)
```bash
curl https://your-backend-url.com/api/orders \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

#### Create Order
```bash
curl -X POST https://your-backend-url.com/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"id": 1, "name": "Product", "price": 49.99, "quantity": 1}],
    "shipping": {"firstName": "John", "lastName": "Doe", "address": "123 Main St"},
    "payment": {"method": "card"},
    "total": 49.99
  }'
```

### 5. Franchise Endpoints

#### Get All Applications (Admin Only)
```bash
curl https://your-backend-url.com/api/franchise \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

#### Create Franchise Application
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
    "message": "Interested in franchise"
  }'
```

### 6. Customers Endpoints

#### Get All Customers (Admin Only)
```bash
curl https://your-backend-url.com/api/customers \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## Testing Checklist

- [ ] Health check endpoint works
- [ ] User registration works
- [ ] User login works
- [ ] Admin login works (both hardcoded and database admin)
- [ ] Products can be fetched
- [ ] Orders can be created
- [ ] Franchise applications can be submitted
- [ ] Protected endpoints require authentication
- [ ] Admin-only endpoints require admin role
- [ ] CORS allows requests from your Vercel domain

## Common Issues

### CORS Errors
- Make sure backend CORS is configured to allow your Vercel domain
- Check `server/server.js` CORS settings

### 401 Unauthorized
- Check if token is being sent in Authorization header
- Verify token is valid and not expired

### 500 Internal Server Error
- Check backend logs
- Verify database connection
- Check environment variables are set correctly

### Connection Refused
- Verify backend is deployed and running
- Check the backend URL is correct
- Ensure `VITE_API_URL` is set in Vercel
