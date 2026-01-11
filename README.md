# 44ever E-commerce Platform

A modern e-commerce platform built with React, Vite, and Node.js/Express.

## Features

- 🛍️ Product catalog with multiple images
- 🛒 Shopping cart functionality
- 💳 Checkout process
- 👤 Admin dashboard
- 📦 Order management
- 🤝 Franchise application system
- 👥 Customer management

## Project Structure

```
44ever/
├── src/              # Frontend React application
├── server/           # Backend Node.js/Express API
└── public/           # Static assets
```

## Setup Instructions

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 4. Run the Application

**Option 1: Run both frontend and backend together**
```bash
npm run dev:all
```

**Option 2: Run separately**

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
npm run dev:backend
```

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `GET /api/orders` - Get all orders (admin only)
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order (admin only)

### Franchise Applications
- `GET /api/franchise` - Get all applications (admin only)
- `POST /api/franchise` - Create application
- `PUT /api/franchise/:id` - Update application (admin only)

### Authentication
- `POST /api/auth/login` - Admin login

## Admin Credentials

- Username: `admin`
- Password: `admin123`

## Technologies Used

### Frontend
- React 18
- Vite
- React Router
- Tailwind CSS
- Motion (Framer Motion)
- Lucide Icons

### Backend
- Node.js
- Express.js
- Multer (file uploads)
- JWT (authentication)
- JSON file storage

## Development

The backend uses JSON files for data storage (located in `server/data/`). In production, consider migrating to a database like MongoDB or PostgreSQL.
