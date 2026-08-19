import { test, expect } from '../../../suporte/elementos/fixtures';
import { PageElements } from '../../../suporte/elementos/pageElements';
import { gerarDados } from '../../../helpers/userHelper';

/* Cenários Válidos */

test.describe('Cenários Válidos: Inscrição na Página do Carrinho', () => {

  test('Test Case 1: Deve realizar inscrição no rodapé através da página Cart com sucesso', async ({ page }) => {
    const elem = new PageElements(page);
    const userData = gerarDados();

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await elem.navCart.click();

    await elem.subscriptionHeading.scrollIntoViewIfNeeded();
    await expect(elem.subscriptionHeading).toBeVisible();

    await elem.subscriptionEmailInput.fill(userData.email);
    await elem.subscriptionButton.click();

    await expect(elem.subscriptionSuccessMessage).toBeVisible();
    await expect(elem.subscriptionSuccessMessage).toHaveText('You have been successfully subscribed!');
  });

  test('Test Case 2: Deve realizar inscrição no rodapé da página inicial (Home) com sucesso', async ({ page }) => {
    const elem = new PageElements(page);
    const userData = gerarDados();

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await elem.subscriptionHeading.scrollIntoViewIfNeeded();
    await expect(elem.subscriptionHeading).toBeVisible();

    await elem.subscriptionEmailInput.fill(userData.email);
    await elem.subscriptionButton.click();

    await expect(elem.subscriptionSuccessMessage).toBeVisible();
    await expect(elem.subscriptionSuccessMessage).toHaveText('You have been successfully subscribed!');
  });

  test('Test Case 3: Deve exibir o título "SUBSCRIPTION" visível na seção do rodapé', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.subscriptionHeading.scrollIntoViewIfNeeded();

    await expect(elem.subscriptionHeading).toBeVisible();
    await expect(elem.subscriptionHeading).toHaveText('Subscription');
  });

  test('Test Case 4: Deve realizar inscrição através da página de produtos', async ({ page }) => {
    const elem = new PageElements(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navProducts.click();

    await elem.subscriptionHeading.scrollIntoViewIfNeeded();
    await expect(elem.subscriptionHeading).toBeVisible();

    await elem.subscriptionEmailInput.fill(userData.email);
    await elem.subscriptionButton.click();

    await expect(elem.subscriptionSuccessMessage).toBeVisible();
    await expect(elem.subscriptionSuccessMessage).toHaveText('You have been successfully subscribed!');
  });

  test('Test Case 5: Deve limpar o campo de e-mail ou exibir mensagem após inscrição realizada com sucesso', async ({ page }) => {
    const elem = new PageElements(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.subscriptionHeading.scrollIntoViewIfNeeded();

    await elem.subscriptionEmailInput.fill(userData.email);
    await elem.subscriptionButton.click();

    await expect(elem.subscriptionSuccessMessage).toBeVisible();
  });

});

/* Cenários Inválidos */

test.describe('Cenários Inválidos: Inscrição na Newsletter', () => {

  test('Test Case 1: Não deve permitir submeter inscrição com o campo de e-mail em branco', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.subscriptionHeading.scrollIntoViewIfNeeded();

    await elem.subscriptionButton.click();

    const isInvalid = await elem.subscriptionEmailInput.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test('Test Case 2: Não deve permitir submeter inscrição com e-mail sem o caractere @', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.subscriptionHeading.scrollIntoViewIfNeeded();

    await elem.subscriptionEmailInput.fill('emailInvalidoSemArroba.com');
    await elem.subscriptionButton.click();

    const isInvalid = await elem.subscriptionEmailInput.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test('Test Case 3: Não deve permitir submeter inscrição com formato de e-mail incompleto (sem domínio)', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.subscriptionHeading.scrollIntoViewIfNeeded();

    await elem.subscriptionEmailInput.fill('usuario@');
    await elem.subscriptionButton.click();

    const isInvalid = await elem.subscriptionEmailInput.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test('Test Case 4: Não deve exibir mensagem de sucesso ao tentar enviar e-mail com espaços em branco', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.subscriptionHeading.scrollIntoViewIfNeeded();

    await elem.subscriptionEmailInput.fill('   ');
    await elem.subscriptionButton.click();

    await expect(elem.subscriptionSuccessMessage).not.toBeVisible();
  });

  test('Test Case 5: Não deve permitir submeter inscrição com caracteres especiais/espaços em formato incorreto', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.subscriptionHeading.scrollIntoViewIfNeeded();

    await elem.subscriptionEmailInput.fill('teste@@dominio..com');
    await elem.subscriptionButton.click();

    const isInvalid = await elem.subscriptionEmailInput.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

});