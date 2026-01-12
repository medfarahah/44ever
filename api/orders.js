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
    // GET all orders (admin only)
    if (method === 'GET') {
      const user = verifyToken(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const orders = await prisma.order.findMany({
        include: {
          customer: true,
          user: true
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return res.json(orders.map(order => ({
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
        createdAt: order.createdAt
      })));
    }

    // POST create order (public, but can include userId if logged in)
    if (method === 'POST') {
      const { items, shipping, payment, total, userId } = req.body;

      if (!items || !shipping || !payment || total === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create customer if not logged in
      let customerId = null;
      if (!userId) {
        // Check if customer already exists by email
        let customer = await prisma.customer.findUnique({
          where: { email: shipping.email || '' }
        });
        
        if (!customer) {
          customer = await prisma.customer.create({
            data: {
              name: `${shipping.firstName} ${shipping.lastName}`,
              email: shipping.email || '',
              phone: shipping.phone || '',
              address: shipping
            }
          });
        }
        customerId = customer.id;
      }

      const order = await prisma.order.create({
        data: {
          orderNumber,
          userId: userId || null,
          customerId: customerId,
          items,
          shipping,
          payment,
          total: parseFloat(total),
          status: 'Pending'
        },
        include: {
          customer: true,
          user: true
        }
      });

      return res.status(201).json({
        id: order.id,
        orderNumber: order.orderNumber,
        items: order.items,
        shipping: order.shipping,
        payment: order.payment,
        total: parseFloat(order.total.toString()),
        status: order.status
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Orders API error:', error);
    res.status(500).json({ error: 'Request failed', message: error.message });
  }
}
