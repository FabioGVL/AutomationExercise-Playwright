import { test, expect } from '../../../suporte/elementos/fixtures';
import { PageElements } from '../../../suporte/elementos/pageElements';

/* Cenários Válidos */

test.describe('Cenários Válidos: Navegação do Site e Test Cases', () => {

  test('Test Case 1: Deve navegar com sucesso para a página de Test Cases', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await elem.navTestCases.click();

    await expect(page).toHaveURL(/.*test_cases/);
    await expect(elem.testCasesHeading).toBeVisible();
  });

  test('Test Case 2: Deve acessar a página de Test Cases diretamente pela URL', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/test_cases');

    await expect(page).toHaveURL(/.*test_cases/);
    await expect(elem.testCasesHeading).toBeVisible();
    await expect(elem.testCasesHeading).toHaveText(/test cases/i);
  });

  test('Test Case 3: Deve garantir que a lista de cenários de teste é renderizada na página', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/test_cases');

    const testCasesList = page.locator('.panel-group .panel');
    await expect(testCasesList.first()).toBeVisible();

    const count = await testCasesList.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Test Case 4: Deve permitir retornar à Home a partir da página de Test Cases usando o menu', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/test_cases');
    await expect(elem.testCasesHeading).toBeVisible();

    await elem.navHome.click();

    await expect(page).toHaveURL('https://automationexercise.com/');
    await expect(elem.sliderCarousel).toBeVisible();
  });

  test('Test Case 5: Deve manter o menu de navegação e rodapé visíveis na página de Test Cases', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/test_cases');

    await expect(elem.navProducts).toBeVisible();
    await expect(elem.subscriptionHeading).toBeAttached();
  });

});

/* Cenários Inválidos */

test.describe('Cenários Inválidos: Navegação e Página de Test Cases', () => {

  test('Test Case 1: Não deve exibir o cabeçalho de Test Cases quando estiver em outra página', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/products');

    await expect(elem.testCasesHeading).not.toBeVisible();
  });

  test('Test Case 2: Não deve quebrar o layout da página de Test Cases ao acessar via viewport mobile', async ({ page }) => {
    const elem = new PageElements(page);

    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/test_cases');

    await expect(elem.testCasesHeading).toBeVisible();
  });

  test('Test Case 3: Não deve permitir acesso à rota com parâmetros inválidos mantendo estado inconsistente', async ({ page }) => {
    await page.goto('/test_cases?invalid_param=abc');

    await expect(page).toHaveURL(/.*test_cases/);
  });

  test('Test Case 4: Não deve exibir mensagens de erro do servidor (500) ao carregar a página de Test Cases', async ({ page }) => {
    const response = await page.goto('/test_cases');

    expect(response?.status()).toBe(200);
    await expect(page.getByText(/internal server error/i)).not.toBeVisible();
  });

  test('Test Case 5: Não deve recarregar a página com erro de 404 Not Found ao clicar no link do menu', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    const [response] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/test_cases')),
      elem.navTestCases.click()
    ]);

    expect(response.status()).not.toBe(404);
  });

});