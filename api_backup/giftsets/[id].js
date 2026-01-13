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
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Gift Set ID is required' });
  }

  const giftSetId = parseInt(id);

  if (isNaN(giftSetId)) {
    return res.status(400).json({ error: 'Invalid Gift Set ID' });
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET single gift set (public)
    if (method === 'GET') {
      try {
        const giftSet = await prisma.giftSet.findUnique({
          where: { id: giftSetId }
        });

        if (!giftSet) {
          return res.status(404).json({ error: 'Gift Set not found' });
        }

        return res.json({
          ...giftSet,
          price: parseFloat(giftSet.price.toString()),
          originalPrice: giftSet.originalPrice ? parseFloat(giftSet.originalPrice.toString()) : null,
          products: Array.isArray(giftSet.products) ? giftSet.products : JSON.parse(giftSet.products || '[]'),
          images: giftSet.images.length > 0 ? giftSet.images : [giftSet.image]
        });
      } catch (dbError) {
        if (dbError.code === 'P2021' || dbError.message?.includes('does not exist')) {
          return res.status(404).json({ error: 'Gift Set not found' });
        }
        throw dbError;
      }
    }

    // PUT and DELETE require admin authentication
    const user = verifyToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Access token required' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // PUT update gift set (admin only)
    if (method === 'PUT') {
      const existingGiftSet = await prisma.giftSet.findUnique({
        where: { id: giftSetId }
      });

      if (!existingGiftSet) {
        return res.status(404).json({ error: 'Gift Set not found' });
      }

      const { name, description, price, originalPrice, image, images, products, featured, inStock, stockCount } = req.body;

      const updateData = {};
      if (name) updateData.name = name.trim();
      if (description !== undefined) updateData.description = description ? description.trim() : null;
      if (price !== undefined) updateData.price = parseFloat(price);
      if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
      if (featured !== undefined) updateData.featured = featured === 'true' || featured === true;
      if (inStock !== undefined) updateData.inStock = inStock !== false;
      if (stockCount !== undefined) updateData.stockCount = stockCount ? parseInt(stockCount) : null;
      if (products !== undefined) updateData.products = Array.isArray(products) ? products : [];
      
      if (images && Array.isArray(images) && images.length > 0) {
        const validImages = images
          .filter(img => img && typeof img === 'string' && img.trim() !== '')
          .map(img => img.trim());

        if (validImages.length > 0) {
          updateData.image = validImages[0];
          updateData.images = validImages;
        }
      } else if (image) {
        updateData.image = image;
        updateData.images = [image];
      }

      const giftSet = await prisma.giftSet.update({
        where: { id: giftSetId },
        data: updateData
      });

      return res.json({
        ...giftSet,
        price: parseFloat(giftSet.price.toString()),
        originalPrice: giftSet.originalPrice ? parseFloat(giftSet.originalPrice.toString()) : null,
        products: Array.isArray(giftSet.products) ? giftSet.products : JSON.parse(giftSet.products || '[]'),
        images: giftSet.images.length > 0 ? giftSet.images : [giftSet.image]
      });
    }

    // DELETE gift set (admin only)
    if (method === 'DELETE') {
      const existingGiftSet = await prisma.giftSet.findUnique({
        where: { id: giftSetId }
      });

      if (!existingGiftSet) {
        return res.status(404).json({ error: 'Gift Set not found' });
      }

      await prisma.giftSet.delete({
        where: { id: giftSetId }
      });

      return res.json({ message: 'Gift Set deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Gift Sets API error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);

    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Gift Set not found' });
    }

    // Handle table not found error
    if (error.code === 'P2021' || error.message?.includes('does not exist') || error.message?.includes('Unknown model')) {
      return res.status(500).json({
        error: 'Database table not found',
        message: 'GiftSet table does not exist. Please run: npx prisma db push --schema=server/prisma/schema.prisma',
        code: 'TABLE_NOT_FOUND'
      });
    }

    res.status(500).json({ 
      error: 'Request failed', 
      message: error.message,
      code: error.code
    });
  }
}
