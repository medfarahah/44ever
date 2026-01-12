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
    return res.status(400).json({ error: 'Product ID is required' });
  }

  const productId = parseInt(id);
  
  if (isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    // GET single product (public)
    if (method === 'GET') {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      return res.json({
        ...product,
        price: parseFloat(product.price.toString()),
        images: product.images.length > 0 ? product.images : [product.image]
      });
    }

    // PUT and DELETE require admin authentication
    const user = verifyToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Access token required' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // PUT update product (admin only)
    if (method === 'PUT') {
      const { name, category, price, description, featured, images } = req.body;
      
      const existingProduct = await prisma.product.findUnique({
        where: { id: productId }
      });
      
      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      const updateData = {};
      if (name) updateData.name = name;
      if (category) updateData.category = category;
      if (price) updateData.price = parseFloat(price);
      if (description !== undefined) updateData.description = description;
      if (featured !== undefined) updateData.featured = featured === 'true' || featured === true;
      if (images && images.length > 0) {
        updateData.image = images[0];
        updateData.images = images;
      }
      
      const product = await prisma.product.update({
        where: { id: productId },
        data: updateData
      });
      
      return res.json({
        ...product,
        price: parseFloat(product.price.toString()),
        images: product.images.length > 0 ? product.images : [product.image]
      });
    }

    // DELETE product (admin only)
    if (method === 'DELETE') {
      // Check if product exists first
      const existingProduct = await prisma.product.findUnique({
        where: { id: productId }
      });
      
      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      await prisma.product.delete({
        where: { id: productId }
      });
      
      return res.json({ message: 'Product deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Products API error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(500).json({ error: 'Request failed', message: error.message });
  }
}
