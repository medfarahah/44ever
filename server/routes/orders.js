import express from 'express';
import prisma from '../database/connection.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET all orders (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        user: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      user: order.user ? {
        id: order.user.id,
        name: order.user.name,
        email: order.user.email
      } : null,
      customer: order.customer ? {
        id: order.customer.id,
        name: order.customer.name,
        email: order.customer.email
      } : null,
      items: order.items,
      shipping: order.shipping,
      payment: order.payment,
      total: parseFloat(order.total.toString()),
      status: order.status,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    })));
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET single order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        customer: true,
        user: true
      }
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({
      id: order.id,
      orderNumber: order.orderNumber,
      user: order.user ? {
        id: order.user.id,
        name: order.user.name,
        email: order.user.email
      } : null,
      customer: order.customer ? {
        id: order.customer.id,
        name: order.customer.name,
        email: order.customer.email
      } : null,
      items: order.items,
      shipping: order.shipping,
      payment: order.payment,
      total: parseFloat(order.total.toString()),
      status: order.status,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// POST create order
router.post('/', async (req, res) => {
  try {
    const { items, shipping, payment, customer } = req.body;
    
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderNumber = `ORD-${Date.now()}`;
    
    // Get user ID from token if authenticated
    let userId = null;
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        const jwt = await import('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        const decoded = jwt.default.verify(token, JWT_SECRET);
        if (decoded.id && decoded.role === 'user') {
          userId = decoded.id;
        }
      }
    } catch (e) {
      // Not authenticated, continue as guest
    }
    
    // Create or get customer
    let customerId = null;
    if (customer && customer.email) {
      let existingCustomer = await prisma.customer.findUnique({
        where: { email: customer.email }
      });
      
      if (!existingCustomer) {
        existingCustomer = await prisma.customer.create({
          data: {
            name: customer.name || `${shipping.firstName} ${shipping.lastName}`,
            email: customer.email,
            phone: customer.phone || shipping.phone,
            address: customer.address || {}
          }
        });
      }
      customerId = existingCustomer.id;
    }
    
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        customerId,
        items,
        shipping,
        payment,
        total,
        status: 'Pending'
      }
    });
    
    res.status(201).json({
      id: order.id,
      orderNumber: order.orderNumber,
      items: order.items,
      customer: customerId ? { id: customerId } : customer,
      shipping: order.shipping,
      payment: order.payment,
      total: parseFloat(order.total.toString()),
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', message: error.message });
  }
});

// PUT update order status (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
    });
    
    res.json({
      id: order.id,
      orderNumber: order.orderNumber,
      items: order.items,
      shipping: order.shipping,
      payment: order.payment,
      total: parseFloat(order.total.toString()),
      status: order.status,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Order not found' });
    }
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order', message: error.message });
  }
});

// DELETE order (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.order.delete({
      where: { id: parseInt(req.params.id) }
    });
    
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Order not found' });
    }
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router;
