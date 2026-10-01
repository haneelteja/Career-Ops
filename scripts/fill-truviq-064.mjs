#!/usr/bin/env node
/** Prefill Truviq #064 — solve CAPTCHA and Submit in browser. */
import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { me } from './profile-config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const ME = me();
const pdf = ME.resumePath || resolve(root, `output/${ME.cvPdfPrefix}-truviq-pega-business-analyst-2026-05-17.pdf`);
const [firstName, ...rest] = ME.name.split(/\s+/);
const lastName = rest.slice(-1)[0] || '';
const years = String(parseInt(ME.experience, 10) || '');
const jobUrl =
  'https://truviqsystems.zohorecruit.in/jobs/Careers/6497000009165211/PEGA-Business-Analyst?source=CareerSite';

async function setField(page, labelPart, value) {
  const label = page.locator('label').filter({ hasText: new RegExp(labelPart, 'i') }).first();
  const container = label.locator('xpath=ancestor::div[1]');
  const box = (await container.count()) ? container : label.locator('..');
  const input = box.locator('input:not([type=file])').first();
  const select = box.locator('select').first();
  try {
    if (await select.count()) {
      await select.selectOption({ label: value }).catch(() => select.selectOption(value));
    } else if (await input.count()) {
      await input.fill(value, { timeout: 8000 });
    } else {
      console.warn('⚠ skip (no control):', labelPart);
      return;
    }
    console.log('✓', labelPart, '→', value);
  } catch (e) {
    console.warn('⚠', labelPart, e.message.split('\n')[0]);
  }
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(jobUrl, { waitUntil: 'networkidle', timeout: 90000 });
await page.getByText("I'm interested").first().click();
await page.waitForTimeout(2500);

const fields = [
  ['First Name', firstName],
  ['Last Name', lastName],
  ['Email', ME.email],
  ['Mobile', ME.phone.replace(/^\+91[\s-]*/, '').replace(/\D/g, '')],
  ['Experience in Years', years],
  ['Relevant Experience', years],
  ['Current Employer', ME.currentCompany],
  ['Serving Notice Period', 'No'],
  ['Notice Period in Months', '0'],
  ['Expected Joining Date', '06/15/2026'],
  ['Current Salary', ME.currentCtc],
  ['Expected Salary', ME.expectedCtc],
  ['Current Location', ME.location],
  ['Preferred Location', ME.location],
  ['City', ME.city],
  ['LinkedIn', ME.linkedin],
];
for (const [label, val] of fields) await setField(page, label, val);

try {
  await page.locator('input[type=file][name*="easyresume"]').setInputFiles(pdf);
  console.log('✓ Resume uploaded');
} catch (e) {
  console.warn('⚠ Resume upload:', e.message);
}

const out = resolve(root, 'output/truviq-zoho-filled-2026-05-17.png');
await page.screenshot({ path: out, fullPage: true });
console.log('\nScreenshot:', out);
console.log('Apply URL:', jobUrl);
console.log('→ Solve CAPTCHA in browser, verify salary/notice fields, then Submit.');
await browser.close();
