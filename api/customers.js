import prisma from '../server/database/connection.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper to verify token
function verifyToken(req) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return null;
  
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  const { method } = req;

  try {
    // All endpoints require admin authentication
    const user = verifyToken(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // GET all customers
    if (method === 'GET' && !req.query.id) {
      const customers = await prisma.customer.findMany({
        orderBy: { createdAt: 'desc' }
      });

      return res.json(customers.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone || '',
        address: c.address || {},
        createdAt: c.createdAt,
        updatedAt: c.updatedAt
      })));
    }

    // GET single customer
    if (method === 'GET' && req.query.id) {
      const customer = await prisma.customer.findUnique({
        where: { id: parseInt(req.query.id) }
      });

      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      return res.json({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        address: customer.address || {},
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt
      });
    }

    // POST create customer
    if (method === 'POST') {
      const { name, email, phone, address } = req.body;

      const customer = await prisma.customer.create({
        data: {
          name,
          email,
          phone: phone || null,
          address: address || {}
        }
      });

      return res.status(201).json({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      });
    }

    // PUT update customer
    if (method === 'PUT') {
      const { id, name, email, phone, address } = req.body;

      const customer = await prisma.customer.update({
        where: { id: parseInt(id) },
        data: {
          name: name || undefined,
          email: email || undefined,
          phone: phone !== undefined ? phone : undefined,
          address: address || undefined
        }
      });

      return res.json({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      });
    }

    // DELETE customer
    if (method === 'DELETE') {
      const { id } = req.query;

      await prisma.customer.delete({
        where: { id: parseInt(id) }
      });

      return res.json({ message: 'Customer deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Customers API error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.status(500).json({ error: 'Request failed', message: error.message });
  }
}
