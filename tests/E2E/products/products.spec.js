import { test, expect } from '../../../suporte/elementos/fixtures';
import { PageElements } from '../../../suporte/elementos/pageElements';
import { UserHelper, gerarDados, bloquearAds } from '../../../helpers/userHelper';

/* Cenários Válidos */

test.describe('Cenários Válidos: Consulta e Navegação de Produtos', () => {

  test('Test Case 1: Deve verificar a página de produtos e os detalhes do primeiro produto', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await elem.navProducts.click();

    await expect(elem.allProductsHeading).toBeVisible();
    await expect(elem.productsList).toBeVisible();

    await elem.firstProductViewBtn.click();

    await expect(page).toHaveURL(/.*product_details\/\d+/);

    await expect(elem.productName).toBeVisible();
    await expect(elem.productCategory).toBeVisible();
    await expect(elem.productPrice).toBeVisible();
    await expect(elem.productAvailability).toBeVisible();
    await expect(elem.productCondition).toBeVisible();
    await expect(elem.productBrand).toBeVisible();
  });

  test('Test Case 2: Deve pesquisar um produto e exibir os resultados correspondentes', async ({ page }) => {
    const elem = new PageElements(page);
    const searchTerm = 'Dress';

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await elem.navProducts.click();
    await expect(elem.allProductsHeading).toBeVisible();

    await elem.searchInput.fill(searchTerm);
    await elem.searchButton.click();

    await expect(elem.searchedProductsHeading).toBeVisible();
    await expect(elem.searchedProductsList.first()).toBeVisible();
    
    const count = await elem.searchedProductsList.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Test Case 3: Deve visualizar e navegar pelos produtos das marcas', async ({ page }) => {
    await bloquearAds(page);
    const elem = new PageElements(page);

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await elem.navProducts.click();
    await expect(elem.allProductsHeading).toBeVisible();

    await expect(elem.brandsSidebar).toBeVisible();

    await elem.brandPoloLink.click();

    await expect(page).toHaveURL(/.*brand_products\/Polo/);
    await expect(elem.mainHeading).toContainText('Brand - Polo Products');
    await expect(elem.productsList).toBeVisible();

    await elem.brandHAndMLink.click();

    await expect(page).toHaveURL(/.*brand_products\/H&M/);
    await expect(elem.mainHeading).toContainText('Brand - H&M Products');
    await expect(elem.productsList).toBeVisible();
  });

  test('Test Case 4: Deve pesquisar produtos, adicionar ao carrinho, fazer login e verificar persistência', async ({ page }) => {
    const elem = new PageElements(page);
    const userHelper = new UserHelper(page);
    const userData = gerarDados();
    const searchTerm = 'tshirt';

    await userHelper.registrarNovoUsuario(userData);
    await elem.navLogout.click();

    await elem.navProducts.click();
    await expect(page).toHaveURL(/.*products/);

    await elem.searchInput.fill(searchTerm);
    await elem.searchButton.click();

    await expect(elem.searchedProductsHeading).toBeVisible();
    await expect(elem.searchedProductsList.first()).toBeVisible();
    await elem.searchedProductsList.first().hover();
    await elem.firstProductAddToCart.click();
    await elem.viewCartModalLink.click();

    await expect(elem.cartContainer.first()).toBeVisible();

    await elem.navSignupLogin.click();
    await elem.loginEmailInput.fill(userData.email);
    await elem.loginPasswordInput.fill(userData.password);
    await elem.loginButton.click();
    await expect(page.getByText(`Logged in as ${userData.name}`)).toBeVisible();

    await elem.navCart.click();

    await expect(elem.cartContainer.first()).toBeVisible();

    await elem.navDeleteAccount.click();
    await expect(elem.accountDeletedHeading).toBeVisible();
  });

  test('Test Case 5: Deve permitir ajustar a quantidade de produtos na tela de detalhes antes de adicionar ao carrinho', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.navProducts.click();
    await elem.firstProductViewBtn.click();

    await expect(page).toHaveURL(/.*product_details\/\d+/);

    const quantityInput = page.locator('#quantity');
    await quantityInput.fill('4');

    await page.locator('button.cart').click();
    await elem.viewCartModalLink.click();

    const cartQuantity = elem.cartContainer.first().locator('.disabled');
    await expect(cartQuantity).toHaveText('4');
  });

});

/* Cenários Inválidos */

test.describe('Cenários Inválidos: Consulta e Navegação de Produtos', () => {

  test('Test Case 1: Não deve retornar produtos ao realizar busca por um termo inexistente', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.navProducts.click();

    await elem.searchInput.fill('produto_inexistente_xyz_999');
    await elem.searchButton.click();

    await expect(elem.searchedProductsHeading).toBeVisible();
    
    const count = await elem.searchedProductsList.count();
    expect(count).toBe(0);
  });

  test('Test Case 2: Não deve alterar a listagem ao clicar no botão de busca com o campo em branco', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.navProducts.click();

    await elem.searchInput.fill('');
    await elem.searchButton.click();

    await expect(elem.allProductsHeading).toBeVisible();
    await expect(elem.productsList).toBeVisible();
  });

  test('Test Case 3: Não deve renderizar a página de detalhes para um ID de produto inexistente na URL', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/product_details/999999');

    await expect(elem.productName).not.toBeVisible();
  });

  test('Test Case 4: Deve tratar a busca por caracteres especiais sem quebrar a aplicação', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.navProducts.click();

    await elem.searchInput.fill('<script>alert("test")</script>');
    await elem.searchButton.click();

    await expect(elem.searchedProductsHeading).toBeVisible();

    const count = await elem.searchedProductsList.count();
    expect(count).toBe(0);
  });

  test('Test Case 5: Não deve carregar listagem de produtos para uma marca não existente na URL', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/brand_products/MarcaInexistenteXYZ');

    // Valida que a página de marca genérica não exibe produtos válidos da lista
    await expect(elem.mainHeading).not.toContainText('Brand - Polo Products');
  });

});