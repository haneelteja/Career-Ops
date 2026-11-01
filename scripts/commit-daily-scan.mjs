#!/usr/bin/env node
/**
 * Commit a daily scan report onto main only — never create a feature branch.
 *
 *   node scripts/commit-daily-scan.mjs output/daily-pega-ba-scan-2026-11-01.md
 *   npm run scan:commit -- output/daily-pega-ba-scan-2026-11-01.md
 */
import { execFileSync } from 'child_process';
import { basename, resolve } from 'path';
import { existsSync } from 'fs';
import { ROOT } from './profile-config.mjs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/commit-daily-scan.mjs output/daily-pega-ba-scan-YYYY-MM-DD.md');
  process.exit(1);
}

const abs = resolve(ROOT, file);
const base = basename(abs);
if (!/^daily-pega-ba-scan-\d{4}-\d{2}-\d{2}\.md$/.test(base)) {
  console.error('Refusing: only daily-pega-ba-scan-YYYY-MM-DD.md may be committed by this script');
  process.exit(1);
}
if (!existsSync(abs)) {
  console.error('Missing file:', abs);
  process.exit(1);
}

function git(...args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf-8' }).trim();
}

const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
if (branch !== 'main') {
  console.error(`Refusing: must be on main (currently on ${branch})`);
  process.exit(1);
}

// Block personal files from ever being staged by mistake
const forbidden = [
  'config/profile.yml',
  'config/secrets.yml',
  'data/contacts.md',
  'data/pipeline.md',
  'data/scan-history.tsv',
  'cv.md',
];
const status = git('status', '--porcelain');
for (const f of forbidden) {
  if (status.split('\n').some((l) => l.includes(f))) {
    console.error(`Refusing: working tree has personal file changes (${f}). Unstage/stash first.`);
    process.exit(1);
  }
}

git('add', abs);
const staged = git('diff', '--cached', '--name-only');
if (!staged) {
  console.log('Nothing to commit (file already on main or unchanged).');
  process.exit(0);
}
if (staged.split('\n').some((l) => l && l !== file.replace(/^\.\//, '') && !l.endsWith(base))) {
  console.error('Refusing: unexpected staged files:\n', staged);
  process.exit(1);
}

const date = base.match(/(\d{4}-\d{2}-\d{2})/)[1];
git('commit', '-m', `Add ${date} daily Pega BA scan report.`);
console.log('Committed on main:', base);
console.log('Push when ready: git push origin main');
