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

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET settings (public - for frontend display)
    if (method === 'GET') {
      try {
        const settings = await prisma.settings.findMany();
        
        // Convert array to object for easier access
        const settingsObj = settings.reduce((acc, setting) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {});
        
        // Return defaults if no settings exist
        return res.json({
          storeName: settingsObj.storeName || 'FOREVER',
          email: settingsObj.email || 'admin@forever.com',
          phone: settingsObj.phone || '+1 (555) 123-4567',
          ...settingsObj
        });
      } catch (dbError) {
        // If table doesn't exist yet, return defaults
        if (dbError.code === 'P2021' || dbError.message?.includes('does not exist')) {
          console.warn('Settings table does not exist yet, returning defaults');
          return res.json({
            storeName: 'FOREVER',
            email: 'admin@forever.com',
            phone: '+1 (555) 123-4567'
          });
        }
        throw dbError;
      }
    }

    // PUT update settings (admin only)
    if (method === 'PUT') {
      const user = verifyToken(req);
      if (!user) {
        return res.status(401).json({ error: 'Access token required' });
      }

      if (user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { storeName, email, phone } = req.body;

      // Update or create each setting
      const updates = [];
      
      if (storeName !== undefined) {
        updates.push(
          prisma.settings.upsert({
            where: { key: 'storeName' },
            update: { value: storeName },
            create: { key: 'storeName', value: storeName, description: 'Store name displayed on frontend' }
          })
        );
      }

      if (email !== undefined) {
        updates.push(
          prisma.settings.upsert({
            where: { key: 'email' },
            update: { value: email },
            create: { key: 'email', value: email, description: 'Store contact email' }
          })
        );
      }

      if (phone !== undefined) {
        updates.push(
          prisma.settings.upsert({
            where: { key: 'phone' },
            update: { value: phone },
            create: { key: 'phone', value: phone, description: 'Store contact phone' }
          })
        );
      }

      await Promise.all(updates);

      // Return updated settings
      try {
        const settings = await prisma.settings.findMany();
        const settingsObj = settings.reduce((acc, setting) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {});

        return res.json({
          storeName: settingsObj.storeName || 'FOREVER',
          email: settingsObj.email || 'admin@forever.com',
          phone: settingsObj.phone || '+1 (555) 123-4567',
          ...settingsObj
        });
      } catch (dbError) {
        // If table doesn't exist yet, return what was sent
        if (dbError.code === 'P2021' || dbError.message?.includes('does not exist')) {
          console.warn('Settings table does not exist yet');
          return res.json({
            storeName: storeName || 'FOREVER',
            email: email || 'admin@forever.com',
            phone: phone || '+1 (555) 123-4567'
          });
        }
        throw dbError;
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Settings API error:', error);
    res.status(500).json({ 
      error: 'Request failed', 
      message: error.message 
    });
  }
}
