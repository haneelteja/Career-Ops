#!/usr/bin/env node
/**
 * SDNA Global #52 — Naukri apply helper (headed).
 * Log in when the browser opens, navigate to Apply if needed, then fields are prefilled.
 */
import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const resume =
  '/Users/haneelnalluru/Downloads/HaneelTeja_SrBusinessArchitect_Resume.pdf';
const jobUrl =
  'https://www.naukri.com/job-listings-senior-business-analyst-sdna-global-hyderabad-chennai-bengaluru-3-to-8-years-080426033041';

const FORM = {
  notice: '45',
  currentCtc: '600000',
  expectedCtc: '1200000',
  location: 'Hyderabad',
};

async function tryFill(page, patterns, value) {
  for (const p of patterns) {
    const loc = typeof p === 'string' ? page.locator(p) : p;
    if ((await loc.count()) > 0) {
      try {
        await loc.first().fill(String(value), { timeout: 5000 });
        return true;
      } catch {
        /* next */
      }
    }
  }
  return false;
}

const browser = await chromium.launch({ headless: false, slowMo: 80 });
const context = await browser.newContext();
const page = await context.newPage();

console.log('\n→ Opening Naukri job. Log in, click Apply, then resume in Playwright inspector (Resume).\n');
await page.goto(jobUrl, { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.pause();

// Apply button variants
for (const label of [/apply on naukri/i, /^apply$/i, /quick apply/i]) {
  const btn = page.getByRole('button', { name: label }).first();
  if (await btn.isVisible().catch(() => false)) {
    await btn.click().catch(() => {});
    await page.waitForTimeout(2000);
    break;
  }
}

await tryFill(page, [
  'input[name*="notice" i]',
  'input[placeholder*="notice" i]',
  page.getByLabel(/notice/i),
], FORM.notice);

await tryFill(page, [
  'input[name*="current" i][name*="ctc" i]',
  'input[placeholder*="current" i]',
  page.getByLabel(/current.*ctc/i),
], FORM.currentCtc);

await tryFill(page, [
  'input[name*="expected" i]',
  'input[placeholder*="expected" i]',
  page.getByLabel(/expected.*ctc/i),
], FORM.expectedCtc);

await tryFill(page, [
  'input[name*="location" i]',
  page.getByLabel(/current location/i),
  page.getByLabel(/city/i),
], FORM.location);

const fileInput = page.locator('input[type="file"]').first();
if (await fileInput.count()) {
  await fileInput.setInputFiles(resume);
  console.log('✓ Resume uploaded:', resume);
} else {
  console.log('⚠ Upload resume manually:', resume);
}

const shot = resolve(root, 'output/sdna-naukri-filled-2026-05-17.png');
await page.screenshot({ path: shot, fullPage: true });
console.log('\nScreenshot:', shot);
console.log('Values: notice', FORM.notice, 'days | current', FORM.currentCtc, '| expected', FORM.expectedCtc);
console.log('\nReview and click Submit in the browser. Close the browser when done.');
await page.pause();
await browser.close();
