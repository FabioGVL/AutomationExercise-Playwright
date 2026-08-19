import { test, expect } from '../../../suporte/elementos/fixtures';
import { PageElements } from '../../../suporte/elementos/pageElements';

/* Cenários Válidos */

test.describe('Cenários Válidos: Funcionalidade de Rolagem (Scroll Up / Scroll Down)', () => {

  test('Test Case 1: Deve rolar para baixo, verificar inscrição e rolar para cima usando a seta', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(elem.subscriptionHeading).toBeVisible();

    await elem.btnScrollUp.click();

    await expect(elem.tituloHeader).toBeVisible();
  });

  test('Test Case 2: Deve rolar para baixo, verificar inscrição e rolar para cima programaticamente', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(elem.subscriptionHeading).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 0));

    await expect(elem.tituloHeader).toBeVisible();
  });

  test('Test Case 3: Deve redirecionar para a Home ao clicar na logo principal do cabeçalho', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/products');
    await expect(page).toHaveURL(/.*products/);

    await elem.logoHeader.click();

    await expect(page).toHaveURL('https://automationexercise.com/');
    await expect(elem.tituloHeader).toBeVisible();
  });

  test('Test Case 4: Deve garantir que o carrossel principal/banner da Home esteja visível ao carregar a página', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');

    await expect(elem.sliderCarousel).toBeVisible();
  });

  test('Test Case 5: Deve navegar com sucesso pelas opções do menu principal da navbar', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');

    await elem.navProducts.click();
    await expect(page).toHaveURL(/.*products/);

    await elem.navCart.click();
    await expect(page).toHaveURL(/.*view_cart/);
  });

});

/* Cenários Inválidos */

test.describe('Cenários Inválidos: Funcionalidade de Navegação e Rolagem', () => {

  test('Test Case 1: Não deve exibir o botão de Scroll Up no topo da página antes do usuário rolar para baixo', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');

    await expect(elem.btnScrollUp).not.toBeInViewport();
  });

  test('Test Case 2: Não deve manter a seção de inscrição (footer) na viewport ao rolar de volta para o topo', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(elem.subscriptionHeading).toBeInViewport();

    await elem.btnScrollUp.click();

    await expect(elem.subscriptionHeading).not.toBeInViewport();
  });

  test('Test Case 3: Não deve permitir navegação para rotas inexistentes pela URL', async ({ page }) => {
    await page.goto('/pagina_inexistente_123', { waitUntil: 'networkidle' });

    const pageTitle = await page.title();
    expect(pageTitle).not.toBe('Automation Exercise - Page Not Found');
  });

  test('Test Case 4: Não deve esconder a barra de navegação/menu principal ao rolar até o fim da página', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await expect(elem.navProducts).toBeAttached();
  });

  test('Test Case 5: Não deve renderizar a página inicial sem as seções de destaque principais', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');

    await expect(elem.categoriesSidebar).toBeVisible();
    await expect(elem.recommendedItemsHeading).not.toBeNull();
  });

});