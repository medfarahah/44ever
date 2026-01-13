import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import franchiseRouter from './routes/franchise.js';
import customersRouter from './routes/customers.js';
import authRouter from './routes/auth.js';
import initializeDatabase from './database/init.js';
import prisma from './database/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Log startup info
console.log('');
console.log('═══════════════════════════════════════');
console.log('🔧 Starting Server...');
console.log('═══════════════════════════════════════');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`PORT: ${process.env.PORT || '5000 (default)'}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ NOT SET'}`);
console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL || 'Not set'}`);
console.log('═══════════════════════════════════════');
console.log('');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['*']; // Fallback to all origins to fix deployment blocking requests

app.use(cors({
  origin: (origin, callback) => {
    // In production, log the origin and FRONTEND_URL for debugging
    if (process.env.NODE_ENV === 'production') {
      console.log(`[CORS] Request from origin: ${origin}`);
      console.log(`[CORS] Allowed origins: ${allowedOrigins.join(', ')}`);
    }

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked origin: ${origin}. Not in: ${allowedOrigins.join(', ')}`);
      // In production, if FRONTEND_URL is missing, we might want to be more helpful
      if (allowedOrigins.length === 0 && process.env.NODE_ENV === 'production') {
        console.warn('⚠️ FRONTEND_URL is not set in production. CORS will block all requests.');
      }
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize database (seed data) - only in development
// In production, we assume migrations/data push have been done
if (process.env.NODE_ENV !== 'production') {
  initializeDatabase().catch(err => {
    console.error('⚠️ Failed to initialize database:', err.message);
  });
}

// Routes
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url} from ${req.headers.origin || 'unknown'}`);
  next();
});

app.get('/api/test-db', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    res.json({
      status: 'Database Connected',
      userCount,
      productCount,
      env: process.env.NODE_ENV
    });
  } catch (err) {
    res.status(500).json({
      status: 'Database Connection Failed',
      error: err.message,
      code: err.code
    });
  }
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the 44ever API',
    status: 'Running',
    endpoints: ['/api/products', '/api/auth', '/api/health']
  });
});

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/franchise', franchiseRouter);
app.use('/api/customers', customersRouter);
app.use('/api/auth', authRouter);

// Health check endpoints
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// Start server
// Start server only if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('🚀 Server Started Successfully!');
    console.log('═══════════════════════════════════════');
    console.log(`📍 Listening on: 0.0.0.0:${PORT}`);
    console.log(`🌐 Local: http://localhost:${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log(`💚 Health: http://localhost:${PORT}/health`);
    console.log(`💚 Health: http://localhost:${PORT}/api/health`);
    console.log('═══════════════════════════════════════');
    console.log('');

    // Log environment info
    console.log('Environment:');
    console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  PORT: ${PORT}`);
    console.log(`  DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Not set'}`);
    console.log(`  FRONTEND_URL: ${process.env.FRONTEND_URL || 'Not set (CORS may block requests)'}`);
    console.log('');
  });

  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use. Please use a different port.`);
      process.exit(1);
    } else {
      console.error('❌ Server error:', error);
      process.exit(1);
    }
  });
}

export default app;


// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
