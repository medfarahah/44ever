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
    // GET all products (public)
    if (method === 'GET' && !req.query.id) {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
      });
      
      return res.json(products.map(p => ({
        ...p,
        price: parseFloat(p.price.toString()),
        images: p.images.length > 0 ? p.images : [p.image]
      })));
    }

    // GET single product (public)
    if (method === 'GET' && req.query.id) {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(req.query.id) }
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

    // POST, PUT, DELETE require authentication
    const user = verifyToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Access token required' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // POST create product (admin only)
    if (method === 'POST') {
      const { name, category, price, description, featured, images } = req.body;
      
      const product = await prisma.product.create({
        data: {
          name,
          category,
          price: parseFloat(price),
          image: images?.[0] || '/images/default-product.jpg',
          images: images && images.length > 0 ? images : [images?.[0] || '/images/default-product.jpg'],
          rating: 5,
          featured: featured === 'true' || featured === true,
          description: description || ''
        }
      });
      
      return res.status(201).json({
        ...product,
        price: parseFloat(product.price.toString()),
        images: product.images.length > 0 ? product.images : [product.image]
      });
    }

    // PUT update product (admin only)
    if (method === 'PUT') {
      const { id, name, category, price, description, featured, images } = req.body;
      
      const existingProduct = await prisma.product.findUnique({
        where: { id: parseInt(id) }
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
        where: { id: parseInt(id) },
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
      const { id } = req.query;
      
      await prisma.product.delete({
        where: { id: parseInt(id) }
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
