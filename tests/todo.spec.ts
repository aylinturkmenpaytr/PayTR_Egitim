import { test, expect, type Page } from '@playwright/test';

const appUrl = 'https://demo.playwright.dev/todomvc';

async function addTodo(page: Page, title: string) {
  const newTodo = page.getByRole('textbox', { name: 'What needs to be done?' });
  await newTodo.fill(title);
  await newTodo.press('Enter');
}

function todoList(page: Page) {
  return page.getByRole('list').first();
}

function todoItem(page: Page, title: string) {
  return todoList(page).getByRole('listitem').filter({ hasText: title });
}

test.describe('TodoMVC basic operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(appUrl);
    await expect(page.getByRole('heading', { name: 'todos' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'What needs to be done?' })).toBeVisible();
  });

  test('adds a todo and updates the remaining count', async ({ page }) => {
    const newTodo = page.getByRole('textbox', { name: 'What needs to be done?' });

    await newTodo.fill('Buy groceries');
    await newTodo.press('Enter');

    await expect(todoItem(page, 'Buy groceries')).toBeVisible();
    await expect(page.locator('.todo-count')).toHaveText(/1 item left/);
    await expect(newTodo).toHaveValue('');
  });

  test('adds multiple todos independently', async ({ page }) => {
    await expect(todoList(page).getByRole('listitem')).toHaveCount(0);

    await addTodo(page, 'Buy groceries');
    await addTodo(page, 'Walk the dog');

    await expect(todoList(page).getByRole('listitem')).toHaveCount(2);
    await expect(todoItem(page, 'Buy groceries')).toBeVisible();
    await expect(todoItem(page, 'Walk the dog')).toBeVisible();
    await expect(page.locator('.todo-count')).toHaveText(/2 items left/);
  });

  test('completes and reactivates an individual todo', async ({ page }) => {
    await addTodo(page, 'Read a book');
    const todo = todoItem(page, 'Read a book');
    const checkbox = todo.getByRole('checkbox');

    await expect(checkbox).not.toBeChecked();
    await expect(page.locator('.todo-count')).toHaveText(/1 item left/);

    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await expect(page.locator('.todo-count')).toHaveText(/0 items?/);

    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
    await expect(page.locator('.todo-count')).toHaveText(/1 item left/);
  });

  test('toggles all todos between active and completed', async ({ page }) => {
    await addTodo(page, 'Buy groceries');
    await addTodo(page, 'Walk the dog');
    const toggleAll = page.getByRole('checkbox').first();

    await expect(todoList(page).getByRole('listitem').filter({ has: page.locator('input:not(:checked)') })).toHaveCount(2);
    await toggleAll.check();
    await expect(todoList(page).getByRole('listitem').filter({ has: page.locator('input:checked') })).toHaveCount(2);
    await expect(page.locator('.todo-count')).toHaveText(/0 items?/);

    await toggleAll.uncheck();
    await expect(todoList(page).getByRole('listitem').filter({ has: page.locator('input:not(:checked)') })).toHaveCount(2);
    await expect(page.locator('.todo-count')).toHaveText(/2 items left/);
  });

  test('filters todos by all, active, and completed status', async ({ page }) => {
    await addTodo(page, 'Active task');
    await addTodo(page, 'Completed task');
    await todoItem(page, 'Completed task').getByRole('checkbox').check();

    await page.getByRole('link', { name: 'Active', exact: true }).click();
    await expect(todoList(page).getByRole('listitem')).toHaveCount(1);
    await expect(todoItem(page, 'Active task')).toBeVisible();
    await expect(todoItem(page, 'Completed task')).toHaveCount(0);

    await page.getByRole('link', { name: 'Completed', exact: true }).click();
    await expect(todoList(page).getByRole('listitem')).toHaveCount(1);
    await expect(todoItem(page, 'Completed task')).toBeVisible();
    await expect(todoItem(page, 'Active task')).toHaveCount(0);

    await page.getByRole('link', { name: 'All', exact: true }).click();
    await expect(todoList(page).getByRole('listitem')).toHaveCount(2);
    await expect(todoItem(page, 'Active task')).toBeVisible();
    await expect(todoItem(page, 'Completed task')).toBeVisible();
  });

  test('edits a todo and saves the updated text', async ({ page }) => {
    await addTodo(page, 'Old title');
    const todo = todoItem(page, 'Old title');

    await todo.getByText('Old title', { exact: true }).dblclick();
    const editor = todo.getByRole('textbox');
    await editor.fill('Updated title');
    await editor.press('Enter');

    await expect(todoItem(page, 'Updated title')).toBeVisible();
    await expect(todoItem(page, 'Old title')).toHaveCount(0);
    await expect(page.locator('.todo-count')).toHaveText(/1 item left/);
  });

  test('deletes a todo from the list', async ({ page }) => {
    await addTodo(page, 'Temporary task');
    const todo = todoItem(page, 'Temporary task');

    await todo.hover();
    await todo.getByRole('button', { name: 'Delete' }).click();

    await expect(todo).toHaveCount(0);
    await expect(todoList(page).getByRole('listitem')).toHaveCount(0);
    await expect(page.locator('.todo-count')).toHaveCount(0);
  });

  test('clears completed todos while retaining active todos', async ({ page }) => {
    await addTodo(page, 'Keep this task');
    await addTodo(page, 'Remove this task');
    await todoItem(page, 'Remove this task').getByRole('checkbox').check();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(todoItem(page, 'Remove this task')).toHaveCount(0);
    await expect(todoItem(page, 'Keep this task')).toBeVisible();
    await expect(page.locator('.todo-count')).toHaveText(/1 item left/);
  });
});
