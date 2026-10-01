/**
 * Personal values for the custom scripts in scripts/.
 *
 * Everything personal (name, phone, CTC, CV summaries) lives in
 * config/profile.yml, which is gitignored, so none of it gets committed.
 * See scripts/README.md for the keys these scripts read.
 */
import { existsSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { load as loadYaml } from 'js-yaml';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PROFILE_PATH = resolve(ROOT, 'config', 'profile.yml');

let cached;

export function loadProfile() {
  if (cached) return cached;
  if (!existsSync(PROFILE_PATH)) {
    console.warn('⚠ config/profile.yml not found — personal fields will be blank. See scripts/README.md.');
    cached = {};
    return cached;
  }
  cached = loadYaml(readFileSync(PROFILE_PATH, 'utf-8')) || {};
  return cached;
}

/** Flattened view of the fields the apply helpers and dashboard need. */
export function me() {
  const p = loadProfile();
  const c = p.candidate || {};
  const comp = p.compensation || {};
  const d = p.dashboard || {};
  const name = c.full_name || '';
  return {
    name,
    email: c.email || '',
    phone: c.phone || '',
    linkedin: c.linkedin || '',
    location: c.location || '',
    city: d.city || (c.location || '').split(',')[0].trim(),
    experience: d.experience || '',
    currentCompany: d.current_company || '',
    currentTitle: d.current_title || '',
    workAuthorization: d.work_authorization || '',
    currentCtc: comp.current_ctc != null ? String(comp.current_ctc) : '',
    expectedCtc: comp.expected_ctc != null ? String(comp.expected_ctc) : '',
    expectedCtcLabel: d.expected_ctc_label || comp.target_range || '',
    noticeDays: p.cover_letter?.notice_period_days != null ? String(p.cover_letter.notice_period_days) : '',
    salaryScript: d.salary_script || '',
    summaries: d.summaries || {},
    coverLetter: d.cover_letter || {},
    atsKeywords: d.ats_keywords || '',
    cvPdfPrefix: d.cv_pdf_prefix || (name ? 'cv-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'cv'),
    resumePath: process.env.CAREER_OPS_RESUME_PATH || d.resume_path || '',
  };
}
