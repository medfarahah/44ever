import prisma from '../../server/database/connection.js';
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
  const { id } = req.query; // Vercel automatically extracts [id] from URL path

  if (!id) {
    return res.status(400).json({ error: 'Customer ID is required' });
  }

  const customerId = parseInt(id);

  if (isNaN(customerId)) {
    return res.status(400).json({ error: 'Invalid customer ID' });
  }

  try {
    // All endpoints require admin authentication
    const user = verifyToken(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // GET single customer
    if (method === 'GET') {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId }
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

    // PUT update customer
    if (method === 'PUT') {
      const { name, email, phone, address } = req.body;

      const existingCustomer = await prisma.customer.findUnique({
        where: { id: customerId }
      });

      if (!existingCustomer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email.toLowerCase().trim();
      if (phone !== undefined) updateData.phone = phone || null;
      if (address) updateData.address = address;

      const customer = await prisma.customer.update({
        where: { id: customerId },
        data: updateData
      });

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

    // DELETE customer
    if (method === 'DELETE') {
      const existingCustomer = await prisma.customer.findUnique({
        where: { id: customerId }
      });

      if (!existingCustomer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      await prisma.customer.delete({
        where: { id: customerId }
      });

      return res.json({ message: 'Customer deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Customers API error:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Customer not found' });
    }

    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }

    res.status(500).json({ error: 'Request failed', message: error.message });
  }
}
