import { test, expect } from '../../../suporte/elementos/fixtures';
import { PageElements } from '../../../suporte/elementos/pageElements';
import { UserHelper, gerarDados } from '../../../helpers/userHelper';

/* Cenários Válidos */

test.describe('Cenários Válidos: Cadastrar, Logar e Deletar Conta', () => {

  test('Test Case 1: Deve cadastrar e excluir um usuário com sucesso', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await elem.navSignupLogin.click();

    await userHelper.registrarNovoUsuario(userData);

    await expect(page.getByText(`Logged in as ${userData.name}`)).toBeVisible();

    await elem.navDeleteAccount.click();
    await expect(elem.accountDeletedHeading).toBeVisible();
    await elem.continueButton.click();
  });

  test('Test Case 2: Deve realizar login com sucesso em conta existente', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navSignupLogin.click();
    await userHelper.registrarNovoUsuario(userData);
    await elem.navLogout.click();

    await elem.loginEmailInput.fill(userData.email);
    await elem.loginPasswordInput.fill(userData.password);
    await elem.loginButton.click();

    await expect(page.getByText(`Logged in as ${userData.name}`)).toBeVisible();

    await elem.navDeleteAccount.click();
    await expect(elem.accountDeletedHeading).toBeVisible();
  });

  test('Test Case 3: Deve realizar o logout com sucesso', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navSignupLogin.click();
    await userHelper.registrarNovoUsuario(userData);

    await elem.navLogout.click();

    await expect(page).toHaveURL(/.*login/);
    await expect(elem.loginEmailInput).toBeVisible();

    await elem.loginEmailInput.fill(userData.email);
    await elem.loginPasswordInput.fill(userData.password);
    await elem.loginButton.click();
    await elem.navDeleteAccount.click();
  });

  test('Test Case 4: Deve manter a sessão ativa ao navegar entre as páginas', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navSignupLogin.click();
    await userHelper.registrarNovoUsuario(userData);

    await elem.navProducts.click();
    await expect(page.getByText(`Logged in as ${userData.name}`)).toBeVisible();

    await elem.navCart.click();
    await expect(page.getByText(`Logged in as ${userData.name}`)).toBeVisible();

    await elem.navDeleteAccount.click();
  });

  test('Test Case 5: Deve redirecionar para a tela de login ao clicar no menu Signup/Login', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.navSignupLogin.click();

    await expect(page).toHaveURL(/.*login/);
    await expect(elem.loginEmailInput).toBeVisible();
    await expect(elem.signUpEmailInput).toBeVisible();
  });

});

/* Cenários Inválidos */

test.describe('Cenários Inválidos: Autenticação e Cadastro', () => {

  test('Test Case 1: Não deve efetuar login com senha incorreta', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navSignupLogin.click();
    await userHelper.registrarNovoUsuario(userData);
    await elem.navLogout.click();

    await elem.loginEmailInput.fill(userData.email);
    await elem.loginPasswordInput.fill('SenhaErrada123!');
    await elem.loginButton.click();

    await expect(elem.loginErrorMessage).toHaveText('Your email or password is incorrect!');

    await elem.loginEmailInput.fill(userData.email);
    await elem.loginPasswordInput.fill(userData.password);
    await elem.loginButton.click();
    await elem.navDeleteAccount.click();
  });

  test('Test Case 2: Não deve permitir cadastro utilizando e-mail já registrado', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navSignupLogin.click();
    await userHelper.registrarNovoUsuario(userData);
    await elem.navLogout.click();

    await userHelper.fillInitialSignup(userData.name, userData.email);

    await expect(elem.signUpErrorMessage).toHaveText('Email Address already exist!');

    await elem.loginEmailInput.fill(userData.email);
    await elem.loginPasswordInput.fill(userData.password);
    await elem.loginButton.click();
    await elem.navDeleteAccount.click();
  });

  test('Test Case 3: Não deve permitir login com usuário inexistente', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.navSignupLogin.click();

    await elem.loginEmailInput.fill('usuario_inexistente_qa_12345@test.com');
    await elem.loginPasswordInput.fill('senha123');
    await elem.loginButton.click();

    await expect(elem.loginErrorMessage).toHaveText('Your email or password is incorrect!');
  });

  test('Test Case 4: Não deve permitir submeter formulário de cadastro inicial com e-mail em formato inválido', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.navSignupLogin.click();

    await elem.signUpNameInput.fill('Usuario Teste');
    await elem.signUpEmailInput.fill('email_invalido_sem_arroba');
    await elem.signUpButton.click();

    const isInvalid = await elem.signUpEmailInput.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test('Test Case 5: Não deve permitir submeter login com campos vazios', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.navSignupLogin.click();

    await elem.loginButton.click();

    const isEmailInvalid = await elem.loginEmailInput.evaluate((el) => !el.checkValidity());
    expect(isEmailInvalid).toBe(true);
  });

});