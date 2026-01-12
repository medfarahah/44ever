import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../server/database/connection.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function generateToken(user) {
  const payload = {
    id: user.id,
    role: user.role || 'user',
    ...(user.email && { email: user.email }),
    ...(user.username && { username: user.username })
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check hardcoded admin
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

    // Find user in database
    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
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
}
