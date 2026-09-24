class PageElements {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // --- SEÇÃO: NAVBAR / CABEÇALHO ---
    this.navHome = page.locator('a:has(.fa-home)');
    this.navSignupLogin = page.getByRole('link', { name: 'Signup / Login' });
    this.navContactUs = page.getByRole('link', { name: 'Contact Us' });
    this.navTestCases = page.getByRole('link', { name: 'Test Cases', exact: true });
    this.navProducts = page.locator('a[href="/products"]');
    this.navCart = page.locator('a[href="/view_cart"]:has(i.fa-shopping-cart)');
    this.navLogout = page.getByRole('link', { name: 'Logout' });
    this.navDeleteAccount = page.getByRole('link', { name: 'Delete Account' });
    this.logoHeader = page.locator('.logo a');

    // --- SEÇÃO: SIGNUP / LOGIN (INICIAL) ---
    this.signUpHeading = page.getByRole('heading', { name: 'New User Signup!' });
    this.signUpNameInput = page.locator('[data-qa="signup-name"]');
    this.signUpEmailInput = page.locator('[data-qa="signup-email"]');
    this.signUpButton = page.locator('[data-qa="signup-button"]');

    this.loginHeading = page.getByRole('heading', { name: 'Login to your account' });
    this.loginEmailInput = page.locator('[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');

    // --- MENSAGENS DE ERRO ---
    this.loginErrorMessage = page.locator('form[action="/login"] p');
    this.signUpErrorMessage = page.locator('form[action="/signup"] p');

    // --- SEÇÃO: FORMULÁRIO DE CADASTRO COMPLETO ---
    this.enterAccountInformationHeading = page.getByText('Enter Account Information');
    this.emailDisabledInput = page.locator('#email');
    this.titleMrRadio = page.locator('#id_gender1');
    this.passwordInput = page.locator('[data-qa="password"]');
    this.daysSelect = page.locator('[data-qa="days"]');
    this.monthsSelect = page.locator('[data-qa="months"]');
    this.yearsSelect = page.locator('[data-qa="years"]');
    
    // --- CHECKBOXES OPCIONAIS ---
    this.newsletterCheckbox = page.locator('#newsletter');
    this.specialOffersCheckbox = page.locator('#optin');

    // --- ENDEREÇO E DADOS PESSOAIS ---
    this.firstNameInput = page.locator('[data-qa="first_name"]');
    this.lastNameInput = page.locator('[data-qa="last_name"]');
    this.companyInput = page.locator('[data-qa="company"]');
    this.addressInput = page.locator('[data-qa="address"]');
    this.address2Input = page.locator('[data-qa="address2"]');
    this.countrySelect = page.locator('[data-qa="country"]');
    this.stateInput = page.locator('[data-qa="state"]');
    this.cityInput = page.locator('[data-qa="city"]');
    this.zipcodeInput = page.locator('[data-qa="zipcode"]');
    this.mobileNumberInput = page.locator('[data-qa="mobile_number"]');
    this.createAccountButton = page.locator('[data-qa="create-account"]');
    this.continueButton = page.locator('[data-qa="continue-button"]');
    this.accountCreatedHeading = page.getByText('Account Created!');
    this.accountDeletedHeading = page.getByText('Account Deleted!');

    // --- SEÇÃO: CONTACT US ---
    this.contactHeading = page.getByRole('heading', { name: 'Get In Touch' });
    this.contactNameInput = page.locator('[data-qa="name"]');
    this.contactEmailInput = page.locator('[data-qa="email"]');
    this.contactSubjectInput = page.locator('[data-qa="subject"]');
    this.contactMessageInput = page.locator('[data-qa="message"]');
    this.uploadFileInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.locator('[data-qa="submit-button"]');
    this.successMessage = page.locator('.status.alert-success');

    // --- SEÇÃO: TEST CASES PAGE ---
    this.testCasesHeading = page.getByRole('heading', { name: 'Test Cases', exact: true });

    // --- SEÇÃO: PRODUCTS PAGE ---
    this.allProductsHeading = page.getByRole('heading', { name: 'All Products', exact: true });
    this.productsList = page.locator('.features_items');
    this.firstProductViewBtn = page.locator('.choose > .nav > li > a').first();
    this.productName = page.locator('.product-information h2');
    this.productCategory = page.locator('.product-information p:has-text("Category:")');
    this.productPrice = page.locator('.product-information span span');
    this.productAvailability = page.locator('.product-information p:has-text("Availability:")');
    this.productCondition = page.locator('.product-information p:has-text("Condition:")');
    this.productBrand = page.locator('.product-information p:has-text("Brand:")');
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.searchedProductsHeading = page.getByRole('heading', { name: 'Searched Products', exact: true });
    this.searchedProductsList = page.locator('.features_items .col-sm-4');
    this.firstProductCard = page.locator('.single-products').first();
    this.firstProductAddToCart = page.locator('.product-overlay .add-to-cart').first();
    this.secondProductCard = page.locator('.single-products').nth(1);
    this.secondProductAddToCart = page.locator('.product-overlay .add-to-cart').nth(1);
    this.firstViewProductBtn = page.locator('.choose a[href*="/product_details/"]').first();
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.viewCartModalLink = page.locator('#cartModal a[href="/view_cart"]');
    
    // MARCAS (BRANDS)
    this.brandsSidebar = page.locator('.brands_products');
    this.brandPoloLink = page.getByRole('link', { name: 'Polo' });
    this.brandHAndMLink = page.getByRole('link', { name: 'H&M' });
    this.mainHeading = page.locator('.features_items h2.title');

    // AVALIAÇÕES (REVIEWS)
    this.writeYourReviewHeading = page.getByRole('link', { name: 'Write Your Review' });
    this.reviewNameInput = page.locator('#name');
    this.reviewEmailInput = page.locator('#email');
    this.reviewCommentInput = page.locator('#review');
    this.reviewSubmitButton = page.locator('#button-review');
    this.reviewSuccessAlert = page.locator('#review-section .alert-success');

    // --- SEÇÃO: FOOTER (SUBSCRIPTION) ---
    this.subscriptionHeading = page.locator('.single-widget h2');
    this.subscriptionEmailInput = page.locator('#susbscribe_email');
    this.subscriptionButton = page.locator('#subscribe');
    this.subscriptionSuccessMessage = page.locator('#success-subscribe');

    // --- SEÇÃO: CART PAGE ---
    this.cartContainer = page.locator('#cart_info_table tbody tr');
    this.cartQuantityItems = page.locator('#quantity');
    this.addToCartButton = page.locator('button.cart');
    this.cartDeleteButton = page.locator('.cart_quantity_delete');
    this.emptyCartMessage = page.locator('#empty_cart');

    // --- SEÇÃO: RECOMMENDED ITEMS (HOME) ---
    this.recommendedItemsHeading = page.getByRole('heading', { name: 'recommended items', exact: true });
    this.recommendedProductAddToCart = page.locator('#recommended-item-carousel .add-to-cart').first();

    // --- SEÇÃO: CHECKOUT & PAYMENT ---
    this.proceedToCheckoutBtn = page.locator('a.check_out');
    this.checkoutRegisterLoginBtn = page.locator('#checkoutModal u:has-text("Register / Login")');
    this.addressDeliveryDetails = page.locator('#address_delivery');
    this.checkoutAddressTitle = page.getByRole('heading', { name: 'Address Details' });
    this.addressInvoiceDetails = page.locator('#address_invoice');
    this.orderCommentInput = page.locator('textarea[name="message"]');
    this.placeOrderBtn = page.locator('a[href="/payment"]');
    this.checkoutModalLogin = page.locator('#checkoutModal u:has-text("Register / Login")');
    this.cardNameInput = page.locator('input[name="name_on_card"]');
    this.cardNumberInput = page.locator('input[name="card_number"]');
    this.cardCvcInput = page.locator('input[name="cvc"]');
    this.cardExpMonthInput = page.locator('input[name="expiry_month"]');
    this.cardExpYearInput = page.locator('input[name="expiry_year"]');
    this.payAndConfirmBtn = page.locator('#submit');
    this.orderSuccessMessage = page.locator('.col-sm-9 p');

    // --- SEÇÃO: CATEGORIAS  ---
    this.categoriesSidebar = page.locator('.left-sidebar');
    this.womenCategoryLink = page.locator('a[href="#Women"]');
    this.womenDressSubCategory = page.locator('#Women a[href="/category_products/1"]');
    this.menCategoryLink = page.locator('a[href="#Men"]');
    this.menTshirtsSubCategory = page.getByRole('link', { name: 'Tshirts' });
    this.categoryProductsHeading = page.locator('.features_items h2.title');
    this.kidsCategoryLink = page.locator('a[href="#Kids"]');
    this.kidsDressSubCategory = page.locator('#Kids').getByRole('link', { name: 'Dress' });
    this.womenTopsSubCategory = page.locator('#Women').getByRole('link', { name: 'Tops' });
    this.menJeansSubCategory = page.locator('#Men').getByRole('link', { name: 'Jeans' });

    // --- OUTRAS FUNCIONALIDADES ---
    this.btnScrollUp = page.locator('#scrollUp');
    this.tituloHeader = page .locator('#slider-carousel .item.active') .getByRole('heading', { name: 'Full-Fledged practice website for Automation Engineers' });
    this.sliderCarousel = page.locator('#slider');
  }
}

module.exports = { PageElements };
