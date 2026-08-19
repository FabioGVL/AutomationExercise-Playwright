import { test, expect } from '../../../suporte/elementos/fixtures';
import { PageElements } from '../../../suporte/elementos/pageElements';
import { gerarDados } from '../../../helpers/userHelper';

/* Cenários Válidos */

test.describe('Cenários Válidos: Categorias e Avaliação de Produtos', () => {

  test('Test Case 1: Deve visualizar produtos das categorias no menu lateral', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await expect(elem.categoriesSidebar).toBeVisible();

    await elem.womenCategoryLink.click();

    await elem.womenDressSubCategory.click();

    await expect(page).toHaveURL(/.*category_products/);
    await expect(elem.categoryProductsHeading).toContainText('Women - Dress Products');

    await elem.menCategoryLink.click();
    await elem.menTshirtsSubCategory.click();

    await expect(page).toHaveURL(/.*category_products/);
    await expect(elem.categoryProductsHeading).toContainText('Men - Tshirts Products');
  });

  test('Test Case 2: Deve adicionar uma avaliação (review) com sucesso em um produto', async ({ page }) => {
    const elem = new PageElements(page);
    const userData = gerarDados();
    const reviewComment = 'Excelente produto, a qualidade superou minhas expectativas!';

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await elem.navProducts.click();

    await expect(page).toHaveURL(/.*products/);
    await expect(elem.allProductsHeading).toBeVisible();

    await elem.firstViewProductBtn.click();

    await expect(elem.writeYourReviewHeading).toBeVisible();

    await elem.reviewNameInput.fill(userData.name);
    await elem.reviewEmailInput.fill(userData.email);
    await elem.reviewCommentInput.fill(reviewComment);

    await elem.reviewSubmitButton.click();

    await expect(elem.reviewSuccessAlert).toBeVisible();
    await expect(elem.reviewSuccessAlert).toHaveText('Thank you for your review.');
  });

  test('Test Case 3: Deve navegar pela subcategoria de crianças (Kids Category)', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await expect(elem.categoriesSidebar).toBeVisible();

    await elem.kidsCategoryLink.click();
    await elem.kidsDressSubCategory.click();

    await expect(page).toHaveURL(/.*category_products/);
    await expect(elem.categoryProductsHeading).toBeVisible();
  });

  test('Test Case 4: Deve visualizar a seção "WRITE YOUR REVIEW" ao acessar os detalhes de qualquer produto', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.firstProductViewBtn.click();

    await expect(elem.writeYourReviewHeading).toBeVisible();
    await expect(elem.writeYourReviewHeading).toHaveText('Write Your Review');
  });

  test('Test Case 5: Deve manter os produtos filtrados corretamente ao alternar entre diferentes subcategorias', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.womenCategoryLink.click();
    await elem.womenTopsSubCategory.click();

    await expect(elem.categoryProductsHeading).toContainText('Women - Tops Products');

    await elem.menCategoryLink.click();
    await elem.menJeansSubCategory.click();

    await expect(elem.categoryProductsHeading).toContainText('Men - Jeans Products');
  });

});

/* Cenários Inválidos */

test.describe('Cenários Inválidos: Categorias e Avaliação de Produtos', () => {

  test('Test Case 1: Não deve permitir enviar avaliação com o campo Nome em branco', async ({ page }) => {
    const elem = new PageElements(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.firstProductViewBtn.click();

    await elem.reviewEmailInput.fill(userData.email);
    await elem.reviewCommentInput.fill('Ótimo produto!');
    await elem.reviewSubmitButton.click();

    const isNameInvalid = await elem.reviewNameInput.evaluate((el) => !el.checkValidity());
    expect(isNameInvalid).toBe(true);
  });

  test('Test Case 2: Não deve permitir enviar avaliação com e-mail em formato inválido', async ({ page }) => {
    const elem = new PageElements(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.firstProductViewBtn.click();

    await elem.reviewNameInput.fill(userData.name);
    await elem.reviewEmailInput.fill('email_sem_formato_correto');
    await elem.reviewCommentInput.fill('Comentário de teste');
    await elem.reviewSubmitButton.click();

    const isEmailInvalid = await elem.reviewEmailInput.evaluate((el) => !el.checkValidity());
    expect(isEmailInvalid).toBe(true);
  });

  test('Test Case 3: Não deve permitir submeter avaliação com o comentário totalmente em branco', async ({ page }) => {
    const elem = new PageElements(page);
    const userData = gerarDados();

    await page.goto('/');
    await elem.firstProductViewBtn.click();

    await elem.reviewNameInput.fill(userData.name);
    await elem.reviewEmailInput.fill(userData.email);
    await elem.reviewSubmitButton.click();

    const isCommentInvalid = await elem.reviewCommentInput.evaluate((el) => !el.checkValidity());
    expect(isCommentInvalid).toBe(true);
  });

  test('Test Case 4: Não deve exibir mensagem de sucesso ao submeter avaliação com todos os campos zerados', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/');
    await elem.firstProductViewBtn.click();

    await elem.reviewSubmitButton.click();

    await expect(elem.reviewSuccessAlert).not.toBeVisible();
  });

  test('Test Case 5: Não deve carregar página de categoria ao acessar ID de categoria inexistente na URL', async ({ page }) => {
    const elem = new PageElements(page);

    await page.goto('/category_products/99999');

    await expect(elem.categoryProductsHeading).not.toContainText('Women - Dress Products');
  });

});