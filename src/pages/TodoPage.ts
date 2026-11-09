import { expect, type Locator, type Page } from '@playwright/test';

export type TodoFilter = 'all' | 'active' | 'completed';

export class TodoPage {
  readonly page: Page;
  readonly newTodoInput: Locator;
  readonly todoList: Locator;
  readonly todoCount: Locator;
  readonly clearCompletedButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoList = page.locator('.todo-list');
    this.todoCount = page.locator('.todo-count');
    this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
  }

  async goto(url = 'https://demo.playwright.dev/todomvc') {
    await this.page.goto(url);
    await this.expectReady();
  }

  async expectReady() {
    await expect(this.page.getByRole('heading', { name: 'todos' })).toBeVisible();
    await expect(this.newTodoInput).toBeVisible();
  }

  private todoItem(title: string): Locator {
    return this.todoList.getByRole('listitem').filter({ hasText: title });
  }

  async addTodo(title: string) {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      throw new Error('Todo title cannot be empty.');
    }

    await this.newTodoInput.fill(normalizedTitle);
    await this.newTodoInput.press('Enter');

    await expect(this.todoItem(normalizedTitle)).toBeVisible();
  }

  async completeTodo(title: string) {
    const item = this.todoItem(title);
    const checkbox = item.getByRole('checkbox');

    await expect(checkbox).toBeVisible();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  }

  async uncompleteTodo(title: string) {
    const item = this.todoItem(title);
    const checkbox = item.getByRole('checkbox');

    await expect(checkbox).toBeVisible();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  }

  async toggleTodo(title: string) {
    const item = this.todoItem(title);
    const checkbox = item.getByRole('checkbox');

    await checkbox.click();
  }

  async filterBy(filter: TodoFilter) {
    const map: Record<TodoFilter, string> = {
      all: 'All',
      active: 'Active',
      completed: 'Completed',
    };

    await this.page.getByRole('link', { name: map[filter], exact: true }).click();
  }

  async getTodoCount(): Promise<number> {
    return await this.todoList.getByRole('listitem').count();
  }

  async expectTodoCount(expectedCount: number) {
    await expect(this.todoList.getByRole('listitem')).toHaveCount(expectedCount);
  }

  async getRemainingCount(): Promise<number> {
    const todoCountText = (await this.todoCount.textContent()) ?? '';
    const match = todoCountText.match(/(\d+)/);

    return match ? Number(match[1]) : 0;
  }

  async expectRemainingCount(expectedCount: number) {
    const label = expectedCount === 1 ? '1 item left' : `${expectedCount} items left`;
    await expect(this.todoCount).toHaveText(label);
  }

  async hasTodo(title: string): Promise<boolean> {
    return await this.todoItem(title).isVisible();
  }

  async deleteTodo(title: string) {
    const item = this.todoItem(title);

    await item.hover();
    await item.getByRole('button', { name: 'Delete' }).click();
    await expect(item).toHaveCount(0);
  }

  async clearCompleted() {
    await this.clearCompletedButton.click();
  }
}
