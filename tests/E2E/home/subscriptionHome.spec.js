import { test, expect } from '../../../suporte/elementos/fixtures';
import { PageElements } from '../../../suporte/elementos/pageElements';
import { gerarDados } from '../../../helpers/userHelper';

/* Cenários Válidos */

test.describe('Cenários Válidos: Inscrição na Home', () => {

  test('Test Case 1: Deve realizar inscrição no rodapé da página inicial com sucesso', async ({ page }) => {
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

  test('Test Case 2: Deve exibir o texto "SUBSCRIPTION" visível na seção do rodapé da Home', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.subscriptionHeading.scrollIntoViewIfNeeded();

    await expect(elem.subscriptionHeading).toBeVisible();
    await expect(elem.subscriptionHeading).toHaveText(/subscription/i);
  });

  test('Test Case 3: Deve realizar inscrição na Home utilizando e-mail com subdomínio ou caracteres permitidos', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.subscriptionHeading.scrollIntoViewIfNeeded();

    await elem.subscriptionEmailInput.fill('teste.qa+sucesso@dominio.com.br');
    await elem.subscriptionButton.click();

    await expect(elem.subscriptionSuccessMessage).toBeVisible();
    await expect(elem.subscriptionSuccessMessage).toHaveText('You have been successfully subscribed!');
  });

  test('Test Case 4: Deve manter o formulário de inscrição visível após rolar até o fim da Home', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await expect(elem.subscriptionEmailInput).toBeVisible();
    await expect(elem.subscriptionButton).toBeVisible();
  });

  test('Test Case 5: Deve permitir realizar nova inscrição após recarregar a página inicial', async ({ page }) => {
    const elem = new PageElements(page);
    const userData1 = gerarDados();
    const userData2 = gerarDados();

    await page.goto('/');
    await elem.subscriptionHeading.scrollIntoViewIfNeeded();

    await elem.subscriptionEmailInput.fill(userData1.email);
    await elem.subscriptionButton.click();
    await expect(elem.subscriptionSuccessMessage).toBeVisible();

    await page.reload();
    await elem.subscriptionHeading.scrollIntoViewIfNeeded();

    await elem.subscriptionEmailInput.fill(userData2.email);
    await elem.subscriptionButton.click();
    await expect(elem.subscriptionSuccessMessage).toBeVisible();
  });

});

/* Cenários Inválidos */

test.describe('Cenários Inválidos: Inscrição na Home', () => {

  test('Test Case 1: Não deve permitir submeter inscrição com o campo de e-mail em branco na Home', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.subscriptionHeading.scrollIntoViewIfNeeded();

    await elem.subscriptionButton.click();

    const isInvalid = await elem.subscriptionEmailInput.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test('Test Case 2: Não deve permitir submeter inscrição com e-mail sem o símbolo @', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.subscriptionHeading.scrollIntoViewIfNeeded();

    await elem.subscriptionEmailInput.fill('usuario_sem_arroba.com');
    await elem.subscriptionButton.click();

    const isInvalid = await elem.subscriptionEmailInput.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test('Test Case 3: Não deve permitir submeter inscrição com e-mail sem domínio após o @', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.subscriptionHeading.scrollIntoViewIfNeeded();

    await elem.subscriptionEmailInput.fill('usuario@');
    await elem.subscriptionButton.click();

    const isInvalid = await elem.subscriptionEmailInput.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test('Test Case 4: Não deve exibir mensagem de sucesso ao preencher o campo apenas com espaços', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.subscriptionHeading.scrollIntoViewIfNeeded();

    await elem.subscriptionEmailInput.fill('     ');
    await elem.subscriptionButton.click();

    await expect(elem.subscriptionSuccessMessage).not.toBeVisible();
  });

  test('Test Case 5: Não deve aceitar e-mail com múltiplos símbolos @ no formulário da Home', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.subscriptionHeading.scrollIntoViewIfNeeded();

    await elem.subscriptionEmailInput.fill('teste@@dominio.com');
    await elem.subscriptionButton.click();

    const isInvalid = await elem.subscriptionEmailInput.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

});