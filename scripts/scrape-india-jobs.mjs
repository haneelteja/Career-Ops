#!/usr/bin/env node
/**
 * Fresh India job scrape — Pega-specific + generic BA (Hyderabad focus)
 * Usage: node scripts/scrape-india-jobs.mjs
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { chromium } from 'playwright';

const DATE = new Date().toISOString().slice(0, 10);
const OUT = `output/fresh-jobs-${DATE}.md`;

const SOURCES = [
  {
    id: 'linkedin-pega-hyd',
    category: 'pega',
    label: 'LinkedIn — Pega jobs (Hyderabad, past week)',
    url: 'https://in.linkedin.com/jobs/pega-jobs-hyderabad?f_TPR=r604800',
  },
  {
    id: 'linkedin-pega-hyd-month',
    category: 'pega',
    label: 'LinkedIn — Pega jobs (Hyderabad, past month)',
    url: 'https://in.linkedin.com/jobs/pega-jobs-hyderabad?f_TPR=r2592000',
  },
  {
    id: 'linkedin-search-pega',
    category: 'pega',
    label: 'LinkedIn — keyword Pega (Hyderabad, past month)',
    url: 'https://in.linkedin.com/jobs/search/?keywords=pega&location=Hyderabad%2C%20Telangana%2C%20India&f_TPR=r2592000',
  },
  {
    id: 'linkedin-search-pega-ba',
    category: 'pega',
    label: 'LinkedIn — keyword Pega Business Analyst (Hyderabad, past month)',
    url: 'https://in.linkedin.com/jobs/search/?keywords=pega%20business%20analyst&location=Hyderabad%2C%20Telangana%2C%20India&f_TPR=r2592000',
  },
  {
    id: 'linkedin-search-pega-bsa',
    category: 'pega',
    label: 'LinkedIn — keyword Pega BSA (Hyderabad, past month)',
    url: 'https://in.linkedin.com/jobs/search/?keywords=pega%20bsa&location=Hyderabad%2C%20Telangana%2C%20India&f_TPR=r2592000',
  },
  {
    id: 'linkedin-sr-ba-hyd',
    category: 'generic_ba',
    label: 'LinkedIn — Senior Business Analyst (Hyderabad)',
    url: 'https://in.linkedin.com/jobs/senior-business-analyst-jobs-hyderabad?f_TPR=r604800',
  },
  {
    id: 'linkedin-ba-hyd',
    category: 'generic_ba',
    label: 'LinkedIn — Business Analyst (Hyderabad)',
    url: 'https://in.linkedin.com/jobs/business-analyst-jobs-hyderabad?f_TPR=r604800',
  },
  {
    id: 'naukri-pega-ba',
    category: 'pega',
    label: 'Naukri — Pega Business Analyst (Hyderabad)',
    url: 'https://www.naukri.com/pega-business-analyst-jobs-in-hyderabad-secunderabad',
  },
  {
    id: 'naukri-pega-arch',
    category: 'pega',
    label: 'Naukri — Pega Business Architect',
    url: 'https://www.naukri.com/pega-business-architect-jobs-in-hyderabad-secunderabad',
  },
  {
    id: 'naukri-sr-ba',
    category: 'generic_ba',
    label: 'Naukri — Senior Business Analyst (Hyderabad)',
    url: 'https://www.naukri.com/senior-business-analyst-jobs-in-hyderabad-secunderabad',
  },
];

const NEGATIVE = [
  'intern', 'junior', 'trainee', 'fresher', '0-1 year', '0 - 1',
  'lead system architect', 'lsa', 'clsa', 'senior system architect', 'ssa',
  'pega developer', 'pega admin', 'software engineer', 'scrum master only',
  'quality engineer', 'test engineer', 'devops', 'data engineer',
  'sap ', 'salesforce admin', 'mainframe',
];

const PEGA_POSITIVE = ['pega', 'cpba', 'cssa', 'bsa', 'business architect', 'pega ba'];
const BA_POSITIVE = ['business analyst', 'senior business analyst', 'business architect', 'product owner', 'technical project manager'];

function cleanUrl(href) {
  if (!href) return '';
  try {
    const u = new URL(href, 'https://in.linkedin.com');
    if (u.hostname.includes('linkedin.com') && u.pathname.includes('/jobs/view/')) {
      const m = u.pathname.match(/\/jobs\/view\/([^/?]+)/);
      if (m) return `https://www.linkedin.com/jobs/view/${m[1]}/`;
    }
    if (u.hostname.includes('naukri.com')) {
      return u.origin + u.pathname;
    }
    return u.href.split('?')[0];
  } catch {
    return href;
  }
}

function classify(title, sourceCategory) {
  const t = title.toLowerCase();
  const bad = NEGATIVE.some(n => t.includes(n));
  if (bad) return { bucket: 'skip', reason: 'title filter' };

  const isPega = PEGA_POSITIVE.some(p => t.includes(p));
  const isBa = BA_POSITIVE.some(p => t.includes(p));

  if (isPega && (t.includes('business analyst') || t.includes('bsa') || t.includes('business architect') || t.includes('pega ba'))) {
    return { bucket: 'pega_ba', reason: 'Pega BA/BSA/BA' };
  }
  if (isPega && (t.includes('lead') || t.includes('lba') || t.includes('architect') && !t.includes('business analyst'))) {
    return { bucket: 'pega_other', reason: 'Pega but architect/dev — review' };
  }
  if (isPega) return { bucket: 'pega_other', reason: 'Pega-related' };

  if (sourceCategory === 'pega' && t.includes('pega')) {
    return { bucket: 'pega_other', reason: 'from Pega search' };
  }

  if (isBa && !t.includes('lead business')) {
    return { bucket: 'generic_ba', reason: 'BA match' };
  }
  if (t.includes('lead business analyst') || t.includes('lead ba')) {
    return { bucket: 'skip', reason: 'Lead BA — above target' };
  }

  return { bucket: 'skip', reason: 'no match' };
}

async function scrapeLinkedIn(page, source) {
  await page.goto(source.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2500);

  const jobs = await page.evaluate(() => {
    const out = [];
    const cards = document.querySelectorAll('.job-search-card, .base-card, li[data-occludable-job-id]');
    const seen = new Set();

    const add = (title, company, location, href) => {
      const t = (title || '').trim();
      const u = href || '';
      if (!t || t.length < 5 || seen.has(u)) return;
      seen.add(u);
      out.push({
        title: t,
        company: (company || '').trim(),
        location: (location || '').trim(),
        url: u,
      });
    };

    document.querySelectorAll('a[href*="/jobs/view/"]').forEach(a => {
      const card = a.closest('li, .base-card, .job-search-card');
      const title = a.querySelector('h3, .base-search-card__title')?.textContent || a.textContent;
      const company = card?.querySelector('.base-search-card__subtitle, h4, .hidden-nested-link')?.textContent;
      const loc = card?.querySelector('.job-search-card__location, .artdeco-entity-lockup__caption')?.textContent;
      add(title, company, loc, a.href);
    });

    if (out.length === 0) {
      document.querySelectorAll('h3.base-search-card__title, h3').forEach(h3 => {
        const link = h3.closest('a') || h3.parentElement?.querySelector('a[href*="/jobs/view/"]');
        if (link) add(h3.textContent, '', '', link.href);
      });
    }
    return out.slice(0, 40);
  });

  return jobs.map(j => ({ ...j, url: cleanUrl(j.url), source: source.label }));
}

async function scrapeNaukri(page, source) {
  await page.goto(source.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(3000);

  const jobs = await page.evaluate(() => {
    const out = [];
    const seen = new Set();
    document.querySelectorAll('a[href*="job-listings"], a.title, .cust-job-tuple .title').forEach(a => {
      let href = a.href || a.getAttribute('href');
      if (!href || !href.includes('naukri.com')) return;
      if (!href.startsWith('http')) href = 'https://www.naukri.com' + href;
      const title = (a.textContent || a.getAttribute('title') || '').trim();
      if (!title || title.length < 8 || seen.has(href)) return;
      seen.add(href);
      const row = a.closest('.cust-job-tuple, .srp-jobtuple, article');
      const company = row?.querySelector('.comp-name, .companyInfo .empname')?.textContent?.trim() || '';
      const exp = row?.querySelector('.expwdth, .experience')?.textContent?.trim() || '';
      out.push({ title, company, location: exp, url: href });
    });
    return out.slice(0, 35);
  });

  return jobs.map(j => ({ ...j, url: cleanUrl(j.url), source: source.label }));
}

function loadSeenUrls() {
  const seen = new Set();
  for (const f of ['data/pipeline.md', 'data/applications.md', 'data/scan-history.tsv']) {
    if (!existsSync(f)) continue;
    const text = readFileSync(f, 'utf-8');
    for (const m of text.matchAll(/https?:\/\/[^\s|)"']+/g)) seen.add(m[0].replace(/[),]+$/, ''));
  }
  return seen;
}

async function main() {
  const seen = loadSeenUrls();
  const all = { pega_ba: [], pega_other: [], generic_ba: [], skip: [] };
  const errors = [];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-IN',
  });
  const page = await context.newPage();

  for (const source of SOURCES) {
    try {
      console.log(`Scraping: ${source.label}...`);
      const raw = source.url.includes('naukri.com')
        ? await scrapeNaukri(page, source)
        : await scrapeLinkedIn(page, source);

      for (const job of raw) {
        const { bucket, reason } = classify(job.title, source.category);
        const dup = seen.has(job.url);
        const entry = { ...job, bucket, reason, duplicate: dup };
        if (!all[bucket]) all[bucket] = [];
        all[bucket].push(entry);
        if (job.url) seen.add(job.url);
      }
      console.log(`  → ${raw.length} raw listings`);
    } catch (e) {
      errors.push({ source: source.label, error: e.message });
      console.error(`  ✗ ${e.message}`);
    }
  }

  await browser.close();

  const dedupe = (arr) => {
    const m = new Map();
    for (const j of arr) {
      const k = j.url || `${j.company}::${j.title}`;
      if (!m.has(k)) m.set(k, j);
    }
    return [...m.values()];
  };

  all.pega_ba = dedupe(all.pega_ba).filter(j => !j.duplicate);
  all.generic_ba = dedupe(all.generic_ba).filter(j => !j.duplicate);
  all.pega_other = dedupe(all.pega_other).filter(j => !j.duplicate).slice(0, 15);

  const md = formatReport(all, errors, DATE);
  writeFileSync(OUT, md, 'utf-8');
  console.log(`\nWrote ${OUT}`);
  console.log(`Pega BA/BSA: ${all.pega_ba.length} new | Generic BA: ${all.generic_ba.length} new | Pega other: ${all.pega_other.length}`);
}

function formatReport(all, errors, date) {
  const row = (j) => `| ${j.title.replace(/\|/g, '/')} | ${j.company || '—'} | ${j.location || '—'} | [Apply](${j.url}) | ${j.source} |`;

  let s = `# Fresh job scrape — ${date}\n\n`;
  s += `**Profile:** Haneel · CPBA+CSSA · 7 yrs · Hyderabad · Senior BA / Pega BA · ₹12L expected\n\n`;
  s += `**Resume:** use the fixed resume configured by \`CAREER_OPS_RESUME_PATH\`\n\n`;

  s += `## Pega BA / BSA / Business Architect (apply first)\n\n`;
  if (all.pega_ba.length === 0) s += `_No new Pega BA listings after dedup — check LinkedIn/Naukri search links below._\n\n`;
  else {
    s += `| Role | Company | Location/Exp | Link | Source |\n|------|---------|--------------|------|--------|\n`;
    s += all.pega_ba.map(row).join('\n') + '\n\n';
  }

  s += `## Generic Senior BA (no Pega in title — read JD)\n\n`;
  if (all.generic_ba.length === 0) s += `_None new after dedup._\n\n`;
  else {
    s += `| Role | Company | Location/Exp | Link | Source |\n|------|---------|--------------|------|--------|\n`;
    s += all.generic_ba.slice(0, 25).map(row).join('\n') + '\n\n';
  }

  s += `## Pega-related (architect/dev — usually skip)\n\n`;
  if (all.pega_other.length === 0) s += `_None listed._\n\n`;
  else {
    s += `| Role | Company | Link | Note |\n|------|---------|------|------|\n`;
    s += all.pega_other.map(j => `| ${j.title} | ${j.company || '—'} | [View](${j.url}) | ${j.reason} |`).join('\n') + '\n\n';
  }

  s += `## Live search hubs (refresh daily)\n\n`;
  s += `- [LinkedIn Pega — Hyderabad — past week](https://in.linkedin.com/jobs/pega-jobs-hyderabad?f_TPR=r604800)\n`;
  s += `- [LinkedIn Senior BA — Hyderabad](https://in.linkedin.com/jobs/senior-business-analyst-jobs-hyderabad?f_TPR=r604800)\n`;
  s += `- [Naukri Pega BA — Hyderabad](https://www.naukri.com/pega-business-analyst-jobs-in-hyderabad-secunderabad)\n`;
  s += `- [Naukri Senior BA — Hyderabad](https://www.naukri.com/senior-business-analyst-jobs-in-hyderabad-secunderabad)\n`;
  s += `- [Deloitte USI — BA Hyderabad](https://usijobs.deloitte.com/en_US/careersUSI/SearchJobs/?listFilterMode=1&location=Hyderabad&keyword=Business%20Analyst)\n`;
  s += `- [Areteans jobs](https://areteanstech.com/job-listing/)\n`;
  s += `- [Virtusa Hyderabad](https://www.virtusa.com/careers/in/hyderabad) — warm: Pradeep\n\n`;

  if (errors.length) {
    s += `## Scrape errors\n\n`;
    for (const e of errors) s += `- ${e.source}: ${e.error}\n`;
  }

  s += `\n---\nAfter apply: reply **\`applied [Company]\`** to update tracker.\n`;
  return s;
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
