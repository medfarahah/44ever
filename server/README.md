# 44ever Backend API

Node.js/Express backend for the 44ever e-commerce platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/:id` - Get single order (admin only)
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order (admin only)
- `DELETE /api/orders/:id` - Delete order (admin only)

### Franchise Applications
- `GET /api/franchise` - Get all applications (admin only)
- `GET /api/franchise/:id` - Get single application (admin only)
- `POST /api/franchise` - Create application
- `PUT /api/franchise/:id` - Update application (admin only)
- `DELETE /api/franchise/:id` - Delete application (admin only)

### Customers
- `GET /api/customers` - Get all customers (admin only)
- `GET /api/customers/:id` - Get single customer (admin only)
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer (admin only)
- `DELETE /api/customers/:id` - Delete customer (admin only)

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Verify token

## Authentication

Admin routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Database

This application uses **PostgreSQL** with **Prisma ORM**.

### Setup

1. Install PostgreSQL on your system
2. Create a database named `44ever`
3. Configure `DATABASE_URL` in `.env` file:
   ```
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/44ever?schema=public"
   ```

4. Generate Prisma Client:
   ```bash
   npm run db:generate
   ```

5. Run database migrations:
   ```bash
   npm run db:migrate
   ```

6. Start the server (data will be seeded automatically):
   ```bash
   npm run dev
   ```

See `PRISMA_SETUP.md` for detailed setup instructions.

## File Uploads

Product images are uploaded to `uploads/products/` directory.
