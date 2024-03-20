import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:8788/');
});

test('has title', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Traductor/);
});

test.describe('translation', () => {
  test('ask for a translation', async ({ page }) => {
    const newTranslation = page.getByPlaceholder('Enter text to translate');
    await newTranslation.fill('hello');
    await newTranslation.press('Enter');
    
    await page.waitForSelector('img[alt="translate illustration"]');
    await page.waitForSelector('p:has-text("No translations yet")');

    await expect(page.getByTestId('from-lang')).toHaveText('English');
    await expect(page.getByTestId('from-text')).toHaveText('hello');
    await expect(page.getByTestId('to-lang')).toHaveText('Spanish');
    await expect(page.getByTestId('translated-text')).toHaveText('Hola');
  })
  test('should clear text input field when translation is done', async ({ page }) => {
    const newTranslation = page.getByPlaceholder('Enter text to translate');
    await newTranslation.fill('hello');
    await newTranslation.press('Enter');
    await page.waitForSelector('p:has-text("hola")');
    await expect(newTranslation).toHaveText('');
  })
  test('change language', async ({ page }) => {
    const newTranslation = page.getByPlaceholder('Enter text to translate');
    const select = page.locator('select');
    await select.selectOption('fr');
    await newTranslation.fill('hello');
    await newTranslation.press('Enter');
    await page.waitForSelector('p:has-text("bonjour")');

    await expect(page.getByTestId('from-lang')).toHaveText('English');
    await expect(page.getByTestId('from-text')).toHaveText('hello');
    await expect(page.getByTestId('to-lang')).toHaveText('French');
    await expect(page.getByTestId('translated-text')).toHaveText('Bonjour');
  })
})

