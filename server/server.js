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
  : process.env.NODE_ENV === 'production' 
    ? [] // In production, require FRONTEND_URL to be set
    : ['http://localhost:5173', 'http://localhost:3000', '*']; // Development defaults

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize database (seed data)
// Don't block server startup if database init fails
initializeDatabase().catch(err => {
  console.error('⚠️ Failed to initialize database:', err.message);
  console.error('Server will continue, but database operations may fail.');
});

// Routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/franchise', franchiseRouter);
app.use('/api/customers', customersRouter);
app.use('/api/auth', authRouter);

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// Start server
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

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
