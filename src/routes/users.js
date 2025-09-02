const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only - for future use)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // For now, only return the current user
    // In the future, this could be expanded for admin functionality
    const user = await db('users')
      .select('id', 'username', 'email', 'first_name', 'last_name', 'created_at')
      .where('id', req.user.userId)
      .first();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get user by ID (public info only)
router.get('/:id', async (req, res) => {
  try {
    const user = await db('users')
      .select('id', 'username', 'first_name', 'last_name', 'created_at')
      .where('id', req.params.id)
      .first();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user password (protected route)
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    // Get current user with password hash
    const user = await db('users')
      .where('id', req.user.userId)
      .first();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await db('users')
      .where('id', req.user.userId)
      .update({ 
        password_hash: newPasswordHash,
        updated_at: new Date()
      });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// Delete user account (protected route)
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required to delete account' });
    }

    // Get current user with password hash
    const user = await db('users')
      .where('id', req.user.userId)
      .first();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Password is incorrect' });
    }

    // Delete user (this will cascade delete tasks due to foreign key constraint)
    await db('users')
      .where('id', req.user.userId)
      .del();

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;
