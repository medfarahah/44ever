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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET all gift sets (public)
    if (method === 'GET') {
      try {
        const giftSets = await prisma.giftSet.findMany({
          orderBy: { createdAt: 'desc' }
        });

        return res.json(giftSets.map(set => ({
          ...set,
          price: parseFloat(set.price.toString()),
          originalPrice: set.originalPrice ? parseFloat(set.originalPrice.toString()) : null,
          products: Array.isArray(set.products) ? set.products : JSON.parse(set.products || '[]'),
          images: set.images && set.images.length > 0 ? set.images : [set.image]
        })));
      } catch (dbError) {
        // If table doesn't exist yet, return empty array
        if (dbError.code === 'P2021' || dbError.message?.includes('does not exist')) {
          console.warn('GiftSets table does not exist yet, returning empty array');
          return res.json([]);
        }
        throw dbError;
      }
    }

    // POST, PUT, DELETE require admin authentication
    const user = verifyToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Access token required' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // POST create gift set (admin only)
    if (method === 'POST') {
      try {
        const { name, description, price, originalPrice, image, images, products, featured, inStock, stockCount } = req.body;

        // Validate required fields
        if (!name || price === undefined || price === null) {
          return res.status(400).json({
            error: 'Missing required fields',
            message: 'Name and price are required'
          });
        }

        // Validate price
        const priceValue = parseFloat(price);
        if (isNaN(priceValue) || priceValue <= 0) {
          return res.status(400).json({
            error: 'Invalid price',
            message: 'Price must be a positive number'
          });
        }

        // Ensure images array exists
        let imageArray = [];
        if (images && Array.isArray(images) && images.length > 0) {
          imageArray = images.filter(img => img && typeof img === 'string' && img.trim() !== '');
        }

        // If no images provided, use default
        const mainImage = imageArray.length > 0 ? imageArray[0] : (image || '/images/default-product.jpg');
        if (imageArray.length === 0) {
          imageArray = [mainImage];
        }

        // Ensure products is an array
        const productsArray = Array.isArray(products) ? products : [];

        const giftSet = await prisma.giftSet.create({
          data: {
            name: name.trim(),
            description: description ? description.trim() : null,
            price: priceValue,
            originalPrice: originalPrice ? parseFloat(originalPrice) : null,
            image: mainImage,
            images: imageArray,
            products: productsArray,
            rating: 5,
            featured: featured === true || featured === 'true',
            inStock: inStock !== false,
            stockCount: stockCount ? parseInt(stockCount) : null
          }
        });

        return res.status(201).json({
          ...giftSet,
          price: parseFloat(giftSet.price.toString()),
          originalPrice: giftSet.originalPrice ? parseFloat(giftSet.originalPrice.toString()) : null,
          products: Array.isArray(giftSet.products) ? giftSet.products : JSON.parse(giftSet.products || '[]'),
          images: giftSet.images && giftSet.images.length > 0 ? giftSet.images : [giftSet.image]
        });
      } catch (dbError) {
        // If table doesn't exist yet, return helpful error
        if (dbError.code === 'P2021' || dbError.message?.includes('does not exist') || dbError.message?.includes('Unknown model')) {
          console.error('GiftSet table does not exist:', dbError);
          return res.status(500).json({
            error: 'Database table not found',
            message: 'GiftSet table does not exist. Please run: npx prisma db push --schema=server/prisma/schema.prisma',
            code: 'TABLE_NOT_FOUND'
          });
        }
        throw dbError;
      }
    }

    // PUT and DELETE are handled by api/gift-sets/[id].js
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Gift Sets API error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Handle specific Prisma errors
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
