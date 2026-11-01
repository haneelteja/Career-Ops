#!/usr/bin/env node
/**
 * Anti-bot ATS-first scanner for Hyderabad Pega BA targets.
 *
 * Strategy:
 * 1. Prefer official careers / ATS URLs (Tier 1) — skip Naukri/Indeed/LinkedIn discovery
 * 2. Use headed Chromium when CAREER_OPS_HEADED=1 or --headed (survives more bot walls)
 * 3. Optional persistent profile: CAREER_OPS_USER_DATA_DIR=~/Library/.../Chrome CareerOps
 * 4. Write markdown report under output/ (gitignored except daily-pega-ba-scan-*.md)
 *
 * Usage:
 *   npm run scan:ats
 *   npm run scan:ats -- --headed
 *   node scripts/scan-ats-first.mjs --out output/daily-pega-ba-scan-2026-11-01.md
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { ROOT, me } from './profile-config.mjs';

const DATE = new Date().toISOString().slice(0, 10);
const args = process.argv.slice(2);
const headed = args.includes('--headed') || process.env.CAREER_OPS_HEADED === '1';
const outArg = args.find((a, i) => args[i - 1] === '--out');
const OUT = outArg || join(ROOT, 'output', `daily-pega-ba-scan-${DATE}.md`);

const PORTALS = [
  { company: 'Eclatprime', url: 'https://eclatprime.com/careers/', keywords: /pega\s*ba|business analyst/i },
  { company: 'Eclatprime JD', url: 'https://eclatprime.com/pega-ba/', keywords: /pega|business analyst/i },
  { company: 'Truviq', url: 'https://truviqsystems.zohorecruit.in/jobs/Careers', keywords: /pega.*business analyst|business analyst/i },
  { company: 'Virtusa Hyd', url: 'https://www.virtusa.com/careers/in/hyderabad', keywords: /pega|business analyst|bsa/i },
  { company: 'Virtusa P-100973', url: 'https://www.virtusa.com/careers/job-search/global/en/job/P-100973/Senior-Consultant', keywords: /pega|senior consultant|appeals|grievance/i },
  { company: 'Credera', url: 'https://credera.com/careers/jobs', keywords: /pega|business architect|business analyst/i },
  { company: 'Areteans', url: 'https://areteanstech.com/job-listing/', keywords: /pega|business analyst/i },
  { company: 'Religent', url: 'https://religentsystems.com/careers/', keywords: /business analyst|pega ba/i },
  { company: 'Tenth Revolution', url: 'https://www.tenthrevolution.com/jobs/?search=pega&location=hyderabad', keywords: /pega|business analyst/i },
  { company: 'Pegasystems Hyd', url: 'https://www.pega.com/about/careers/job-listings?location=India%20-%20Telangana%20-%20Hyderabad', keywords: /business architect|business analyst/i },
  { company: 'Deloitte USI', url: 'https://usijobs.deloitte.com/en_US/careersUSI/SearchJobs/?keyword=Pega&location=Hyderabad', keywords: /pega|business analyst/i },
  { company: 'Lloyds TC', url: 'https://lbg.wd3.myworkdayjobs.com/Lloyds_Technology_Centre?q=pega', keywords: /pega|business analyst|business architect/i },
  { company: 'Wipro', url: 'https://careers.wipro.com/search/?q=pega&locationsearch=Hyderabad', keywords: /pega|business analyst/i },
];

const SKIP_TITLE = /developer|cssa\b|clsa\b|ssa\b|lsa\b|administrator|tester|engineer|release engineer|decisioning/i;
const BA_TITLE = /business analyst|pega ba|pega bsa|business architect|senior consultant/i;

function scoreTitle(title, body) {
  const t = `${title} ${body}`.toLowerCase();
  if (SKIP_TITLE.test(t) && !/business analyst|business architect/.test(t)) {
    return { score: 2.5, verdict: 'skip', reason: 'dev/architect track' };
  }
  if (!/pega|cpba|pcba/.test(t) && !BA_TITLE.test(t)) {
    return { score: 2.0, verdict: 'skip', reason: 'not Pega BA' };
  }
  if (/pega/.test(t) && BA_TITLE.test(t)) {
    let score = 4.0;
    if (/senior|sr\./.test(t)) score += 0.3;
    if (/appeals|grievance|healthcare/.test(t) && !/healthcare/.test((me().summaries?.pega || '').toLowerCase())) {
      score -= 0.5;
      return { score, verdict: 'conditional', reason: 'A&G/healthcare gate — verify CV' };
    }
    return { score: Math.min(score, 4.8), verdict: 'apply', reason: 'Pega BA match' };
  }
  return { score: 3.2, verdict: 'review', reason: 'partial match' };
}

async function checkPortal(browser, portal) {
  const page = await browser.newPage();
  const result = {
    company: portal.company,
    url: portal.url,
    ok: false,
    status: 0,
    titleHits: [],
    notes: '',
    blocked: false,
  };
  try {
    const resp = await page.goto(portal.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    result.status = resp?.status() || 0;
    await page.waitForTimeout(2000);
    const text = (await page.locator('body').innerText().catch(() => '')) || '';
    const lower = text.toLowerCase();
    if (
      result.status === 403 ||
      result.status === 429 ||
      /just a moment|cf-challenge|access denied|enable javascript and cookies|captcha/i.test(lower)
    ) {
      result.blocked = true;
      result.notes = 'Bot wall / challenge — use headed browser + logged-in profile, or check manually';
      return result;
    }
    if (result.status === 404 || /no longer available|no open positions|no job listings found|page not found/i.test(lower)) {
      result.notes = 'Empty or closed';
      result.ok = true;
      return result;
    }
    result.ok = true;
    const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 8 && l.length < 140);
    for (const line of lines) {
      if (!portal.keywords.test(line) && !BA_TITLE.test(line)) continue;
      if (SKIP_TITLE.test(line) && !BA_TITLE.test(line)) continue;
      const scored = scoreTitle(line, text.slice(0, 2000));
      result.titleHits.push({ title: line, ...scored });
    }
    // de-dupe
    const seen = new Set();
    result.titleHits = result.titleHits.filter((h) => {
      const k = h.title.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    }).slice(0, 8);
  } catch (e) {
    result.notes = e.message;
    result.blocked = /Timeout|net::|DNS|ERR_/i.test(e.message);
  } finally {
    await page.close().catch(() => {});
  }
  return result;
}

const launchOpts = { headless: !headed };
const userDataDir = process.env.CAREER_OPS_USER_DATA_DIR;
let browser;
let context;

if (userDataDir) {
  context = await chromium.launchPersistentContext(userDataDir, {
    ...launchOpts,
    channel: process.env.CAREER_OPS_CHROME_CHANNEL || undefined,
  });
  browser = context;
} else {
  browser = await chromium.launch({
    ...launchOpts,
    channel: process.env.CAREER_OPS_CHROME_CHANNEL || undefined,
  });
}

console.log(`ATS-first scan (${headed ? 'headed' : 'headless'}) → ${OUT}`);
const results = [];
for (const portal of PORTALS) {
  process.stdout.write(`  ${portal.company}… `);
  const r = await checkPortal(browser, portal);
  results.push(r);
  console.log(r.blocked ? 'BLOCKED' : r.titleHits.length ? `${r.titleHits.length} hit(s)` : r.notes || 'ok');
}

if (context?.close) await context.close();
else await browser.close();

const live = results.flatMap((r) =>
  r.titleHits
    .filter((h) => h.verdict === 'apply' || h.verdict === 'conditional')
    .map((h) => ({ company: r.company, url: r.url, ...h })),
);
const blocked = results.filter((r) => r.blocked);

let md = `# Daily Pega BA Scan — ${DATE}

### 1. Today's headline
- **${live.length} ATS-verified candidate hit(s)** from official portals (automated ATS-first pass).
- **${blocked.length} portal(s) blocked** by bot walls — re-run with \`npm run scan:ats -- --headed\` and optional \`CAREER_OPS_USER_DATA_DIR\`.
- Candidate: ${me().name || 'Haneel'} · Hyderabad · CPBA/CSSA track

### 2. ATS-verified live roles

| Priority | Company | Role / signal | ATS link | Score | Status | Action |
|---|---|---|---|---:|---|---|
`;

if (!live.length) {
  md += `| — | — | None this run | — | — | — | Warm intros / re-run headed |\n`;
} else {
  live.forEach((h, i) => {
    md += `| ${i + 1} | ${h.company} | ${h.title.replace(/\|/g, '/')} | ${h.url} | ${h.score}/5 | ${h.verdict} | ${h.reason} |\n`;
  });
}

md += `
### 3. Unverified / dropped
- Aggregators (Naukri / Indeed / LinkedIn / GetMeReferred) were **not** used this run (anti-stale policy).
- Developer/SSA/admin hits were auto-excluded.

### 4. Portal results
`;

for (const r of results) {
  md += `- **${r.company}** (${r.status || 'n/a'}): ${r.blocked ? 'BLOCKED — ' : ''}${r.notes || (r.titleHits.length ? r.titleHits.map((h) => h.title).join('; ') : 'no BA hit')}\n`;
}

md += `
### 5. Today's action list
1. Review table above — apply only \`apply\` / \`conditional\` rows after CV truth-check.
2. For BLOCKED portals: \`CAREER_OPS_HEADED=1 CAREER_OPS_USER_DATA_DIR="$HOME/Library/Application Support/CareerOpsChrome" npm run scan:ats\`
3. Commit report on **main** only: \`node scripts/commit-daily-scan.mjs ${OUT}\`

### 6. Scan log
- Method: ATS-first Playwright (${headed ? 'headed' : 'headless'})
- Portals checked: ${results.length}
- Blocked: ${blocked.length}
- Live BA-ish hits: ${live.length}
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, md, 'utf-8');
console.log(`\nWrote ${OUT}`);
