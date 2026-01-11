# Setup Guide

## Quick Start

1. **Install all dependencies:**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

2. **Create environment file:**
   ```bash
   # Copy the example file
   cd server
   copy .env.example .env
   cd ..
   ```
   
   Or manually create `server/.env`:
   ```env
   PORT=5000
   JWT_SECRET=your-secret-key-change-in-production
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

3. **Start the application:**
   ```bash
   # Run both frontend and backend
   npm run dev:all
   ```
   
   Or run separately:
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend
   npm run dev:backend
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api
   - Admin Panel: http://localhost:5173/admin/login

## Default Admin Credentials

- Username: `admin`
- Password: `admin123`

## API Documentation

The backend API is available at `http://localhost:5000/api`

### Endpoints:

- **Products**: `/api/products`
- **Orders**: `/api/orders`
- **Franchise**: `/api/franchise`
- **Customers**: `/api/customers`
- **Auth**: `/api/auth/login`

See `server/README.md` for detailed API documentation.
