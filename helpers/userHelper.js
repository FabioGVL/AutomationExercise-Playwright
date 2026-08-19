import { PageElements } from '../suporte/elementos/pageElements';
import { faker } from '@faker-js/faker';

/**
 * Bloqueia chamadas de rede do Google Ads/Analytics para evitar redirecionamentos e pop-ups.
 * @param {import('@playwright/test').Page} page
 */
export async function bloquearAds(page) {
  await page.route('**/*{google-analytics,googlesyndication,pagead,doubleclick,adservice}*/**', route => route.abort());
}

/**
 * Gera um objeto com a massa de dados dinâmicos para cadastro de usuário.
 */
export function gerarDados() {
  return {
    name: faker.person.firstName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password({ length: 10 }),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    address: faker.location.streetAddress(),
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode(),
    mobileNumber: faker.phone.number(),
  };
}

export class UserHelper {
  constructor(page) {
    this.page = page;
    this.elem = new PageElements(page);
  }

  async fillInitialSignup(name, email) {
    await this.elem.signUpNameInput.fill(name);
    await this.elem.signUpEmailInput.fill(email);
    await this.elem.signUpButton.click();
  }

  /**
   * Realiza o processo completo de cadastro de um novo usuário.
   * @param {Object} userData - Objeto contendo a massa de dados do usuário 
   */
  async registrarNovoUsuario(userData) {
    await this.page.goto('/');
    await this.elem.navSignupLogin.click();
    
    await this.fillInitialSignup(userData.name, userData.email);

    await this.elem.titleMrRadio.check();
    await this.elem.passwordInput.fill(userData.password);
    await this.elem.daysSelect.selectOption('10');
    await this.elem.monthsSelect.selectOption('May');
    await this.elem.yearsSelect.selectOption('1995');

    await this.elem.firstNameInput.fill(userData.firstName || userData.name);
    await this.elem.lastNameInput.fill(userData.lastName || 'Teste');
    await this.elem.addressInput.fill(userData.address || 'Rua de Teste, 123');
    await this.elem.countrySelect.selectOption('United States');
    await this.elem.stateInput.fill(userData.state || 'SP');
    await this.elem.cityInput.fill(userData.city || 'São Paulo');
    await this.elem.zipcodeInput.fill(userData.zipcode || '01000');
    await this.elem.mobileNumberInput.fill(userData.mobileNumber || '11999999999');

    await this.elem.createAccountButton.click();
    await this.elem.continueButton.click();

    return userData;
  }
}