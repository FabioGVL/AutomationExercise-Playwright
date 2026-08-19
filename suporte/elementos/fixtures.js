// suporte/fixtures.js ou suporte/hooks.js
import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/*{google-analytics,googlesyndication,pagead,doubleclick,adservice}*/**', route => {
      route.abort();
    });

    await use(page);
  },
});

export { expect } from '@playwright/test';