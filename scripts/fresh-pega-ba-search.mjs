#!/usr/bin/env node
/**
 * Fresh Pega BA-only search — Hyderabad (ignores prior pipeline for discovery)
 * Usage: node scripts/fresh-pega-ba-search.mjs
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { chromium } from 'playwright';

const DATE = new Date().toISOString().slice(0, 10);
const OUT = `output/fresh-pega-ba-hyderabad-${DATE}.md`;
const JSON_OUT = `output/fresh-pega-ba-hyderabad-${DATE}.json`;

const LI = [
  ['Pega Hyderabad — past week', 'https://in.linkedin.com/jobs/pega-jobs-hyderabad?f_TPR=r604800'],
  ['Pega Hyderabad — past month', 'https://in.linkedin.com/jobs/pega-jobs-hyderabad?f_TPR=r2592000'],
  ['pega business analyst', 'https://in.linkedin.com/jobs/search/?keywords=pega%20business%20analyst&location=Hyderabad%2C%20Telangana%2C%20India&f_TPR=r2592000'],
  ['pega bsa', 'https://in.linkedin.com/jobs/search/?keywords=pega%20bsa&location=Hyderabad%2C%20Telangana%2C%20India&f_TPR=r2592000'],
  ['pega business architect', 'https://in.linkedin.com/jobs/search/?keywords=pega%20business%20architect&location=Hyderabad%2C%20Telangana%2C%20India&f_TPR=r2592000'],
  ['senior business architect pega', 'https://in.linkedin.com/jobs/search/?keywords=senior%20business%20architect%20pega&location=Hyderabad%2C%20Telangana%2C%20India&f_TPR=r2592000'],
  ['pega ba', 'https://in.linkedin.com/jobs/search/?keywords=pega%20ba&location=Hyderabad%2C%20Telangana%2C%20India&f_TPR=r2592000'],
  ['credera pega ba', 'https://in.linkedin.com/jobs/search/?keywords=credera%20pega%20business%20architect&location=Hyderabad%2C%20Telangana%2C%20India&f_TPR=r2592000'],
  ['virtusa pega bsa', 'https://in.linkedin.com/jobs/search/?keywords=virtusa%20pega%20bsa&location=Hyderabad%2C%20Telangana%2C%20India&f_TPR=r2592000'],
  ['truviq pega', 'https://in.linkedin.com/jobs/search/?keywords=truviq%20pega&location=Hyderabad%2C%20Telangana%2C%20India&f_TPR=r2592000'],
  ['instasmart pega', 'https://in.linkedin.com/jobs/search/?keywords=instasmart%20pega&location=Hyderabad%2C%20Telangana%2C%20India&f_TPR=r2592000'],
];

const PAGES = [
  ['Truviq Zoho', 'https://truviqsystems.zohorecruit.in/jobs/Careers'],
  ['Eclatprime PEGA BA', 'https://eclatprime.com/pega-ba/'],
  ['Eclatprime careers', 'https://eclatprime.com/careers/'],
  ['Areteans jobs', 'https://areteanstech.com/job-listing/'],
  ['Indeed Pega BA Hyd', 'https://in.indeed.com/jobs?q=pega+business+analyst&l=Hyderabad%2C+Telangana'],
  ['Indeed Pega BSA Hyd', 'https://in.indeed.com/jobs?q=pega+bsa&l=Hyderabad%2C+Telangana'],
];

function cleanLi(href) {
  try {
    const m = new URL(href, 'https://www.linkedin.com').pathname.match(/\/jobs\/view\/([^/?]+)/);
    if (m) return `https://www.linkedin.com/jobs/view/${m[1]}/`;
  } catch {}
  return href?.split('?')[0];
}

function scorePegaBa(title, snippet = '') {
  const t = `${title} ${snippet}`.toLowerCase();
  const flags = [];
  let score = 3.0;
  let verdict = 'review';
  let track = 'other';

  if (/intern|fresher|trainee/.test(t)) return { score: 1.5, verdict: 'skip', track: 'junior', flags: ['junior'] };

  const pega = /pega|cpba|pcba|pcsba/.test(t);
  const ba = /business analyst|pega ba|pega bsa|business architect|bsa\b/.test(t);
  const seniorBa = /senior business architect|senior business analyst|sr\.?\s*business/.test(t);
  const lead = /\blead\b|lba\b/.test(t) && !/senior business architect/.test(t);
  const dev = /developer|consultant|engineer|administrator|tester|cssa developer/.test(t) && !ba;
  const architect = /system architect|ssa\b|lsa\b|clsa\b|pega architect/.test(t) && !/business architect/.test(t);

  if (pega && ba && !lead && !dev && !architect) {
    track = 'pega_ba';
    score = seniorBa ? 4.5 : 4.0;
    verdict = score >= 4.0 ? 'apply' : 'borderline';
    if (/hyderabad|secunderabad|telangana|greater hyderabad/.test(t)) score += 0.2;
    if (/andhra pradesh/.test(t) && !/hyderabad/.test(t)) { score -= 0.6; flags.push('AP not Hyd'); }
  } else if (pega && seniorBa && !lead) {
    track = 'pega_ba';
    score = 4.5;
    verdict = 'apply';
  } else if (pega && ba && lead) {
    track = 'pega_lead';
    score = 3.2;
    verdict = 'skip';
    flags.push('lead/lba');
  } else if (pega && dev) {
    track = 'pega_dev';
    score = 2.5;
    verdict = 'skip';
    flags.push('dev/consultant');
  } else if (pega && architect) {
    track = 'pega_architect';
    score = 2.5;
    verdict = 'skip';
    flags.push('architect');
  } else if (ba && pega) {
    track = 'pega_ba';
    score = 4.0;
    verdict = 'apply';
  } else if (pega) {
    track = 'pega_other';
    score = 3.0;
    verdict = 'skip';
  } else {
    track = 'non_pega';
    score = 2.0;
    verdict = 'skip';
  }

  return { score: Math.min(5, Math.round(score * 10) / 10), verdict, track, flags };
}

function loadApplied() {
  const applied = new Set();
  if (!existsSync('data/applications.md')) return applied;
  const text = readFileSync('data/applications.md', 'utf-8');
  for (const m of text.matchAll(/\|\s*(\d+)\s*\|[^|]+\|([^|]+)\|([^|]+)\|[^|]+\|\s*(Applied|SKIP|Discarded)/gi)) {
    applied.add(`${m[2].trim().toLowerCase()}::${m[3].trim().toLowerCase()}`);
  }
  return applied;
}

async function scrapeLi(page, label, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  for (let i = 0; i < 4; i++) {
    await page.evaluate(() => window.scrollBy(0, 900));
    await page.waitForTimeout(600);
  }
  return page.evaluate(() => {
    const out = [];
    const seen = new Set();
    document.querySelectorAll('a[href*="/jobs/view/"]').forEach(a => {
      const card = a.closest('li, .base-card');
      const title = (a.querySelector('h3')?.textContent || '').trim();
      const company = card?.querySelector('h4, .base-search-card__subtitle')?.textContent?.trim() || '';
      const location = card?.querySelector('.job-search-card__location, .artdeco-entity-lockup__caption')?.textContent?.trim() || '';
      const href = a.href;
      if (!title || title.length < 4 || seen.has(href)) return;
      seen.add(href);
      const meta = (card?.textContent || '').replace(/\s+/g, ' ').slice(0, 250);
      out.push({ title, company, location, href, meta });
    });
    return out;
  });
}

async function scrapePage(page, label, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3500);
  return page.evaluate((label) => {
    const text = document.body?.innerText || '';
    const jobs = [];
    document.querySelectorAll('a[href]').forEach(a => {
      const t = (a.textContent || '').trim();
      const h = a.href;
      if (t.length < 4) return;
      const blob = (t + ' ' + h).toLowerCase();
      if (/pega.*(business analyst|bsa|business architect)|pega ba|pega bsa/i.test(blob) ||
          /business analyst.*pega|bsa.*pega/i.test(blob)) {
        jobs.push({ title: t.slice(0, 100), url: h, source: label });
      }
    });
    const hasPegaBa = /pega\s*ba|pega business analyst|pega bsa/i.test(text);
    const snippet = text.match(/pega[\s\S]{0,400}/i)?.[0]?.slice(0, 300) || '';
    return { jobs, hasPegaBa, snippet, textLen: text.length };
  }, label);
}

async function main() {
  const applied = loadApplied();
  const jobs = new Map();
  const pageHits = [];
  const errors = [];

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    locale: 'en-IN',
  });

  for (const [label, url] of LI) {
    const page = await ctx.newPage();
    try {
      console.log('LI', label);
      const raw = await scrapeLi(page, label, url);
      for (const j of raw) {
        const u = cleanLi(j.href);
        const s = scorePegaBa(j.title, j.meta + j.location);
        if (s.track !== 'pega_ba') continue; // Pega BA only
        const key = u;
        const prior = applied.has(`${j.company.toLowerCase()}::${j.title.toLowerCase()}`);
        const entry = {
          title: j.title,
          company: j.company,
          location: j.location,
          url: u,
          sources: [label],
          ...s,
          priorApplied: prior,
        };
        if (jobs.has(key)) jobs.get(key).sources.push(label);
        else jobs.set(key, entry);
      }
      console.log(`  raw ${raw.length}, pega_ba kept ${[...jobs.values()].length}`);
    } catch (e) {
      errors.push({ label, error: e.message });
    }
    await page.close();
  }

  for (const [label, url] of PAGES) {
    const page = await ctx.newPage();
    try {
      console.log('PAGE', label);
      const data = await scrapePage(page, label, url);
      pageHits.push({ label, url, ...data });
      for (const j of data.jobs) {
        const s = scorePegaBa(j.title);
        if (s.track !== 'pega_ba' && !data.hasPegaBa) continue;
        const key = j.url;
        if (!jobs.has(key)) {
          jobs.set(key, {
            title: j.title || 'PEGA BA (see page)',
            company: label.split(' ')[0],
            location: 'Hyderabad',
            url: j.url,
            sources: [label],
            ...scorePegaBa(j.title || 'PEGA Business Analyst'),
            priorApplied: false,
          });
        }
      }
      if (data.hasPegaBa && data.jobs.length === 0) {
        const key = url;
        if (!jobs.has(key)) {
          jobs.set(key, {
            title: 'PEGA BA (careers page)',
            company: label.includes('Eclat') ? 'Eclatprime' : label.includes('Truviq') ? 'Truviq' : label,
            location: 'Hyderabad',
            url,
            sources: [label],
            ...scorePegaBa('PEGA Business Analyst Hyderabad'),
            priorApplied: label.includes('Eclat'),
            note: 'Live careers/JD page — apply via company site',
          });
        }
      }
    } catch (e) {
      errors.push({ label, error: e.message });
    }
    await page.close();
  }

  await browser.close();

  const list = [...jobs.values()].sort((a, b) => b.score - a.score);
  const payload = { date: DATE, count: list.length, jobs: list, pageHits, errors };
  writeFileSync(JSON_OUT, JSON.stringify(payload, null, 2));

  let md = `# Fresh Pega BA search — Hyderabad\n\n`;
  md += `**Date:** ${DATE} · **Profile:** Haneel · CPBA+CSSA · 7 yrs · ₹12L expected · Hyderabad\n\n`;
  md += `> Fresh discovery run — includes roles you may have applied to (marked).\n\n`;
  md += `## Pega BA / BSA / Senior Business Architect (Pega)\n\n`;
  if (!list.length) md += `_No Pega BA-titled roles found in automated pass. See company pages + manual Naukri below._\n\n`;
  else {
    md += `| Score | Role | Company | Location | Status | Link |\n`;
    md += `|------:|------|---------|----------|--------|------|\n`;
    for (const j of list) {
      const st = j.priorApplied ? 'Applied before' : j.verdict;
      md += `| ${j.score} | ${j.title.replace(/\|/g, '/')} | ${j.company} | ${j.location || '—'} | ${st} | [Open](${j.url}) |\n`;
    }
    md += '\n';
  }

  md += `## Company pages checked\n\n`;
  for (const p of pageHits) {
    md += `- **${p.label}** — Pega BA signal: ${p.hasPegaBa ? 'yes' : 'no'} · [link](${p.url})\n`;
  }

  if (errors.length) {
    md += `\n## Errors\n`;
    for (const e of errors) md += `- ${e.label}: ${e.error}\n`;
  }

  md += `\n---\nFull JSON: \`${JSON_OUT}\`\n`;
  writeFileSync(OUT, md);
  console.log(`\nWrote ${OUT}`);
  console.log(`Pega BA roles found: ${list.length}`);
  for (const j of list) console.log(` ${j.score} ${j.title} @ ${j.company}`);
}

main().catch(e => { console.error(e); process.exit(1); });
