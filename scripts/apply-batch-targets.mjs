#!/usr/bin/env node
/**
 * Open fresh apply targets in default browser + optional headed Playwright pause.
 * LinkedIn/Naukri require you to be logged in. You click Submit.
 */
import { chromium } from 'playwright';
import { execSync } from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const resume =
  '/Users/haneelnalluru/Downloads/HaneelTeja_SrBusinessArchitect_Resume.pdf';

const OPEN_IN_BROWSER = [
  {
    label: 'Deloitte USI — search Hyderabad BA',
    url: 'https://usijobs.deloitte.com/en_US/careersUSI/SearchJobs/?listFilterMode=1&location=Hyderabad&keyword=Business%20Analyst',
    playwright: false,
  },
  {
    label: 'LinkedIn Pega Hyderabad (past week)',
    url: 'https://in.linkedin.com/jobs/pega-jobs-hyderabad?f_TPR=r604800',
    playwright: false,
  },
  {
    label: 'Naukri Senior BA Hyderabad',
    url: 'https://www.naukri.com/senior-business-analyst-jobs-in-hyderabad-secunderabad',
    playwright: false,
  },
  {
    label: 'Virtusa Hyderabad careers — warm: Pradeep',
    url: 'https://www.virtusa.com/careers/in/hyderabad',
    playwright: false,
  },
  {
    label: 'Lloyds Technology Centre',
    url: 'https://lbg.wd3.myworkdayjobs.com/Lloyds_Technology_Centre?q=pega',
    playwright: false,
  },
];

const FORM = {
  notice: '45',
  currentCtc: '600000',
  expectedCtc: '1200000',
  location: 'Hyderabad',
};

async function tryFill(page, patterns, value) {
  if (page.isClosed()) return false;
  for (const p of patterns) {
    const loc = typeof p === 'string' ? page.locator(p) : p;
    let count = 0;
    try {
      count = await loc.count();
    } catch {
      return false;
    }
    if (count > 0) {
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

console.log('\n=== Career-Ops apply batch (2026-05-22) ===\n');
console.log('Full list: output/fresh-jobs-2026-05-22.md\n');

for (const t of OPEN_IN_BROWSER) {
  console.log(`• ${t.label}\n  ${t.url}\n`);
  try {
    execSync(`open "${t.url}"`, { stdio: 'ignore' });
  } catch {
    console.log('  (could not open — paste URL manually)\n');
  }
}

const pwTargets = OPEN_IN_BROWSER.filter((t) => t.playwright);
if (!pwTargets.length) process.exit(0);

const browser = await chromium.launch({ headless: false, slowMo: 60 });
const context = await browser.newContext();
const page = await context.newPage();

for (const t of pwTargets) {
  console.log(`\n→ Playwright: ${t.label}`);
  console.log('  Inspector paused — log in, click Easy Apply, then Resume in Playwright.\n');

  try {
    await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.pause();

    if (page.isClosed()) {
      console.log('  Browser closed — skipping prefill for remaining jobs.\n');
      break;
    }

    for (const label of [/easy apply/i, /apply for job/i, /^apply$/i]) {
      const btn = page.getByRole('button', { name: label }).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click().catch(() => {});
        await page.waitForTimeout(2000);
        break;
      }
    }

    await tryFill(page, ['input[name*="notice" i]', page.getByLabel(/notice/i)], FORM.notice);
    await tryFill(
      page,
      ['input[name*="current" i]', page.getByLabel(/current.*ctc/i)],
      FORM.currentCtc,
    );
    await tryFill(
      page,
      ['input[name*="expected" i]', page.getByLabel(/expected.*ctc/i)],
      FORM.expectedCtc,
    );
    await tryFill(page, [page.getByLabel(/location/i), page.getByLabel(/city/i)], FORM.location);

    const fileInput = page.locator('input[type="file"]').first();
    if (!page.isClosed() && (await fileInput.count().catch(() => 0))) {
      await fileInput.setInputFiles(resume).catch(() => {});
      console.log('  ✓ Resume upload attempted');
    }
  } catch (err) {
    console.log(`  ⚠ ${err.message}\n`);
    if (page.isClosed()) break;
  }
}

console.log('\nDone. Submit in browser, then: applied [Company]\n');
if (!page.isClosed()) {
  await page.pause().catch(() => {});
}
await browser.close().catch(() => {});
