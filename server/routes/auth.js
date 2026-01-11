import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken, authenticateToken } from '../middleware/auth.js';
import prisma from '../database/connection.js';

const router = express.Router();

// Admin credentials (in production, use a database)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// POST register (create new user)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: 'user'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });
    
    // Generate token
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error code:', error.code);
    console.error('Error meta:', error.meta);
    
    // Return more detailed error for debugging
    const errorMessage = error.message || 'Unknown error';
    const errorCode = error.code || 'UNKNOWN';
    
    // Handle Prisma errors specifically
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: 'User with this email already exists',
        code: 'DUPLICATE_EMAIL'
      });
    }
    
    res.status(500).json({ 
      error: 'Registration failed', 
      message: errorMessage,
      code: errorCode,
      details: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        meta: error.meta,
        code: error.code
      } : undefined
    });
  }
});

// POST login (user)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Check if it's hardcoded admin login (legacy support)
    if (email === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = generateToken({ id: 0, username: ADMIN_USERNAME, role: 'admin' });
      return res.json({
        token,
        user: {
          id: 0,
          username: ADMIN_USERNAME,
          role: 'admin'
        }
      });
    }
    
    // Find user by email (check database)
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate token
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
});

// POST verify token
router.post('/verify', authenticateToken, (req, res) => {
  try {
    res.json({ 
      valid: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ error: 'Token verification failed' });
  }
});

// GET current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // If admin
    if (req.user.role === 'admin' && req.user.id === 0) {
      return res.json({
        id: 0,
        username: ADMIN_USERNAME,
        role: 'admin'
      });
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        address: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user', message: error.message });
  }
});

// PUT update user profile
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    // Admin can't update profile this way
    if (req.user.role === 'admin' && req.user.id === 0) {
      return res.status(400).json({ error: 'Admin profile cannot be updated via this endpoint' });
    }
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone || null;
    if (address) updateData.address = address;
    
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        address: true,
        updatedAt: true
      }
    });
    
    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user', message: error.message });
  }
});

// POST create admin user (admin only)
router.post('/create-admin', authenticateToken, async (req, res) => {
  try {
    // Check if requester is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create admin users' });
    }

    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create admin user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: 'admin'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });
    
    res.status(201).json({
      message: 'Admin user created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ error: 'Failed to create admin user', message: error.message });
  }
});

// PUT update user role (admin only)
router.put('/users/:id/role', authenticateToken, async (req, res) => {
  try {
    // Check if requester is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update user roles' });
    }

    const { role } = req.body;
    const userId = parseInt(req.params.id);
    
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Valid role (user or admin) is required' });
    }
    
    // Prevent changing the hardcoded admin (id: 0)
    if (userId === 0) {
      return res.status(400).json({ error: 'Cannot change role of system admin' });
    }
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        updatedAt: true
      }
    });
    
    res.json({
      message: `User role updated to ${role}`,
      user
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Failed to update user role', message: error.message });
  }
});

// GET all users (admin only)
router.get('/users', authenticateToken, async (req, res) => {
  try {
    // Check if requester is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can view all users' });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users', message: error.message });
  }
});

// POST change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    // Admin can't change password this way
    if (req.user.role === 'admin' && req.user.id === 0) {
      return res.status(400).json({ error: 'Admin password cannot be changed via this endpoint' });
    }
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password', message: error.message });
  }
});

export default router;
