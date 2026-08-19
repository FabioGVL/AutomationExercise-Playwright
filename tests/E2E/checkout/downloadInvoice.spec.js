import { test, expect } from '../../../suporte/elementos/fixtures';
import { PageElements } from '../../../suporte/elementos/pageElements';
import { UserHelper, gerarDados } from '../../../helpers/userHelper';
import fs from 'fs';

/* Cenários Válidos */

test.describe('Cenários Válidos: Download de Fatura após Compra', () => {

  test('Test Case 1: Deve realizar o fluxo completo de compra e baixar a fatura com sucesso', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await elem.firstProductCard.hover();
    await elem.firstProductAddToCart.click();

    await expect(elem.viewCartModalLink).toBeVisible({ timeout: 10000 });
    await elem.viewCartModalLink.click();

    await expect(page).toHaveURL(/.*view_cart/);
    await expect(elem.cartContainer.first()).toBeVisible({ timeout: 10000 });

    await elem.proceedToCheckoutBtn.click();

    await expect(elem.checkoutRegisterLoginBtn).toBeVisible({ timeout: 10000 });
    await elem.checkoutRegisterLoginBtn.click();

    await userHelper.fillInitialSignup(userData.name, userData.email);

    await elem.titleMrRadio.click();
    await elem.passwordInput.fill(userData.password);
    await elem.firstNameInput.fill(userData.firstName);
    await elem.lastNameInput.fill(userData.lastName);
    await elem.addressInput.fill(userData.address);
    await elem.stateInput.fill(userData.state);
    await elem.cityInput.fill(userData.city);
    await elem.zipcodeInput.fill(userData.zipcode);
    await elem.mobileNumberInput.fill(userData.mobileNumber);
    await elem.createAccountButton.click();

    await expect(elem.accountCreatedHeading).toBeVisible();
    await elem.continueButton.click();

    await expect(page.getByText(`Logged in as ${userData.name}`)).toBeVisible();

    await elem.navCart.click();
    await elem.proceedToCheckoutBtn.click();

    await expect(elem.addressDeliveryDetails).toBeVisible();
    await expect(elem.addressInvoiceDetails).toBeVisible();

    await elem.orderCommentInput.fill('Compra automatizada realizada com sucesso via Playwright.');
    await elem.placeOrderBtn.click();

    await elem.cardNameInput.fill(userData.name);
    await elem.cardNumberInput.fill('4000000000000000');
    await elem.cardCvcInput.fill('123');
    await elem.cardExpMonthInput.fill('12');
    await elem.cardExpYearInput.fill('2028');
    await elem.payAndConfirmBtn.click();

    await expect(elem.orderSuccessMessage).toHaveText(/order has been confirmed/i);

    const downloadInvoiceButton = page.locator('a[href*="download_invoice"]');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadInvoiceButton.click()
    ]);

    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();
    expect(fs.existsSync(downloadPath)).toBeTruthy();

    await elem.continueButton.click();
    await elem.navDeleteAccount.click();
    await expect(elem.accountDeletedHeading).toBeVisible();
    await elem.continueButton.click();
  });

  test('Test Case 2: Deve validar os dados de entrega e cobrança na tela de checkout antes de pagar', async ({ page }) => {
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

    await expect(elem.addressDeliveryDetails).toBeVisible();
    await expect(elem.addressInvoiceDetails).toBeVisible();

    await expect(elem.addressDeliveryDetails).toContainText(userData.address);
    await expect(elem.addressInvoiceDetails).toContainText(userData.address);

    await elem.navDeleteAccount.click();
  });

  test('Test Case 3: Deve realizar o fluxo de checkout com usuário já cadastrado antes de adicionar produtos', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navSignupLogin.click();
    await userHelper.registrarNovoUsuario(userData);

    await elem.firstProductCard.hover();
    await elem.firstProductAddToCart.click();
    await elem.viewCartModalLink.click();

    await elem.proceedToCheckoutBtn.click();
    await elem.placeOrderBtn.click();

    await elem.cardNameInput.fill(userData.name);
    await elem.cardNumberInput.fill('4000000000000000');
    await elem.cardCvcInput.fill('123');
    await elem.cardExpMonthInput.fill('12');
    await elem.cardExpYearInput.fill('2028');
    await elem.payAndConfirmBtn.click();

    await expect(elem.orderSuccessMessage).toBeVisible();

    await elem.continueButton.click();
    await elem.navDeleteAccount.click();
  });

  test('Test Case 4: Deve exibir o botão "Download Invoice" e o botão "Continue" após a confirmação do pedido', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navSignupLogin.click();
    await userHelper.registrarNovoUsuario(userData);

    await elem.firstProductCard.hover();
    await elem.firstProductAddToCart.click();
    await elem.viewCartModalLink.click();
    await elem.proceedToCheckoutBtn.click();
    await elem.placeOrderBtn.click();

    await elem.cardNameInput.fill(userData.name);
    await elem.cardNumberInput.fill('4000000000000000');
    await elem.cardCvcInput.fill('123');
    await elem.cardExpMonthInput.fill('12');
    await elem.cardExpYearInput.fill('2028');
    await elem.payAndConfirmBtn.click();

    const downloadBtn = page.locator('a[href*="download_invoice"]');
    await expect(downloadBtn).toBeVisible();
    await expect(elem.continueButton).toBeVisible();

    await elem.continueButton.click();
    await elem.navDeleteAccount.click();
  });

  test('Test Case 5: Deve permitir adicionar um comentário ao pedido antes de prosseguir para o pagamento', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navSignupLogin.click();
    await userHelper.registrarNovoUsuario(userData);

    await elem.firstProductCard.hover();
    await elem.firstProductAddToCart.click();
    await elem.viewCartModalLink.click();
    await elem.proceedToCheckoutBtn.click();

    await elem.orderCommentInput.fill('Entregar no período da tarde.');
    await elem.placeOrderBtn.click();

    await expect(page).toHaveURL(/.*payment/);

    await page.goto('/');
    await elem.navDeleteAccount.click();
  });

});

/* Cenários Inválidos */

test.describe('Cenários Inválidos: Download de Fatura e Checkout', () => {

  test('Test Case 1: Não deve permitir prosseguir para o pagamento se o carrinho de compras estiver vazio', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navSignupLogin.click();
    await userHelper.registrarNovoUsuario(userData);

    await elem.navCart.click();

    await expect(elem.proceedToCheckoutBtn).not.toBeVisible();

    await elem.navDeleteAccount.click();
  });

  test('Test Case 2: Não deve concluir o pagamento com os campos do cartão de crédito em branco', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navSignupLogin.click();
    await userHelper.registrarNovoUsuario(userData);

    await elem.firstProductCard.hover();
    await elem.firstProductAddToCart.click();
    await elem.viewCartModalLink.click();
    await elem.proceedToCheckoutBtn.click();
    await elem.placeOrderBtn.click();

    await elem.payAndConfirmBtn.click();

    await expect(elem.orderSuccessMessage).not.toBeVisible();

    await page.goto('/');
    await elem.navDeleteAccount.click();
  });

  test.fixme('Test Case 3: Não deve permitir acessar a URL do pagamento diretamente sem passar pelo checkout', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navSignupLogin.click();
    await userHelper.registrarNovoUsuario(userData);

    await page.goto('/payment');

    await expect(page).not.toHaveURL(/.*payment/);

    await page.goto('/');
    await elem.navDeleteAccount.click();
  });

  test('Test Case 4: Não deve exibir o link de download da fatura se o pedido não foi finalizado', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.firstProductCard.hover();
    await elem.firstProductAddToCart.click();
    await elem.viewCartModalLink.click();

    const downloadBtn = page.locator('a[href*="download_invoice"]');
    await expect(downloadBtn).not.toBeVisible();
  });

  test.fixme('Test Case 5: Não deve permitir o download de uma fatura existente se o usuário não estiver autenticado', async ({ page, browser }) => {
  const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navSignupLogin.click();
    await userHelper.registrarNovoUsuario(userData);

    await elem.firstProductCard.hover();
    await elem.firstProductAddToCart.click();
    await elem.viewCartModalLink.click();
    await elem.proceedToCheckoutBtn.click();
    await elem.placeOrderBtn.click();

    await elem.cardNameInput.fill('Tester');
    await elem.cardNumberInput.fill('1234567890');
    await elem.cardCvcInput.fill('123');
    await elem.cardExpMonthInput.fill('12');
    await elem.cardExpYearInput.fill('2028');
    await elem.payAndConfirmBtn.click();

    const invoiceUrl = await page.locator('a[href*="download_invoice"]').getAttribute('href');

    const incognitoContext = await browser.newContext();
    const incognitoPage = await incognitoContext.newPage();
    const response = await incognitoPage.request.get(invoiceUrl);

    expect(response.status()).not.toBe(200);

    await incognitoContext.close();
    await page.goto('/');
    await elem.navDeleteAccount.click();
});

});