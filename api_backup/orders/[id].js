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
    return res.status(400).json({ error: 'Order ID is required' });
  }

  const orderId = parseInt(id);

  if (isNaN(orderId)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  try {
    // GET single order (admin only)
    if (method === 'GET') {
      const user = verifyToken(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          customer: true,
          user: true
        }
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      return res.json({
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
    }

    // PUT update order (admin only)
    if (method === 'PUT') {
      const user = verifyToken(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { status, notes } = req.body;

      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId }
      });

      if (!existingOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const updateData = {};
      if (status) {
        // Validate status
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        }
        updateData.status = status;
      }
      if (notes !== undefined) {
        updateData.notes = notes;
      }

      const order = await prisma.order.update({
        where: { id: orderId },
        data: updateData,
        include: {
          customer: true,
          user: true
        }
      });

      return res.json({
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
    }

    // DELETE order (admin only)
    if (method === 'DELETE') {
      const user = verifyToken(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId }
      });

      if (!existingOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }

      await prisma.order.delete({
        where: { id: orderId }
      });

      return res.json({ message: 'Order deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Orders API error:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(500).json({ error: 'Request failed', message: error.message });
  }
}
