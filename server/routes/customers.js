import express from 'express';
import prisma from '../database/connection.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET all customers (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(customers.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone || '',
      address: c.address || {},
      createdAt: c.createdAt,
      updatedAt: c.updatedAt
    })));
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET single customer
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      address: customer.address || {},
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// POST create customer
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const normalizedEmail = email.toLowerCase().trim();

    // Check if customer already exists
    let customer = await prisma.customer.findUnique({
      where: { email: normalizedEmail }
    });

    if (customer) {
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

    customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone: phone || null,
        address: address || {}
      }
    });

    res.status(201).json({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      address: customer.address || {},
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer', message: error.message });
  }
});

// PUT update customer (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone || null;
    if (address) updateData.address = address;

    const customer = await prisma.customer.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
    });

    res.json({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      address: customer.address || {},
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Customer not found' });
    }
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer', message: error.message });
  }
});

// DELETE customer (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.customer.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Customer not found' });
    }
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

export default router;
