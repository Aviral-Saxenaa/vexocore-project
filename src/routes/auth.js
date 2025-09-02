const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, username, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !username || !password) {
      return res.status(400).json({ 
        error: 'Email, username, and password are required',
        field: !email ? 'email' : !username ? 'username' : 'password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long',
        field: 'password'
      });
    }

    // Check if user already exists with better error messages
    const existingUserByEmail = await db('users').where('email', email).first();
    const existingUserByUsername = await db('users').where('username', username).first();

    if (existingUserByEmail && existingUserByUsername) {
      return res.status(400).json({ 
        error: 'Both email and username are already taken',
        field: 'both'
      });
    } else if (existingUserByEmail) {
      return res.status(400).json({ 
        error: 'An account with this email already exists',
        field: 'email'
      });
    } else if (existingUserByUsername) {
      return res.status(400).json({ 
        error: 'This username is already taken',
        field: 'username'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const [userId] = await db('users').insert({
      email,
      username,
      password_hash: passwordHash,
      first_name: firstName || null,
      last_name: lastName || null
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId, email, username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        email,
        username,
        firstName: firstName || null,
        lastName: lastName || null
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Check for specific database errors
    if (error.code === '23505') { // PostgreSQL unique constraint violation
      return res.status(400).json({ 
        error: 'An account with this email or username already exists',
        field: 'duplicate'
      });
    }
    
    res.status(500).json({ 
      error: 'Registration failed. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await db('users')
      .where('email', email)
      .first();

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get user profile (protected route)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await db('users')
      .select('id', 'email', 'username', 'first_name', 'last_name', 'avatar_url', 'created_at')
      .where('id', req.user.userId)
      .first();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile (protected route)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, avatarUrl } = req.body;

    const updateData = {};
    if (firstName !== undefined) updateData.first_name = firstName;
    if (lastName !== undefined) updateData.last_name = lastName;
    if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateData.updated_at = new Date();

    await db('users')
      .where('id', req.user.userId)
      .update(updateData);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;