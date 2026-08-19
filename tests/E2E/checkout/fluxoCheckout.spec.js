import { test, expect } from '../../../suporte/elementos/fixtures';
import { PageElements } from '../../../suporte/elementos/pageElements';
import { UserHelper, gerarDados } from '../../../helpers/userHelper';

/* Cenários Válidos */

test.describe('Cenários Válidos: Fluxo de Checkout e Validação de Endereço', () => {

  test('Test Case 1: Deve realizar pedido registrando a conta durante o checkout', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await elem.firstProductCard.hover();
    await elem.firstProductAddToCart.click();
    await elem.continueShoppingButton.click();
    await elem.navCart.click();

    await expect(page).toHaveURL(/.*view_cart/);
    await elem.proceedToCheckoutBtn.click();

    await elem.checkoutRegisterLoginBtn.click();

    await userHelper.registrarNovoUsuario(userData);
    
    await expect(page.getByText(`Logged in as ${userData.name}`)).toBeVisible();

    await elem.navCart.click();
    await elem.proceedToCheckoutBtn.click();

    await expect(elem.addressDeliveryDetails).toBeVisible();
    await expect(elem.addressInvoiceDetails).toBeVisible();

    await elem.orderCommentInput.fill('Entrega no período da manhã, por favor.');
    await elem.placeOrderBtn.click();

    await elem.cardNameInput.fill(userData.name);
    await elem.cardNumberInput.fill('4000000000000000');
    await elem.cardCvcInput.fill('123');
    await elem.cardExpMonthInput.fill('12');
    await elem.cardExpYearInput.fill('2028');
    await elem.payAndConfirmBtn.click();

    await expect(elem.orderSuccessMessage).toContainText('Congratulations! Your order has been confirmed!');

    await elem.navDeleteAccount.click();
    await expect(elem.accountDeletedHeading).toBeVisible();
    
    await elem.continueButton.click();
  });

  test('Test Case 2: Deve realizar pedido se cadastrando antes do checkout', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await elem.navSignupLogin.click();
    
    await userHelper.registrarNovoUsuario(userData);
    await expect(page.getByText(`Logged in as ${userData.name}`)).toBeVisible();

    await elem.firstProductCard.hover();
    await elem.firstProductAddToCart.click();
    await elem.continueShoppingButton.click();

    await elem.navCart.click();
    await expect(page).toHaveURL(/.*view_cart/);

    await elem.proceedToCheckoutBtn.click();

    await expect(elem.addressDeliveryDetails).toBeVisible();
    await expect(elem.addressInvoiceDetails).toBeVisible();

    await elem.orderCommentInput.fill('Instruções especiais de entrega.');
    await elem.placeOrderBtn.click();

    await elem.cardNameInput.fill(userData.name);
    await elem.cardNumberInput.fill('4000000000000000');
    await elem.cardCvcInput.fill('123');
    await elem.cardExpMonthInput.fill('12');
    await elem.cardExpYearInput.fill('2028');
    await elem.payAndConfirmBtn.click();

    await expect(elem.orderSuccessMessage).toContainText('Congratulations! Your order has been confirmed!');

    await elem.navDeleteAccount.click();
    await expect(elem.accountDeletedHeading).toBeVisible();
    await elem.continueButton.click();
  });

  test('Test Case 3: Deve realizar pedido fazendo login antes do checkout', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navSignupLogin.click();
    
    await userHelper.registrarNovoUsuario(userData);
    await elem.navLogout.click();

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await elem.navSignupLogin.click();
    await elem.loginEmailInput.fill(userData.email);
    await elem.loginPasswordInput.fill(userData.password);
    await elem.loginButton.click();

    await expect(page.getByText(`Logged in as ${userData.name}`)).toBeVisible();

    await elem.firstProductCard.hover();
    await elem.firstProductAddToCart.click();
    await elem.continueShoppingButton.click();

    await elem.navCart.click();
    await expect(page).toHaveURL(/.*view_cart/);

    await elem.proceedToCheckoutBtn.click();

    await expect(elem.addressDeliveryDetails).toBeVisible();
    await expect(elem.addressInvoiceDetails).toBeVisible();

    await elem.orderCommentInput.fill('Compra realizada via usuário autenticado.');
    await elem.placeOrderBtn.click();

    await elem.cardNameInput.fill(userData.name);
    await elem.cardNumberInput.fill('4000000000000000');
    await elem.cardCvcInput.fill('123');
    await elem.cardExpMonthInput.fill('12');
    await elem.cardExpYearInput.fill('2028');
    await elem.payAndConfirmBtn.click();

    await expect(elem.orderSuccessMessage).toContainText('Congratulations! Your order has been confirmed!');

    await elem.navDeleteAccount.click();
    await expect(elem.accountDeletedHeading).toBeVisible();
    await elem.continueButton.click();
  });

  test('Test Case 4: Deve verificar se os detalhes de entrega e faturamento no checkout conferem com o cadastro', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await elem.navSignupLogin.click();

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

    await elem.firstProductCard.scrollIntoViewIfNeeded();
    await elem.firstProductCard.hover();
    await elem.firstProductAddToCart.click();
    
    await expect(elem.viewCartModalLink).toBeVisible({ timeout: 10000 });
    await elem.viewCartModalLink.click();

    await expect(page).toHaveURL(/.*view_cart/);
    await expect(elem.cartContainer).toBeVisible();

    await elem.proceedToCheckoutBtn.click();

    await expect(elem.addressDeliveryDetails).toContainText(userData.firstName);
    await expect(elem.addressDeliveryDetails).toContainText(userData.address);
    await expect(elem.addressDeliveryDetails).toContainText(userData.city);

    await expect(elem.addressInvoiceDetails).toContainText(userData.firstName);
    await expect(elem.addressInvoiceDetails).toContainText(userData.address);
    await expect(elem.addressInvoiceDetails).toContainText(userData.city);

    await elem.navDeleteAccount.click();

    await expect(elem.accountDeletedHeading).toBeVisible();
    await elem.continueButton.click();
  });

  test('Test Case 5: Deve permitir avançar para o pagamento sem preencher o campo opcional de comentário', async ({ page }) => {
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

    await expect(page).toHaveURL(/.*payment/);

    await page.goto('/');
    await elem.navDeleteAccount.click();
  });

});


test.describe('Cenários Inválidos: Fluxo de Checkout', () => {

  test('Test Case 1: Não deve exibir o botão "Proceed To Checkout" na página do carrinho sem produtos', async ({ page }) => {
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

  test('Test Case 2: Não deve permitir finalizar o pedido se os campos de pagamento estiverem vazios', async ({ page }) => {
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

  test.fixme('Test Case 3: Não deve permitir submeter pagamento com ano de validade do cartão já expirado', async ({ page }) => {
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
    await elem.cardExpMonthInput.fill('01');
    await elem.cardExpYearInput.fill('2015'); // Cartão vencido
    await elem.payAndConfirmBtn.click();

    await expect(elem.orderSuccessMessage).not.toBeVisible();

    await page.goto('/');
    await elem.navDeleteAccount.click();
  });

  test('Test Case 4: Não deve direcionar para a tela de confirmação se o usuário tentar acessar a rota de checkout sem estar logado', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');

    await elem.firstProductCard.hover();
    await elem.firstProductAddToCart.click();
    await elem.viewCartModalLink.click();

    await elem.proceedToCheckoutBtn.click();

    await expect(elem.checkoutRegisterLoginBtn).toBeVisible();
    await expect(page).not.toHaveURL(/.*checkout/);
  });

  test.fixme('Test Case 5: Não deve permitir prosseguir para a tela de pagamento ao tentar acessar /checkout diretamente sem ter itens no carrinho', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.navSignupLogin.click();
    await userHelper.registrarNovoUsuario(userData);

    await page.goto('/checkout');

    await expect(elem.addressDeliveryDetails).not.toBeVisible();

    
    await page.goto('/');
    await elem.navDeleteAccount.click();
  });

});