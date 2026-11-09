import { test, expect } from '@playwright/test';
import { TodoPage } from '../../src/pages/TodoPage';

test.describe('TodoMVC page object scenario', () => {
  test('adds three todos, completes the second, filters by active/completed, and validates counts', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.goto();

    await todoPage.addTodo('Buy milk');
    await todoPage.addTodo('Read book');
    await todoPage.addTodo('Write report');

    await todoPage.expectTodoCount(3);
    await todoPage.expectRemainingCount(3);
    expect(await todoPage.getTodoCount()).toBe(3);
    expect(await todoPage.getRemainingCount()).toBe(3);

    await todoPage.completeTodo('Read book');

    await todoPage.expectRemainingCount(2);
    expect(await todoPage.getRemainingCount()).toBe(2);

    await todoPage.filterBy('active');
    await expect(todoPage.todoList.getByRole('listitem')).toHaveCount(2);
    await expect(todoPage.todoList.getByRole('listitem').filter({ hasText: 'Buy milk' })).toBeVisible();
    await expect(todoPage.todoList.getByRole('listitem').filter({ hasText: 'Write report' })).toBeVisible();
    await expect(todoPage.todoList.getByRole('listitem').filter({ hasText: 'Read book' })).toHaveCount(0);

    await todoPage.filterBy('completed');
    await expect(todoPage.todoList.getByRole('listitem')).toHaveCount(1);
    await expect(todoPage.todoList.getByRole('listitem').filter({ hasText: 'Read book' })).toBeVisible();
    await expect(todoPage.todoList.getByRole('listitem').filter({ hasText: 'Buy milk' })).toHaveCount(0);
    await expect(todoPage.todoList.getByRole('listitem').filter({ hasText: 'Write report' })).toHaveCount(0);

    await todoPage.filterBy('all');
    await todoPage.expectTodoCount(3);
    await todoPage.expectRemainingCount(2);
    expect(await todoPage.getTodoCount()).toBe(3);
    expect(await todoPage.getRemainingCount()).toBe(2);
  });
});
