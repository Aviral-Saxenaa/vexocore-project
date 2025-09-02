const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all tasks for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = db('tasks')
      .where('user_id', req.user.userId)
      .orderBy('created_at', 'desc');

    // Apply filters
    if (status) {
      query = query.where('completed', status === 'completed');
    }
    if (priority) {
      query = query.where('priority', priority);
    }

    // Get paginated results first
    const tasks = await query
      .limit(limit)
      .offset(offset)
      .select('*');

    // Get total count for pagination (separate query to avoid GROUP BY issues)
    const totalCount = await db('tasks')
      .where('user_id', req.user.userId)
      .count('* as count')
      .first();

    res.json({
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount.count,
        pages: Math.ceil(totalCount.count / limit)
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get task statistics for the authenticated user
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await db('tasks')
      .where('user_id', req.user.userId)
      .select(
        db.raw('COUNT(*) as total'),
        db.raw('SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) as completed'),
        db.raw('SUM(CASE WHEN completed = false THEN 1 ELSE 0 END) as pending'),
        db.raw('SUM(CASE WHEN priority = ? THEN 1 ELSE 0 END) as highPriority', ['high']),
        db.raw('SUM(CASE WHEN priority = ? THEN 1 ELSE 0 END) as mediumPriority', ['medium']),
        db.raw('SUM(CASE WHEN priority = ? THEN 1 ELSE 0 END) as lowPriority', ['low'])
      )
      .first();

    res.json({
      total: stats.total || 0,
      completed: stats.completed || 0,
      pending: stats.pending || 0,
      highPriority: stats.highPriority || 0,
      mediumPriority: stats.mediumPriority || 0,
      lowPriority: stats.lowPriority || 0,
      completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get a single task by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await db('tasks')
      .where('id', req.params.id)
      .andWhere('user_id', req.user.userId)
      .first();

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create a new task
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    // Validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority level' });
    }

    const taskData = {
      title: title.trim(),
      description: description || null,
      priority: priority || 'medium',
      due_date: dueDate || null,
      user_id: req.user.userId,
      completed: false
    };

    const [newTask] = await db('tasks')
      .insert(taskData)
      .returning('*');

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;

    // Check if task exists and belongs to user
    const existingTask = await db('tasks')
      .where('id', req.params.id)
      .andWhere('user_id', req.user.userId)
      .first();

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Validation
    if (title !== undefined && title.trim().length === 0) {
      return res.status(400).json({ error: 'Task title cannot be empty' });
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority level' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.due_date = dueDate;
    if (completed !== undefined) updateData.completed = completed;
    updateData.updated_at = new Date();

    await db('tasks')
      .where('id', req.params.id)
      .update(updateData);

    const updatedTask = await db('tasks')
      .where('id', req.params.id)
      .first();

    res.json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Toggle task completion status
router.patch('/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const task = await db('tasks')
      .where('id', req.params.id)
      .andWhere('user_id', req.user.userId)
      .first();

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const newStatus = !task.completed;
    await db('tasks')
      .where('id', req.params.id)
      .update({ 
        completed: newStatus, 
        updated_at: new Date() 
      });

    res.json({
      message: `Task marked as ${newStatus ? 'completed' : 'pending'}`,
      completed: newStatus
    });
  } catch (error) {
    console.error('Toggle task error:', error);
    res.status(500).json({ error: 'Failed to toggle task status' });
  }
});

// Delete a task
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedCount = await db('tasks')
      .where('id', req.params.id)
      .andWhere('user_id', req.user.userId)
      .del();

    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;