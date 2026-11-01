#!/usr/bin/env node
/**
 * Generic apply helper — replaces one-off fill scripts for most ATS forms.
 *
 * Usage:
 *   node scripts/apply-url.mjs "https://company.ats.com/jobs/123"
 *   node scripts/apply-url.mjs --headed "https://..."
 *   CAREER_OPS_RESUME_PATH=/path/to.pdf node scripts/apply-url.mjs "https://..."
 *
 * Prefills common fields from config/profile.yml. YOU click Submit.
 * Never auto-submits unless you pass --submit AND profile allows it
 * (application.auto_submit_after_verification) AND you type CONFIRM.
 */
import { chromium } from 'playwright';
import { existsSync } from 'fs';
import { loadProfile, me } from './profile-config.mjs';

const args = process.argv.slice(2);
const headed = args.includes('--headed') || !args.includes('--headless');
const wantSubmit = args.includes('--submit');
const url = args.find((a) => a.startsWith('http'));

if (!url) {
  console.error('Usage: node scripts/apply-url.mjs [--headed] [--submit] <apply-url>');
  process.exit(1);
}

const profile = loadProfile();
const M = me();
const resume = M.resumePath;
const canAuto =
  profile?.application?.auto_submit_after_verification === true &&
  profile?.application?.require_explicit_confirm !== true;

async function fillFirst(page, selectors, value) {
  if (value == null || value === '') return false;
  for (const sel of selectors) {
    try {
      const loc = page.locator(sel);
      if ((await loc.count()) === 0) continue;
      const el = loc.first();
      await el.waitFor({ state: 'visible', timeout: 2500 });
      await el.fill(String(value), { timeout: 4000 });
      return true;
    } catch {
      /* try next */
    }
  }
  return false;
}

async function maybeUpload(page) {
  if (!resume || !existsSync(resume)) {
    console.log('⚠ No resume path — set dashboard.resume_path or CAREER_OPS_RESUME_PATH');
    return false;
  }
  const inputs = page.locator('input[type="file"]');
  const n = await inputs.count();
  if (!n) return false;
  try {
    await inputs.first().setInputFiles(resume);
    console.log('✓ Resume attached:', resume);
    return true;
  } catch (e) {
    console.log('⚠ Resume upload failed:', e.message);
    return false;
  }
}

const browser = await chromium.launch({
  headless: !headed,
  channel: process.env.CAREER_OPS_CHROME_CHANNEL || undefined,
});

const userData = process.env.CAREER_OPS_BROWSER_PROFILE;
const context = userData
  ? await browser.newContext({
      storageState: existsSync(userData) ? userData : undefined,
    })
  : await browser.newContext();

const page = await context.newPage();
console.log('\nOpening', url);
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(1500);

const filled = [];
const attempts = [
  [['input[name*="first" i]', 'input[id*="first" i]', 'input[autocomplete="given-name"]'], M.name.split(/\s+/)[0], 'first_name'],
  [['input[name*="last" i]', 'input[id*="last" i]', 'input[autocomplete="family-name"]'], M.name.split(/\s+/).slice(1).join(' '), 'last_name'],
  [['input[name*="full" i]', 'input[name="name" i]', 'input[autocomplete="name"]'], M.name, 'full_name'],
  [['input[type="email"]', 'input[name*="email" i]', 'input[autocomplete="email"]'], M.email, 'email'],
  [['input[type="tel"]', 'input[name*="phone" i]', 'input[autocomplete="tel"]'], M.phone, 'phone'],
  [['input[name*="location" i]', 'input[name*="city" i]', 'input[autocomplete="address-level2"]'], M.city || M.location, 'location'],
  [['input[name*="notice" i]', 'input[id*="notice" i]'], M.noticeDays, 'notice'],
  [['input[name*="current" i][name*="ctc" i]', 'input[name*="current" i][name*="salary" i]'], M.currentCtc, 'current_ctc'],
  [['input[name*="expected" i]', 'input[name*="expect" i][name*="ctc" i]'], M.expectedCtc, 'expected_ctc'],
  [['input[name*="linkedin" i]', 'input[id*="linkedin" i]'], M.linkedin, 'linkedin'],
];

for (const [sels, value, key] of attempts) {
  if (await fillFirst(page, sels, value)) filled.push(key);
}

await maybeUpload(page);

console.log('\nPrefill summary:', filled.length ? filled.join(', ') : '(no standard fields found — fill manually)');
console.log('Profile:', M.name, '|', M.email, '| notice', M.noticeDays, 'd | expected', M.expectedCtc);

if (wantSubmit && canAuto) {
  console.log('\n--submit requested but require_explicit_confirm / policy blocks silent submit.');
  console.log('Type CONFIRM in the headed window workflow yourself, or click Submit.');
} else if (wantSubmit) {
  console.log('\n--submit ignored: enable application.auto_submit_after_verification and turn off require_explicit_confirm only if you intend unattended submits.');
}

if (headed) {
  console.log('\nBrowser left open — review fields, then click Submit yourself.');
  console.log('Press Ctrl+C in this terminal when done.\n');
  await new Promise(() => {});
} else {
  await browser.close();
}
