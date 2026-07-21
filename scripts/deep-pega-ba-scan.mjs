#!/usr/bin/env node
/**
 * Deep Pega BA market scan — Hyderabad
 * Scrapes LinkedIn (multiple queries), company pages, referral boards.
 * Outputs JSON + markdown for analysis.
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { chromium } from 'playwright';

const DATE = new Date().toISOString().slice(0, 10);
const OUT_JSON = `output/pega-ba-scan-${DATE}.json`;
const OUT_MD = `output/pega-ba-market-analysis-${DATE}.md`;

const LINKEDIN_SOURCES = [
  { label: 'Pega jobs — Hyderabad (past month)', url: 'https://in.linkedin.com/jobs/pega-jobs-hyderabad?f_TPR=r2592000' },
  { label: 'Pega jobs — Hyderabad (no time filter)', url: 'https://in.linkedin.com/jobs/pega-jobs-hyderabad' },
  { label: 'Keyword: pega business analyst', url: 'https://in.linkedin.com/jobs/search/?keywords=pega%20business%20analyst&location=Hyderabad%2C%20Telangana%2C%20India' },
  { label: 'Keyword: pega bsa', url: 'https://in.linkedin.com/jobs/search/?keywords=pega%20bsa&location=Hyderabad%2C%20Telangana%2C%20India&f_TPR=r2592000' },
  { label: 'Keyword: pega business architect', url: 'https://in.linkedin.com/jobs/search/?keywords=pega%20business%20architect&location=Hyderabad%2C%20Telangana%2C%20India&f_TPR=r2592000' },
  { label: 'Keyword: senior business architect pega', url: 'https://in.linkedin.com/jobs/search/?keywords=senior%20business%20architect%20pega&location=Hyderabad%2C%20Telangana%2C%20India&f_TPR=r2592000' },
  { label: 'Company: credera pega', url: 'https://in.linkedin.com/jobs/search/?keywords=credera%20pega&location=Hyderabad%2C%20Telangana%2C%20India&f_TPR=r2592000' },
  { label: 'Company: virtusa pega', url: 'https://in.linkedin.com/jobs/search/?keywords=virtusa%20pega&location=Hyderabad%2C%20Telangana%2C%20India&f_TPR=r2592000' },
  { label: 'Company: areteans pega', url: 'https://in.linkedin.com/jobs/search/?keywords=areteans%20pega&location=Hyderabad%2C%20Telangana%2C%20India&f_TPR=r2592000' },
  { label: 'Company: deloitte pega', url: 'https://in.linkedin.com/jobs/search/?keywords=deloitte%20pega&location=Hyderabad%2C%20Telangana%2C%20India&f_TPR=r2592000' },
];

const COMPANY_PAGES = [
  { company: 'Areteans', url: 'https://areteanstech.com/job-listing/', type: 'html' },
  { company: 'Virtusa', url: 'https://www.virtusa.com/careers/in/hyderabad', type: 'html' },
  { company: 'Truviq', url: 'https://truviqsystems.zohorecruit.in/jobs/Careers', type: 'html' },
  { company: 'Deloitte USI', url: 'https://usijobs.deloitte.com/en_US/careersUSI/SearchJobs/?listFilterMode=1&location=Hyderabad&keyword=pega', type: 'html' },
  { company: 'Deloitte USI BA', url: 'https://usijobs.deloitte.com/en_US/careersUSI/SearchJobs/?listFilterMode=1&location=Hyderabad&keyword=Business%20Analyst', type: 'html' },
  { company: 'Religent', url: 'https://religentsystems.com/career/', type: 'html' },
  { company: 'Instasmart', url: 'http://www.instasmartglobal.com', type: 'html' },
];

function cleanLinkedInUrl(href) {
  try {
    const u = new URL(href, 'https://www.linkedin.com');
    const m = u.pathname.match(/\/jobs\/view\/([^/?]+)/);
    if (m) return `https://www.linkedin.com/jobs/view/${m[1]}/`;
  } catch {}
  return href?.split('?')[0] || href;
}

function loadTrackerUrls() {
  const seen = new Map();
  for (const f of ['data/pipeline.md', 'data/applications.md']) {
    if (!existsSync(f)) continue;
    const text = readFileSync(f, 'utf-8');
    for (const m of text.matchAll(/https?:\/\/[^\s|)"']+/g)) {
      const u = m[0].replace(/[),]+$/, '');
      if (u.includes('linkedin.com/jobs/view')) seen.set(u, 'tracker');
    }
    for (const row of text.matchAll(/\|\s*(\d+)\s*\|[^|]+\|([^|]+)\|([^|]+)\|/g)) {
      // rough company from applications
    }
  }
  return seen;
}

function classifyRole(title, snippet = '') {
  const t = `${title} ${snippet}`.toLowerCase();
  const flags = [];
  let track = 'unknown';
  let fit = 'review';

  if (/intern|fresher|trainee|0-1\s*year/.test(t)) {
    return { track: 'skip', fit: 'skip', score: 1.0, flags: ['junior'] };
  }

  const isPega = /pega|cpba|cssa|pcba|pcsba|prpc/.test(t);
  const isBaTitle = /business analyst|pega ba\b|pega bsa|business architect|bsa\b/.test(t);
  const isLead = /\blead\b|lba\b|lead business/.test(t) && !/senior business analyst/.test(t);
  const isArchitect = /system architect|ssa\b|lsa\b|clsa\b|pega architect|solution architect/.test(t) && !isBaTitle;
  const isDev = /developer|consultant\b|engineer|administrator|devops|rpa developer/.test(t);
  const isDecisioning = /decisioning|cpdc|cdh|nba/.test(t);

  if (isLead && isPega) {
    track = 'pega_lead';
    fit = 'skip';
    flags.push('lead/lba');
  } else if (isArchitect && isPega) {
    track = 'pega_architect';
    fit = 'skip';
    flags.push('architect/ssa');
  } else if (isDev && isPega && !isBaTitle) {
    track = 'pega_dev';
    fit = 'skip';
    flags.push('dev/consultant');
  } else if (isDecisioning) {
    track = 'pega_decisioning';
    fit = 'skip';
    flags.push('decisioning cert');
  } else if (isPega && isBaTitle) {
    track = 'pega_ba';
    if (/senior|sr\.|business architect|cpba|5\+|6\+|7\+/.test(t)) fit = 'strong';
    else if (/2\s*-\s*5|2-5|3\s*-\s*6/.test(t)) fit = 'good'; // still ok at 7yr
    else fit = 'good';
  } else if (isPega) {
    track = 'pega_other';
    fit = 'review';
  } else if (isBaTitle) {
    track = 'generic_ba';
    fit = 'weak';
  } else {
    track = 'other';
    fit = 'skip';
  }

  let score = 3.0;
  if (track === 'pega_ba') {
    score = fit === 'strong' ? 4.5 : 4.0;
    if (isLead) score = 3.0;
    if (/hyderabad|secunderabad|telangana/.test(t)) score += 0.2;
    if (/andhra pradesh/.test(t) && !/hyderabad/.test(t)) score -= 0.5;
  } else if (track === 'pega_lead' || track === 'pega_architect' || track === 'pega_dev') {
    score = 2.5;
  } else if (track === 'pega_decisioning') {
    score = 3.0;
  } else if (track === 'pega_other') {
    score = 3.2;
  }

  return { track, fit, score: Math.min(5, Math.round(score * 10) / 10), flags };
}

async function scrapeLinkedInJobs(page, source) {
  await page.goto(source.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3500);
  // scroll to load more
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(800);
  }
  return page.evaluate(() => {
    const out = [];
    const seen = new Set();
    document.querySelectorAll('a[href*="/jobs/view/"]').forEach(a => {
      const card = a.closest('li, .base-card, .jobs-search__results-list li');
      const title = (a.querySelector('h3, .base-search-card__title')?.textContent || a.textContent || '').trim();
      const company = card?.querySelector('h4, .base-search-card__subtitle, .hidden-nested-link')?.textContent?.trim() || '';
      const location = card?.querySelector('.job-search-card__location, .artdeco-entity-lockup__caption')?.textContent?.trim() || '';
      const meta = card?.textContent?.replace(/\s+/g, ' ').slice(0, 200) || '';
      const href = a.href;
      if (!title || title.length < 4 || seen.has(href)) return;
      seen.add(href);
      out.push({ title, company, location, meta, href });
    });
    return out;
  });
}

async function scrapeCompanyPage(page, source) {
  await page.goto(source.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  return page.evaluate((company) => {
    const text = document.body.innerText || '';
    const links = [];
    document.querySelectorAll('a[href]').forEach(a => {
      const h = a.href;
      const t = (a.textContent || '').trim();
      if (!t || t.length < 5) return;
      const tl = t.toLowerCase();
      const hl = h.toLowerCase();
      if (/pega|business analyst|bsa|business architect|cpba/.test(tl + ' ' + hl)) {
        links.push({ title: t.slice(0, 120), url: h, company });
      }
    });
    const snippets = [];
    const re = /pega[^.\n]{0,120}/gi;
    let m;
    while ((m = re.exec(text)) && snippets.length < 15) {
      snippets.push(m[0].trim().slice(0, 150));
    }
    return { links: links.slice(0, 30), snippets, pageTextLen: text.length };
  }, source.company);
}

async function main() {
  const trackerUrls = loadTrackerUrls();
  const allJobs = new Map();
  const companyIntel = [];
  const errors = [];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    locale: 'en-IN',
    viewport: { width: 1400, height: 900 },
  });
  const page = await context.newPage();

  for (const src of LINKEDIN_SOURCES) {
    try {
      console.log(`LI: ${src.label}`);
      const raw = await scrapeLinkedInJobs(page, src);
      for (const j of raw) {
        const url = cleanLinkedInUrl(j.href);
        const cls = classifyRole(j.title, j.meta);
        const key = url;
        if (!allJobs.has(key)) {
          allJobs.set(key, {
            ...j,
            url,
            sources: [src.label],
            ...cls,
            inTracker: trackerUrls.has(url),
          });
        } else {
          const ex = allJobs.get(key);
          ex.sources.push(src.label);
        }
      }
      console.log(`  ${raw.length} cards`);
    } catch (e) {
      errors.push({ source: src.label, error: e.message });
    }
  }

  for (const cp of COMPANY_PAGES) {
    try {
      console.log(`Co: ${cp.company}`);
      const data = await scrapeCompanyPage(page, cp);
      companyIntel.push({ ...cp, ...data });
      console.log(`  ${data.links.length} links, ${data.snippets.length} snippets`);
    } catch (e) {
      errors.push({ source: cp.company, error: e.message });
      companyIntel.push({ ...cp, links: [], snippets: [], error: e.message });
    }
  }

  // Naukri public search page (may still be empty)
  try {
    const naukriUrls = [
      'https://www.naukri.com/pega-business-analyst-jobs-in-hyderabad-secunderabad',
      'https://www.naukri.com/pega-jobs-in-hyderabad-secunderabad',
      'https://www.naukri.com/senior-business-architect-pega-jobs-in-hyderabad-secunderabad',
    ];
    for (const url of naukriUrls) {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(3000);
      const jobs = await page.evaluate(() => {
        const out = [];
        const seen = new Set();
        document.querySelectorAll('a[href*="job-listings"], .title a, .cust-job-tuple a.title').forEach(a => {
          let href = a.href;
          const title = (a.textContent || '').trim();
          if (!title || title.length < 8 || !href.includes('naukri') || seen.has(href)) return;
          seen.add(href);
          const row = a.closest('.cust-job-tuple, article, .srp-jobtuple');
          const company = row?.querySelector('.comp-name, .comp-dtls-wrap a')?.textContent?.trim() || '';
          out.push({ title, company, href });
        });
        return out.slice(0, 40);
      });
      for (const j of jobs) {
        const cls = classifyRole(j.title);
        const key = j.href.split('?')[0];
        if (!allJobs.has(key)) {
          allJobs.set(key, {
            title: j.title,
            company: j.company,
            location: 'Hyderabad (Naukri)',
            url: key,
            sources: ['Naukri'],
            ...cls,
            inTracker: false,
          });
        }
      }
      console.log(`Naukri ${url.split('/').pop()}: ${jobs.length}`);
    }
  } catch (e) {
    errors.push({ source: 'Naukri', error: e.message });
  }

  await browser.close();

  const jobs = [...allJobs.values()];
  const byTrack = {};
  for (const j of jobs) {
    byTrack[j.track] = byTrack[j.track] || [];
    byTrack[j.track].push(j);
  }
  for (const k of Object.keys(byTrack)) {
    byTrack[k].sort((a, b) => b.score - a.score);
  }

  const payload = { date: DATE, total: jobs.length, byTrack, companyIntel, errors };
  writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2));

  console.log('\nSummary:');
  for (const [k, v] of Object.entries(byTrack)) console.log(`  ${k}: ${v.length}`);
  console.log(`Wrote ${OUT_JSON}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
