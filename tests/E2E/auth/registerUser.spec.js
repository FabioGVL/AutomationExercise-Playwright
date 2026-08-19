import { test, expect } from '../../../suporte/elementos/fixtures';
import { PageElements } from '../../../suporte/elementos/pageElements';
import { UserHelper, gerarDados } from '../../../helpers/userHelper';

/* Cenários Válidos */

test.describe('Cenários Válidos: Autenticação e Cadastro de Usuário', () => {

  test('Test Case 1: Cadastrar e excluir usuário', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await elem.navSignupLogin.click();
    await expect(elem.signUpHeading).toBeVisible();

    await userHelper.fillInitialSignup(userData.name, userData.email);

    await elem.titleMrRadio.check();
    await elem.passwordInput.fill(userData.password);
    await elem.daysSelect.selectOption('10');
    await elem.monthsSelect.selectOption('May');
    await elem.yearsSelect.selectOption('1995');

    await elem.firstNameInput.fill(userData.firstName);
    await elem.lastNameInput.fill(userData.lastName);
    await elem.addressInput.fill(userData.address);
    await elem.countrySelect.selectOption('United States');
    await elem.stateInput.fill(userData.state);
    await elem.cityInput.fill(userData.city);
    await elem.zipcodeInput.fill(userData.zipcode);
    await elem.mobileNumberInput.fill(userData.mobileNumber);

    await elem.createAccountButton.click();
    await expect(elem.accountCreatedHeading).toBeVisible();

    await elem.continueButton.click();
    await expect(page.getByText(`Logged in as ${userData.name}`)).toBeVisible();

    await elem.navDeleteAccount.click();
    await expect(elem.accountDeletedHeading).toBeVisible();
  });

  test('Test Case 2: Deve cadastrar usuário preenchendo todos os campos opcionais (Newsletter e Ofertas Especiais)', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navSignupLogin.click();

    await userHelper.fillInitialSignup(userData.name, userData.email);

    await elem.titleMrRadio.check();
    await elem.passwordInput.fill(userData.password);
    
    await elem.newsletterCheckbox.check();
    await elem.specialOffersCheckbox.check();

    await elem.firstNameInput.fill(userData.firstName);
    await elem.lastNameInput.fill(userData.lastName);
    await elem.companyInput.fill('QA Solutions');
    await elem.addressInput.fill(userData.address);
    await elem.address2Input.fill('Apto 101');
    await elem.countrySelect.selectOption('Canada');
    await elem.stateInput.fill(userData.state);
    await elem.cityInput.fill(userData.city);
    await elem.zipcodeInput.fill(userData.zipcode);
    await elem.mobileNumberInput.fill(userData.mobileNumber);

    await elem.createAccountButton.click();
    await expect(elem.accountCreatedHeading).toBeVisible();

    await elem.continueButton.click();
    await expect(page.getByText(`Logged in as ${userData.name}`)).toBeVisible();

    await elem.navDeleteAccount.click();
    await expect(elem.accountDeletedHeading).toBeVisible();
  });

  test('Test Case 3: Deve cadastrar usuário selecionando data de nascimento completa', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navSignupLogin.click();

    await userHelper.fillInitialSignup(userData.name, userData.email);

    await elem.titleMrRadio.check();
    await elem.passwordInput.fill(userData.password);

    await elem.daysSelect.selectOption('15');
    await elem.monthsSelect.selectOption('July');
    await elem.yearsSelect.selectOption('1998');

    await elem.firstNameInput.fill(userData.firstName);
    await elem.lastNameInput.fill(userData.lastName);
    await elem.addressInput.fill(userData.address);
    await elem.countrySelect.selectOption('United States');
    await elem.stateInput.fill(userData.state);
    await elem.cityInput.fill(userData.city);
    await elem.zipcodeInput.fill(userData.zipcode);
    await elem.mobileNumberInput.fill(userData.mobileNumber);

    await elem.createAccountButton.click();
    await expect(elem.accountCreatedHeading).toBeVisible();

    await elem.continueButton.click();
    await expect(page.getByText(`Logged in as ${userData.name}`)).toBeVisible();

    await elem.navDeleteAccount.click();
  });

  test('Test Case 4: Deve validar presença do título "ENTER ACCOUNT INFORMATION" e e-mail desabilitado na segunda etapa', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navSignupLogin.click();

    await userHelper.fillInitialSignup(userData.name, userData.email);

    await expect(elem.enterAccountInformationHeading).toBeVisible();
    await expect(elem.emailDisabledInput).toHaveValue(userData.email);
    await expect(elem.emailDisabledInput).toBeDisabled();
  });

  test('Test Case 5: Deve permitir selecionar diferentes países no formulário de cadastro', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navSignupLogin.click();

    await userHelper.fillInitialSignup(userData.name, userData.email);

    await elem.passwordInput.fill(userData.password);
    await elem.firstNameInput.fill(userData.firstName);
    await elem.lastNameInput.fill(userData.lastName);
    await elem.addressInput.fill(userData.address);
    
    await elem.countrySelect.selectOption('Australia');
    await expect(elem.countrySelect).toHaveValue('Australia');

    await elem.stateInput.fill(userData.state);
    await elem.cityInput.fill(userData.city);
    await elem.zipcodeInput.fill(userData.zipcode);
    await elem.mobileNumberInput.fill(userData.mobileNumber);

    await elem.createAccountButton.click();
    await expect(elem.accountCreatedHeading).toBeVisible();

    await elem.continueButton.click();
    await elem.navDeleteAccount.click();
  });

});

/* Cenários Inválidos */

test.describe('Cenários Inválidos: Cadastro de Usuário', () => {

  test('Test Case 1: Não deve permitir cadastro com e-mail já existente', async ({ page }) => {
    const userHelper = new UserHelper(page);
    const elem = new PageElements(page);
    const userData = gerarDados();
    const novoNome = gerarDados().name;

    await userHelper.registrarNovoUsuario(userData);

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);
    await elem.navLogout.click();

    await elem.navSignupLogin.click();
    await expect(elem.signUpHeading).toBeVisible();

    await userHelper.fillInitialSignup(novoNome, userData.email);

    await expect(page.getByText('Email Address already exist!')).toBeVisible();

    await elem.loginEmailInput.fill(userData.email);
    await elem.loginPasswordInput.fill(userData.password);
    await elem.loginButton.click();
    await elem.navDeleteAccount.click();
  });

  test('Test Case 2: Não deve permitir submeter a primeira etapa de cadastro com o campo Nome em branco', async ({ page }) => {
    const elem = new PageElements(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navSignupLogin.click();

    await elem.signUpEmailInput.fill(userData.email);
    await elem.signUpButton.click();

    const isNameInvalid = await elem.signUpNameInput.evaluate((el) => !el.checkValidity());
    expect(isNameInvalid).toBe(true);
  });

  test('Test Case 3: Não deve permitir criar conta sem preencher campos obrigatórios na segunda etapa', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navSignupLogin.click();

    await userHelper.fillInitialSignup(userData.name, userData.email);

    await elem.createAccountButton.click();

    const isPasswordInvalid = await elem.passwordInput.evaluate((el) => !el.checkValidity());
    expect(isPasswordInvalid).toBe(true);
  });

  test.fixme('Test Case 4: Não deve permitir cadastro inicial com e-mail sem domínio válido', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.navSignupLogin.click();

    await elem.signUpNameInput.fill('Teste QA');
    await elem.signUpEmailInput.fill('usuario@dominioInvalidoSemPonto');

    const emailInvalido = await elem.signUpEmailInput.evaluate((el) => !el.checkValidity());
    expect(emailInvalido).toBe(true);

    await elem.signUpButton.click();
    
    await expect(page).toHaveURL(/.*login/);
  });

  test('Test Case 5: Não deve permitir submeter formulário de cadastro com todos os campos zerados', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.navSignupLogin.click();

    await elem.signUpButton.click();

    const isNameInvalid = await elem.signUpNameInput.evaluate((el) => !el.checkValidity());
    const isEmailInvalid = await elem.signUpEmailInput.evaluate((el) => !el.checkValidity());

    expect(isNameInvalid).toBe(true);
    expect(isEmailInvalid).toBe(true);
  });

});