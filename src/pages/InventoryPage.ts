import { expect, type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly sortDropdown: Locator;
  readonly productList: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.sortDropdown = page.getByRole('combobox', { name: 'Sort products' });
    this.productList = page.locator('.inventory_list');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async goto(url = 'https://www.saucedemo.com') {
    await this.page.goto(url);
    await this.expectLoginScreen();
  }

  async expectLoginScreen() {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.expectInventoryPage();
  }

  async expectInventoryPage() {
    await expect(this.page.locator('.title')).toContainText('Products');
    await expect(this.productList).toBeVisible();
  }

  async sortByPriceLowToHigh() {
    await this.sortDropdown.selectOption('lohi');
    await expect(this.sortDropdown).toHaveValue('lohi');
  }

  async sortByPriceHighToLow() {
    await this.sortDropdown.selectOption('hilo');
    await expect(this.sortDropdown).toHaveValue('hilo');
  }

  async addToCart(productName: string) {
    const product = this.productList.getByRole('link', { name: new RegExp(productName, 'i') }).locator('xpath=ancestor::div[contains(@class,"inventory_item")]');
    const addButton = product.getByRole('button', { name: 'Add to cart' });

    await expect(addButton).toBeVisible();
    await addButton.click();
    await expect(product.getByRole('button', { name: 'Remove' })).toBeVisible();
  }

  async addFirstTwoProductsToCart() {
    const items = this.productList.locator('.inventory_item');
    const count = await items.count();

    if (count < 2) {
      throw new Error('At least two products are required to add to the cart.');
    }

    for (let i = 0; i < 2; i++) {
      const item = items.nth(i);
      const addButton = item.getByRole('button', { name: 'Add to cart' });
      await addButton.click();
    }
  }

  async getCartItemCount(): Promise<number> {
    const badgeText = await this.cartBadge.textContent();
    return badgeText ? Number.parseInt(badgeText.trim(), 10) || 0 : 0;
  }

  async expectCartItemCount(expectedCount: number) {
    if (expectedCount === 0) {
      await expect(this.cartBadge).toHaveCount(0);
      return;
    }

    await expect(this.cartBadge).toHaveText(String(expectedCount));
  }
}
