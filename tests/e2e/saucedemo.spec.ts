import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';

test.describe('SauceDemo purchase flow', () => {
  test('logs in, sorts products by price low to high, adds two items, checks out and confirms order', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.goto();
    await inventoryPage.login('standard_user', 'secret_sauce');
    await inventoryPage.sortByPriceLowToHigh();

    await inventoryPage.addFirstTwoProductsToCart();
    await inventoryPage.expectCartItemCount(2);
    expect(await inventoryPage.getCartItemCount()).toBe(2);

    await checkoutPage.openCart();
    await checkoutPage.expectCartItemCount(2);

    await checkoutPage.startCheckout();
    await checkoutPage.fillCustomerInfo('Jane', 'Doe', '12345');
    await checkoutPage.finishOrder();
    await checkoutPage.expectOrderConfirmation();

    await expect(page.getByText('Thank you for your order!')).toBeVisible();
  });
});
