const { test, expect } = require('@playwright/test');

test.describe('Complete Task Manager Application', () => {
  const testUser = {
    email: 'testuser@example.com',
    username: 'testuser',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User'
  };

  const testTask = {
    title: 'Test Task',
    description: 'This is a test task for E2E testing',
    priority: 'high'
  };

  test.beforeEach(async ({ page }) => {
    // Start from the login page
    await page.goto('/login');
  });

  test('should complete full user registration and task management flow', async ({ page }) => {
    // 1. Register a new user
    await page.click('text=create a new account');
    await expect(page).toHaveURL(/.*register/);

    await page.fill('input[name="firstName"]', testUser.firstName);
    await page.fill('input[name="lastName"]', testUser.lastName);
    await page.fill('input[name="username"]', testUser.username);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    
    await page.click('button[type="submit"]');

    // Should redirect to dashboard after successful registration
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=Welcome')).toBeVisible();

    // 2. Create a new task
    await page.click('text=Add Task');
    await page.fill('input[name="title"]', testTask.title);
    await page.fill('textarea[name="description"]', testTask.description);
    await page.selectOption('select[name="priority"]', testTask.priority);
    
    await page.click('button[type="submit"]');
    
    // Verify task appears in the list
    await expect(page.locator(`text=${testTask.title}`)).toBeVisible();
    await expect(page.locator(`text=${testTask.description}`)).toBeVisible();

    // 3. Toggle task status (mark as completed)
    await page.click('[data-testid="task-toggle"]');
    
    // Verify task is marked as completed
    await expect(page.locator('[data-testid="task-item"]')).toHaveClass(/completed/);

    // 4. Toggle back to pending
    await page.click('[data-testid="task-toggle"]');
    
    // Verify task is back to pending
    await expect(page.locator('[data-testid="task-item"]')).not.toHaveClass(/completed/);

    // 5. Edit the task
    await page.click('[data-testid="edit-task"]');
    await page.fill('input[name="title"]', 'Updated Test Task');
    await page.click('button[type="submit"]');
    
    // Verify task title is updated
    await expect(page.locator('text=Updated Test Task')).toBeVisible();

    // 6. Delete the task
    await page.click('[data-testid="delete-task"]');
    await page.click('text=Confirm'); // Confirm deletion
    
    // Verify task is removed
    await expect(page.locator('text=Updated Test Task')).not.toBeVisible();

    // 7. Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Logout');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('should handle login with existing user', async ({ page }) => {
    // First register a user
    await page.click('text=create a new account');
    await page.fill('input[name="firstName"]', testUser.firstName);
    await page.fill('input[name="lastName"]', testUser.lastName);
    await page.fill('input[name="username"]', 'logintest');
    await page.fill('input[name="email"]', 'logintest@example.com');
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Logout');

    // Now test login
    await page.fill('input[name="email"]', 'logintest@example.com');
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should filter tasks by status', async ({ page }) => {
    // Register and login
    await page.click('text=create a new account');
    await page.fill('input[name="username"]', 'filtertest');
    await page.fill('input[name="email"]', 'filtertest@example.com');
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Create multiple tasks
    await page.click('text=Add Task');
    await page.fill('input[name="title"]', 'Pending Task');
    await page.click('button[type="submit"]');

    await page.click('text=Add Task');
    await page.fill('input[name="title"]', 'Completed Task');
    await page.click('button[type="submit"]');

    // Mark one task as completed
    await page.locator('[data-testid="task-item"]').last().locator('[data-testid="task-toggle"]').click();

    // Filter by completed tasks
    await page.selectOption('select[name="statusFilter"]', 'completed');
    await expect(page.locator('text=Completed Task')).toBeVisible();
    await expect(page.locator('text=Pending Task')).not.toBeVisible();

    // Filter by pending tasks
    await page.selectOption('select[name="statusFilter"]', 'pending');
    await expect(page.locator('text=Pending Task')).toBeVisible();
    await expect(page.locator('text=Completed Task')).not.toBeVisible();

    // Show all tasks
    await page.selectOption('select[name="statusFilter"]', 'all');
    await expect(page.locator('text=Pending Task')).toBeVisible();
    await expect(page.locator('text=Completed Task')).toBeVisible();
  });

  test('should validate form inputs', async ({ page }) => {
    // Register user
    await page.click('text=create a new account');
    await page.fill('input[name="username"]', 'validationtest');
    await page.fill('input[name="email"]', 'validationtest@example.com');
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Try to create task without title
    await page.click('text=Add Task');
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('text=Title is required')).toBeVisible();

    // Try with invalid email during registration
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Logout');
    
    await page.click('text=create a new account');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    
    // Should show email validation error
    await expect(page.locator('text=Please enter a valid email')).toBeVisible();
  });

  test('should handle authentication errors', async ({ page }) => {
    // Try to login with non-existent user
    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });

  test('should persist tasks after logout/login', async ({ page }) => {
    // Register user
    await page.click('text=create a new account');
    await page.fill('input[name="username"]', 'persisttest');
    await page.fill('input[name="email"]', 'persisttest@example.com');
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Create a task
    await page.click('text=Add Task');
    await page.fill('input[name="title"]', 'Persistent Task');
    await page.click('button[type="submit"]');

    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Logout');

    // Login again
    await page.fill('input[name="email"]', 'persisttest@example.com');
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Task should still be there
    await expect(page.locator('text=Persistent Task')).toBeVisible();
  });
});