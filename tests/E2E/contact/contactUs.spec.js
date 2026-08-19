import { test, expect } from '../../../suporte/elementos/fixtures';
import { PageElements } from '../../../suporte/elementos/pageElements';
import { gerarDados } from '../../../helpers/userHelper';
import fs from 'fs';
import path from 'path';

/* Cenários Válidos */

test.describe('Cenários Válidos: Formulário de Contato', () => {

  test('Test Case 1: Deve enviar mensagem pelo formulário Contact Us com upload de arquivo', async ({ page }) => {
    const elem = new PageElements(page);
    const userData = gerarDados();

    const filePath = path.resolve(__dirname, 'temp_upload.txt');
    fs.writeFileSync(filePath, 'Conteúdo de teste para upload.');

    try {
      await page.goto('/');
      await expect(page).toHaveTitle(/Automation Exercise/);

      await page.getByRole('link', { name: 'Contact Us' }).click();
      await expect(elem.contactHeading).toBeVisible();

      await elem.contactNameInput.fill(userData.name);
      await elem.contactEmailInput.fill(userData.email);
      await elem.contactSubjectInput.fill('Dúvida sobre suporte');
      await elem.contactMessageInput.fill('Solicito atendimento referente a um problema com o meu pedido.');

      await elem.uploadFileInput.waitFor({ state: 'attached' });
      await elem.uploadFileInput.setInputFiles(filePath);

      await Promise.all([
        page.waitForEvent('dialog').then(dialog => dialog.accept()),
        elem.submitButton.click(),
      ]);

      await expect(elem.successMessage).toHaveText(
        'Success! Your details have been submitted successfully.',
      );

    } finally {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  });

  test('Test Case 2: Deve enviar mensagem pelo formulário Contact Us sem anexo de arquivo', async ({ page }) => {
    const elem = new PageElements(page);
    const userData = gerarDados();

    await page.goto('/');
    await page.getByRole('link', { name: 'Contact Us' }).click();

    await elem.contactNameInput.fill(userData.name);
    await elem.contactEmailInput.fill(userData.email);
    await elem.contactSubjectInput.fill('Elogio ao atendimento');
    await elem.contactMessageInput.fill('Gostaria de parabenizar a equipe pela agilidade na entrega.');

    await Promise.all([
      page.waitForEvent('dialog').then(dialog => dialog.accept()),
      elem.submitButton.click(),
    ]);

    await expect(elem.successMessage).toHaveText(
      'Success! Your details have been submitted successfully.',
    );
  });

  test('Test Case 3: Deve exibir o título "GET IN TOUCH" ao acessar a tela de Contact Us', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await page.getByRole('link', { name: 'Contact Us' }).click();

    await expect(elem.contactHeading).toBeVisible();
    await expect(elem.contactHeading).toHaveText(/get in touch/i);
  });

  test('Test Case 4: Deve navegar de volta para a Home ao clicar no botão "Home" após envio com sucesso', async ({ page }) => {
    const elem = new PageElements(page);
    const userData = gerarDados();

    await page.goto('/');
    await page.getByRole('link', { name: 'Contact Us' }).click();

    await elem.contactNameInput.fill(userData.name);
    await elem.contactEmailInput.fill(userData.email);
    await elem.contactSubjectInput.fill('Sugestão');
    await elem.contactMessageInput.fill('Melhorar filtros do catálogo.');

    await Promise.all([
      page.waitForEvent('dialog').then(dialog => dialog.accept()),
      elem.submitButton.click(),
    ]);

    await expect(elem.successMessage).toHaveText(
      'Success! Your details have been submitted successfully.',
    );

    await page.locator('a.btn-success').click();
    await expect(page).toHaveURL(/.*automationexercise.com/);
  });

  test('Test Case 5: Deve permitir a inserção de textos longos no campo de mensagem', async ({ page }) => {
    const elem = new PageElements(page);
    const userData = gerarDados();
    const mensagemLonga = 'Texto de teste longo '.repeat(20);

    await page.goto('/');
    await page.getByRole('link', { name: 'Contact Us' }).click();

    await elem.contactNameInput.fill(userData.name);
    await elem.contactEmailInput.fill(userData.email);
    await elem.contactSubjectInput.fill('Relatório Detalhado');
    await elem.contactMessageInput.fill(mensagemLonga);

    await Promise.all([
      page.waitForEvent('dialog').then(dialog => dialog.accept()),
      elem.submitButton.click(),
    ]);

    await expect(elem.successMessage).toHaveText(
      'Success! Your details have been submitted successfully.',
    );
  });

});

/* Cenários Inválidos */

test.describe('Cenários Inválidos: Formulário de Contato', () => {

  test('Test Case 1: Não deve permitir enviar mensagem com o campo de e-mail em branco', async ({ page }) => {
    const elem = new PageElements(page);
    const userData = gerarDados();

    await page.goto('/');
    await page.getByRole('link', { name: 'Contact Us' }).click();

    await elem.contactNameInput.fill(userData.name);
    await elem.contactSubjectInput.fill('Assunto Teste');
    await elem.contactMessageInput.fill('Mensagem de teste.');

    await elem.submitButton.click();

    const isInvalid = await elem.contactEmailInput.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test('Test Case 2: Não deve permitir enviar mensagem com e-mail em formato inválido', async ({ page }) => {
    const elem = new PageElements(page);
    const userData = gerarDados();

    await page.goto('/');
    await page.getByRole('link', { name: 'Contact Us' }).click();

    await elem.contactNameInput.fill(userData.name);
    await elem.contactEmailInput.fill('emailInvalidoSemArroba');
    await elem.contactSubjectInput.fill('Assunto Teste');
    await elem.contactMessageInput.fill('Mensagem de teste.');

    await elem.submitButton.click();

    const isInvalid = await elem.contactEmailInput.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test.fixme('Test Case 3: Não deve permitir enviar formulário com o campo Nome em branco', async ({ page }) => {
    const elem = new PageElements(page);
    const userData = gerarDados();

    await page.goto('/');
    await page.getByRole('link', { name: 'Contact Us' }).click();

    await elem.contactEmailInput.fill(userData.email);
    await elem.contactSubjectInput.fill('Assunto Teste');
    await elem.contactMessageInput.fill('Mensagem de teste.');

    await elem.submitButton.click();

    const isInvalid = await elem.contactNameInput.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test.fixme('Test Case 4: Não deve permitir enviar formulário com a Mensagem totalmente em branco', async ({ page }) => {
    const elem = new PageElements(page);
    const userData = gerarDados();

    await page.goto('/');
    await page.getByRole('link', { name: 'Contact Us' }).click();

    await elem.contactNameInput.fill(userData.name);
    await elem.contactEmailInput.fill(userData.email);
    await elem.contactSubjectInput.fill('Assunto Teste');

    await elem.submitButton.click();

    const isInvalid = await elem.contactMessageInput.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test('Test Case 5: Não deve submeter o formulário se o usuário cancelar o alerta (dialog) de confirmação', async ({ page }) => {
    const elem = new PageElements(page);
    const userData = gerarDados();

    page.on('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    await page.goto('/');
    await page.getByRole('link', { name: 'Contact Us' }).click();

    await elem.contactNameInput.fill(userData.name);
    await elem.contactEmailInput.fill(userData.email);
    await elem.contactSubjectInput.fill('Dúvida');
    await elem.contactMessageInput.fill('Mensagem que não deve ser enviada.');

    await elem.submitButton.click();

    await expect(elem.successMessage).not.toBeVisible();
  });

});