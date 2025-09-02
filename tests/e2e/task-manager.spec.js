const { test, expect } = require('@playwright/test');

test.describe('Task Manager App', () => {
  const testUser = {
    email: 'test@example.com',
    username: 'testuser',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User'
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login form by default', async ({ page }) => {
    await expect(page.locator('#login-form')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Login');
  });

  test('should switch between login and register forms', async ({ page }) => {
    // Click "Sign up" link
    await page.click('#show-register');
    await expect(page.locator('#register-form')).toBeVisible();
    await expect(page.locator('#login-form')).toBeHidden();

    // Click "Login" link
    await page.click('#show-login');
    await expect(page.locator('#login-form')).toBeVisible();
    await expect(page.locator('#register-form')).toBeHidden();
  });

  test('should register a new user and redirect to tasks', async ({ page }) => {
    // Go to register form
    await page.click('#show-register');

    // Fill registration form
    await page.fill('#register-firstname', testUser.firstName);
    await page.fill('#register-lastname', testUser.lastName);
    await page.fill('#register-username', testUser.username);
    await page.fill('#register-email', testUser.email);
    await page.fill('#register-password', testUser.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to task section
    await expect(page.locator('#task-section')).toBeVisible();
    await expect(page.locator('#auth-section')).toBeHidden();
    await expect(page.locator('#user-name')).toContainText('Test User');
  });

  test('should login existing user', async ({ page }) => {
    // First register a user (assuming previous test ran)
    await page.click('#show-register');
    await page.fill('#register-firstname', testUser.firstName);
    await page.fill('#register-lastname', testUser.lastName);
    await page.fill('#register-username', testUser.username + '2');
    await page.fill('#register-email', 'test2@example.com');
    await page.fill('#register-password', testUser.password);
    await page.click('button[type="submit"]');

    // Logout
    await page.click('#logout-btn');

    // Login
    await page.fill('#login-email', 'test2@example.com');
    await page.fill('#login-password', testUser.password);
    await page.click('button[type="submit"]');

    // Should redirect to task section
    await expect(page.locator('#task-section')).toBeVisible();
  });

  test('should create a new task', async ({ page }) => {
    // Register and login first
    await page.click('#show-register');
    await page.fill('#register-username', 'taskuser');
    await page.fill('#register-email', 'task@example.com');
    await page.fill('#register-password', testUser.password);
    await page.click('button[type="submit"]');

    // Click add task button
    await page.click('#add-task-btn');
    await expect(page.locator('#task-modal')).toBeVisible();

    // Fill task form
    await page.fill('#task-title', 'Test Task');
    await page.fill('#task-description', 'This is a test task');
    await page.selectOption('#task-priority', 'high');

    // Submit task
    await page.click('button[type="submit"]');

    // Modal should close and task should appear
    await expect(page.locator('#task-modal')).toBeHidden();
    await expect(page.locator('[data-task-id]')).toBeVisible();
    await expect(page.locator('h3')).toContainText('Test Task');
  });

  test('should toggle task completion', async ({ page }) => {
    // Register and create a task first
    await page.click('#show-register');
    await page.fill('#register-username', 'toggleuser');
    await page.fill('#register-email', 'toggle@example.com');
    await page.fill('#register-password', testUser.password);
    await page.click('button[type="submit"]');

    // Create task
    await page.click('#add-task-btn');
    await page.fill('#task-title', 'Toggle Task');
    await page.click('button[type="submit"]');

    // Toggle task completion
    await page.click('.toggle-btn');
    
    // Task should be marked as completed
    await expect(page.locator('[data-task-id]')).toHaveClass(/task-completed/);
  });

  test('should edit a task', async ({ page }) => {
    // Register and create a task first
    await page.click('#show-register');
    await page.fill('#register-username', 'edituser');
    await page.fill('#register-email', 'edit@example.com');
    await page.fill('#register-password', testUser.password);
    await page.click('button[type="submit"]');

    // Create task
    await page.click('#add-task-btn');
    await page.fill('#task-title', 'Original Task');
    await page.click('button[type="submit"]');

    // Edit task
    await page.click('.edit-btn');
    await expect(page.locator('#task-modal')).toBeVisible();
    await expect(page.locator('#modal-title')).toContainText('Edit Task');

    // Update task
    await page.fill('#task-title', 'Updated Task');
    await page.click('button[type="submit"]');

    // Task should be updated
    await expect(page.locator('h3')).toContainText('Updated Task');
  });

  test('should delete a task', async ({ page }) => {
    // Register and create a task first
    await page.click('#show-register');
    await page.fill('#register-username', 'deleteuser');
    await page.fill('#register-email', 'delete@example.com');
    await page.fill('#register-password', testUser.password);
    await page.click('button[type="submit"]');

    // Create task
    await page.click('#add-task-btn');
    await page.fill('#task-title', 'Task to Delete');
    await page.click('button[type="submit"]');

    // Delete task (handle confirmation dialog)
    page.on('dialog', dialog => dialog.accept());
    await page.click('.delete-btn');

    // Task should be removed
    await expect(page.locator('[data-task-id]')).toHaveCount(0);
    await expect(page.locator('#empty-state')).toBeVisible();
  });

  test('should filter tasks by status', async ({ page }) => {
    // Register and create tasks first
    await page.click('#show-register');
    await page.fill('#register-username', 'filteruser');
    await page.fill('#register-email', 'filter@example.com');
    await page.fill('#register-password', testUser.password);
    await page.click('button[type="submit"]');

    // Create two tasks
    await page.click('#add-task-btn');
    await page.fill('#task-title', 'Pending Task');
    await page.click('button[type="submit"]');

    await page.click('#add-task-btn');
    await page.fill('#task-title', 'Completed Task');
    await page.click('button[type="submit"]');

    // Complete one task
    await page.locator('[data-task-id]').last().locator('.toggle-btn').click();

    // Filter by completed
    await page.selectOption('#status-filter', 'completed');
    await expect(page.locator('[data-task-id]')).toHaveCount(1);
    await expect(page.locator('h3')).toContainText('Completed Task');

    // Filter by pending
    await page.selectOption('#status-filter', 'pending');
    await expect(page.locator('[data-task-id]')).toHaveCount(1);
    await expect(page.locator('h3')).toContainText('Pending Task');
  });

  test('should display task statistics', async ({ page }) => {
    // Register user
    await page.click('#show-register');
    await page.fill('#register-username', 'statsuser');
    await page.fill('#register-email', 'stats@example.com');
    await page.fill('#register-password', testUser.password);
    await page.click('button[type="submit"]');

    // Initially should show 0 tasks
    await expect(page.locator('#total-tasks')).toContainText('0');
    await expect(page.locator('#completed-tasks')).toContainText('0');
    await expect(page.locator('#pending-tasks')).toContainText('0');

    // Create a task
    await page.click('#add-task-btn');
    await page.fill('#task-title', 'Stats Task');
    await page.click('button[type="submit"]');

    // Stats should update
    await expect(page.locator('#total-tasks')).toContainText('1');
    await expect(page.locator('#pending-tasks')).toContainText('1');
  });

  test('should logout user', async ({ page }) => {
    // Register user first
    await page.click('#show-register');
    await page.fill('#register-username', 'logoutuser');
    await page.fill('#register-email', 'logout@example.com');
    await page.fill('#register-password', testUser.password);
    await page.click('button[type="submit"]');

    // Should be in task section
    await expect(page.locator('#task-section')).toBeVisible();

    // Logout
    await page.click('#logout-btn');

    // Should return to auth section
    await expect(page.locator('#auth-section')).toBeVisible();
    await expect(page.locator('#task-section')).toBeHidden();
  });
});