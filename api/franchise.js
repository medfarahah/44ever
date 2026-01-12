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
    // GET all applications (admin only)
    if (method === 'GET') {
      const user = verifyToken(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const applications = await prisma.franchiseApplication.findMany({
        orderBy: { createdAt: 'desc' }
      });
      
      return res.json(applications.map(app => ({
        id: app.id,
        firstName: app.firstName,
        lastName: app.lastName,
        email: app.email,
        phone: app.phone,
        company: app.company || '',
        location: app.location,
        investmentRange: app.investmentRange,
        experience: app.experience,
        message: app.message,
        status: app.status,
        date: app.date,
        notes: app.notes || '',
        createdAt: app.createdAt
      })));
    }

    // POST create application (public)
    if (method === 'POST') {
      const { firstName, lastName, email, phone, company, location, investmentRange, experience, message } = req.body;

      if (!firstName || !lastName || !email || !phone) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const application = await prisma.franchiseApplication.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          company: company || '',
          location: location || '',
          investmentRange: investmentRange || '',
          experience: experience || '',
          message: message || '',
          status: 'pending',
          date: new Date()
        }
      });

      return res.status(201).json({
        id: application.id,
        message: 'Application submitted successfully'
      });
    }

    // PUT update application (admin only)
    if (method === 'PUT') {
      const user = verifyToken(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { id, status, notes } = req.body;

      const application = await prisma.franchiseApplication.update({
        where: { id: parseInt(id) },
        data: {
          status: status || undefined,
          notes: notes !== undefined ? notes : undefined
        }
      });

      return res.json({
        id: application.id,
        status: application.status,
        notes: application.notes
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Franchise API error:', error);
    res.status(500).json({ error: 'Request failed', message: error.message });
  }
}
