import express from 'express';
import prisma from '../database/connection.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET all franchise applications (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const applications = await prisma.franchiseApplication.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(applications.map(app => ({
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
  } catch (error) {
    console.error('Error fetching franchise applications:', error);
    res.status(500).json({ error: 'Failed to fetch franchise applications' });
  }
});

// GET single franchise application
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const application = await prisma.franchiseApplication.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json({
      id: application.id,
      firstName: application.firstName,
      lastName: application.lastName,
      email: application.email,
      phone: application.phone,
      company: application.company || '',
      location: application.location,
      investmentRange: application.investmentRange,
      experience: application.experience,
      message: application.message,
      status: application.status,
      date: application.date,
      notes: application.notes || '',
      createdAt: application.createdAt
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// POST create franchise application
router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      location,
      investmentRange,
      experience,
      message
    } = req.body;
    
    const application = await prisma.franchiseApplication.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        company: company || null,
        location,
        investmentRange,
        experience,
        message,
        status: 'Pending'
      }
    });
    
    res.status(201).json({
      id: application.id,
      firstName: application.firstName,
      lastName: application.lastName,
      email: application.email,
      phone: application.phone,
      company: application.company || '',
      location: application.location,
      investmentRange: application.investmentRange,
      experience: application.experience,
      message: application.message,
      status: application.status,
      date: application.date,
      notes: application.notes || '',
      createdAt: application.createdAt
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Failed to create application', message: error.message });
  }
});

// PUT update franchise application (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    
    const application = await prisma.franchiseApplication.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
    });
    
    res.json({
      id: application.id,
      firstName: application.firstName,
      lastName: application.lastName,
      email: application.email,
      phone: application.phone,
      company: application.company || '',
      location: application.location,
      investmentRange: application.investmentRange,
      experience: application.experience,
      message: application.message,
      status: application.status,
      date: application.date,
      notes: application.notes || '',
      createdAt: application.createdAt,
      updatedAt: application.updatedAt
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Application not found' });
    }
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'Failed to update application', message: error.message });
  }
});

// DELETE franchise application (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.franchiseApplication.delete({
      where: { id: parseInt(req.params.id) }
    });
    
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Application not found' });
    }
    console.error('Error deleting application:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

export default router;
