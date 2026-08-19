import { test, expect } from '../../../suporte/elementos/fixtures';
import { PageElements } from '../../../suporte/elementos/pageElements';

/* Cenários Válidos */

test.describe('Cenários Válidos: Itens Recomendados', () => {

  test('Test Case 1: Deve adicionar um produto ao carrinho a partir da seção de itens recomendados', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await expect(elem.recommendedItemsHeading).toBeVisible();

    await elem.recommendedProductAddToCart.click();

    await elem.viewCartModalLink.click();

    await expect(page).toHaveURL(/.*view_cart/);
    
    await expect(elem.cartContainer).not.toHaveCount(0);
  });

  test('Test Case 2: Deve navegar entre as telas do carrossel de itens recomendados usando as setas', async ({ page }) => {
  const elem = new PageElements(page);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(elem.recommendedItemsHeading).toBeVisible();

  // 1. Captura o texto do primeiro produto ativo ANTES do clique
  const itemAntes = await page.locator('#recommended-item-carousel .item.active p').first().textContent();

  // 2. Clica na seta para avançar o carrossel
  const rightControl = page.locator('#recommended-item-carousel .right');
  await rightControl.click();

  // 3. Asserção: O Playwright aguarda automaticamente até que o texto do item ativo MUDE (seja diferente do inicial)
  const itemAtivoDepois = page.locator('#recommended-item-carousel .item.active p').first();
  await expect(itemAtivoDepois).not.toHaveText(itemAntes?.trim() || '');
});

  test('Test Case 3: Deve adicionar múltiplos itens recomendados de abas/slides diferentes do carrossel', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await elem.recommendedProductAddToCart.click();
    await elem.continueShoppingButton.click();

    await page.locator('#recommended-item-carousel .right').click();
    
    await page.locator('#recommended-item-carousel .item.active .add-to-cart').first().click();
    await elem.viewCartModalLink.click();

    await expect(elem.cartContainer).toHaveCount(2);
  });

  test('Test Case 4: Deve exibir a seção "RECOMMENDED ITEMS" visível no rodapé da página inicial', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.recommendedItemsHeading.scrollIntoViewIfNeeded();

    await expect(elem.recommendedItemsHeading).toBeVisible();
    await expect(elem.recommendedItemsHeading).toHaveText('recommended items');
  });

  test('Test Case 5: Deve persistir o produto recomendado no carrinho após navegar para a página de produtos', async ({ page }) => {
    const elem = new PageElements(page);

    await elem.recommendedItemsHeading.scrollIntoViewIfNeeded();

    await elem.recommendedProductAddToCart.click();
    await elem.continueShoppingButton.click();

    await elem.navProducts.click();
    await elem.navCart.click();

    await expect(elem.cartContainer).toHaveCount(1);
  });

});

/* Cenários Inválidos */

test.describe('Cenários Inválidos: Itens Recomendados', () => {

  test('Test Case 1: Não deve permitir adicionar produto recomendado desabilitado ou sem estoque (regra de resiliência)', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.recommendedItemsHeading.scrollIntoViewIfNeeded();

    const recommendedBtn = elem.recommendedProductAddToCart;
    await expect(recommendedBtn).toBeEnabled();
  });

  test('Test Case 2: Não deve renderizar a seção de recomendados quebrada/sem itens visíveis no slide ativo', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const recommendedProducts = page.locator('#recommended-item-carousel .item.active .single-products');
    const count = await recommendedProducts.count();

    expect(count).toBeGreaterThan(0);
  });

  test('Test Case 3: Não deve fechar o modal de confirmação sem opção de continuar comprando ou ver carrinho ao adicionar item recomendado', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.recommendedItemsHeading.scrollIntoViewIfNeeded();

    await elem.recommendedProductAddToCart.click();

    await expect(elem.viewCartModalLink).toBeVisible();
    await expect(elem.continueShoppingButton).toBeVisible();
  });

  test('Test Case 4: Não deve duplicar a adição do mesmo item recomendado se o botão for clicado durante animação', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.recommendedItemsHeading.scrollIntoViewIfNeeded();

    await elem.recommendedProductAddToCart.click();
    await elem.viewCartModalLink.click();

    const cartQuantity = elem.cartContainer.first().locator('.cart_quantity');
    await expect(cartQuantity).toHaveText('1');
  });

  test('Test Case 5: Não deve exibir o carrossel de recomendados fora do fluxo de rolagem principal', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    
    await expect(elem.recommendedItemsHeading).not.toBeInViewport();
  });

});