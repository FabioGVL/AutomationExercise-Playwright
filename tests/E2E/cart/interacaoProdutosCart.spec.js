import { test, expect } from '../../../suporte/elementos/fixtures';
import { PageElements } from '../../../suporte/elementos/pageElements';
import { UserHelper, gerarDados, bloquearAds } from '../../../helpers/userHelper';

/* Cenários Válidos */

test.describe('Cenários Válidos: Gerenciamento do Carrinho de Compras', () => {

  test('Test Case 1: Deve adicionar múltiplos produtos ao carrinho e validar preços, quantidade e total', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await elem.navProducts.click();

    await elem.firstProductCard.hover();
    await elem.firstProductAddToCart.click();

    await elem.continueShoppingButton.click();

    await elem.secondProductCard.hover();
    await elem.secondProductAddToCart.click();

    await elem.viewCartModalLink.click();

    await expect(elem.cartContainer).toHaveCount(2);

    for (let i = 0; i < 2; i++) {
      const row = elem.cartContainer.nth(i);
      
      await expect(row.locator('.cart_description')).toBeVisible();
      await expect(row.locator('.cart_price')).toBeVisible();
      await expect(row.locator('.cart_quantity')).toHaveText('1');
      await expect(row.locator('.cart_total')).toBeVisible();
    }
  });

  test('Test Case 2: Deve alterar a quantidade do produto e validar o valor correto no carrinho', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await elem.firstProductViewBtn.click();

    await expect(page).toHaveURL(/.*product_details\/\d+/);
    await expect(elem.productName).toBeVisible();

    await elem.cartQuantityItems.fill('4');

    await elem.addToCartButton.click();
    await elem.viewCartModalLink.click();

    const cartQuantity = elem.cartContainer.first().locator('.cart_quantity');
    await expect(cartQuantity).toHaveText('4');
  });

  test('Test Case 3: Deve remover um produto do carrinho com sucesso', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await elem.firstProductCard.hover();
    await elem.firstProductAddToCart.click();
    await elem.continueShoppingButton.click();

    await elem.navCart.click();

    await expect(page).toHaveURL(/.*view_cart/);
    await expect(elem.cartContainer).toHaveCount(1);

    await elem.cartDeleteButton.first().click();

    await expect(elem.cartContainer).toHaveCount(0);
  });

  test('Test Case 4: Deve adicionar um produto da seção de recomendados ao carrinho', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await elem.recommendedItemsHeading.scrollIntoViewIfNeeded();
    await expect(elem.recommendedItemsHeading).toBeVisible();

    await elem.recommendedProductAddToCart.click();

    await elem.viewCartModalLink.click();

    await expect(page).toHaveURL(/.*view_cart/);
    await expect(elem.cartContainer).toHaveCount(1);
  });

  test('Test Case 5: Deve avançar para a tela de checkout a partir do carrinho estando logado', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navSignupLogin.click();
    await userHelper.registrarNovoUsuario(userData);

    await elem.navProducts.click();
    await elem.firstProductCard.hover();
    await elem.firstProductAddToCart.click();
    await elem.viewCartModalLink.click();

    await elem.proceedToCheckoutBtn.click();

    await expect(page).toHaveURL(/.*checkout/);
    await expect(elem.checkoutAddressTitle).toBeVisible();

    await elem.navDeleteAccount.click();
  });

});

/* Cenários Inválidos */

test.describe('Cenários Inválidos: Gerenciamento do Carrinho de Compras', () => {

  test('Test Case 1: Deve exibir modal/alerta ao tentar prosseguir para o checkout sem estar autenticado', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.firstProductCard.hover();
    await elem.firstProductAddToCart.click();
    await elem.viewCartModalLink.click();

    await elem.proceedToCheckoutBtn.click();

    await expect(elem.checkoutModalLogin).toBeVisible();
  });

  test('Test Case 2: Deve exibir estado de carrinho vazio após remover todos os produtos adicionados', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.firstProductCard.hover();
    await elem.firstProductAddToCart.click();
    await elem.continueShoppingButton.click();

    await elem.secondProductCard.hover();
    await elem.secondProductAddToCart.click();
    await elem.viewCartModalLink.click();

    await expect(elem.cartContainer).toHaveCount(2);

    await elem.cartDeleteButton.first().click();
    await expect(elem.cartContainer).toHaveCount(1);

    await elem.cartDeleteButton.first().click();
    await expect(elem.cartContainer).toHaveCount(0);

    await expect(elem.emptyCartMessage).toBeVisible();
  });

  test.fixme('Test Case 3: Não deve permitir definir quantidade zerada no detalhe do produto antes de adicionar ao carrinho', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.firstProductViewBtn.click();

    await elem.cartQuantityItems.fill('0');
    await elem.addToCartButton.click();

    await elem.viewCartModalLink.click();

    const quantityText = await elem.cartContainer.first().locator('.cart_quantity').textContent();
    expect(Number(quantityText?.trim())).toBeGreaterThan(0);
  });

  test.fixme('Test Case 4: Não deve ser possível concluir a compra com quantidade de produtos e total negativos', async ({ page }) => {
  const elem = new PageElements(page);
  const userHelper = new UserHelper(page);
  const userData = gerarDados();

  await userHelper.registrarNovoUsuario(userData);

  await page.goto('/product_details/1');

  await elem.cartQuantityItems.fill('-5');
  await elem.addToCartButton.click();
  await elem.viewCartModalLink.click();

  await elem.proceedToCheckoutBtn.click();
  await elem.placeOrderBtn.click();

  await elem.cardNameInput.fill(`${userData.firstName} ${userData.lastName}`);
  await elem.cardNumberInput.fill('4111111111111111');
  await elem.cardCvcInput.fill('123');
  await elem.cardExpMonthInput.fill('12');
  await elem.cardExpYearInput.fill('2030');

  await elem.payAndConfirmBtn.click();

  await expect(page).not.toHaveURL(/.*payment_done/);
});

  test('Test Case 5: Não deve exibir botão de prosseguir para checkout quando o carrinho estiver totalmente vazio', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.navCart.click();

    await expect(elem.cartContainer).toHaveCount(0);
    await expect(elem.proceedToCheckoutBtn).not.toBeVisible();
  });

});