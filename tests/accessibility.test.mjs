import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

test('marketing page has zero axe violations', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });

  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const results = await new AxeBuilder({ page }).analyze();
  assert.equal(results.violations.length, 0, JSON.stringify(results.violations, null, 2));

  await browser.close();
});

test('login page has zero axe violations', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });

  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const results = await new AxeBuilder({ page }).analyze();
  assert.equal(results.violations.length, 0, JSON.stringify(results.violations, null, 2));

  await browser.close();
});

test('register page has zero axe violations', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle' });

  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const results = await new AxeBuilder({ page }).analyze();
  assert.equal(results.violations.length, 0, JSON.stringify(results.violations, null, 2));

  await browser.close();
});

test('payment page has zero axe violations', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  // Use a demo invoice ID for testing
  await page.goto(`${BASE_URL}/pay/demo_invoice_id`, { waitUntil: 'networkidle' });

  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const results = await new AxeBuilder({ page }).analyze();
  assert.equal(results.violations.length, 0, JSON.stringify(results.violations, null, 2));

  await browser.close();
});

test('checkout success page has zero axe violations', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`${BASE_URL}/pay/demo_invoice_id/success`, { waitUntil: 'networkidle' });

  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const results = await new AxeBuilder({ page }).analyze();
  assert.equal(results.violations.length, 0, JSON.stringify(results.violations, null, 2));

  await browser.close();
});
