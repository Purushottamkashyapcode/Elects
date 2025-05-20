const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get All Admins
router.get('/', async (req, res) => {
  try {
    const admins = await Admin.find();
    if (!admins.length) {
      return res.status(404).json({ error: 'No admins found' });
    }
    res.status(200).json({ message: 'Admins retrieved successfully', data: admins });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Admin by ID
router.get('/admin/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.status(200).json({ message: 'Admin retrieved successfully', data: admin });
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Register a New Admin
router.post('/', async (req, res) => {
  const { adminId, name, email, password, phone } = req.body;

  if (!adminId || !name || !email || !password || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingEmail = await Admin.findOne({ email });
    const existingAdminId = await Admin.findOne({ adminId });

    if (existingEmail) return res.status(400).json({ error: 'Email already exists' });
    if (existingAdminId) return res.status(400).json({ error: 'Admin ID already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ adminId, name, email, password: hashedPassword, phone });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully', data: newAdmin });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const privateKey = process.env.SECRET_KEY;

  console.log("Login Request Body:", req.body); // Debug

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const payload = { adminId: admin.adminId, email: admin.email, name: admin.name };
    const token = jwt.sign(payload, privateKey, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token, payload });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Admin
router.put('/admin/:id', async (req, res) => {
  const { adminId, name, email, password, phone } = req.body;

  if (!adminId || !name || !email || !password || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    admin.adminId = adminId;
    admin.name = name;
    admin.email = email;
    admin.password = await bcrypt.hash(password, 10);
    admin.phone = phone;

    await admin.save();
    res.status(200).json({ message: 'Admin updated successfully', data: admin });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete Admin
router.delete('/admin/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    await admin.remove();
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
