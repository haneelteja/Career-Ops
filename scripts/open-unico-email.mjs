#!/usr/bin/env node
/** Open Gmail compose for Unico #40 — attach resume manually if not auto-attached. */
import { execSync } from 'child_process';
import { me } from './profile-config.mjs';

const ME = me();
const resume = ME.resumePath;
const inr = (v) => (v ? '₹' + Number(v).toLocaleString('en-IN') : '—');
const to = 'hr@unicoconnect.com';
const subject = encodeURIComponent(
  `Application — Senior Business Analyst — ${ME.name} (${ME.city})`
);
const body = encodeURIComponent(
  `Dear Unico Connect Hiring Team,

I am applying for the Senior Business Analyst role. I have ${ME.experience} in requirements, functional specifications, Agile delivery, and stakeholder leadership (CPBA, CSSA, CSM, PMP). I am ${ME.city}-based.

Notice period: ${ME.noticeDays} days | Current CTC: ${inr(ME.currentCtc)} | Expected CTC: ${inr(ME.expectedCtc)}

Please find my resume attached.

Best regards,
${ME.name}
${[ME.phone, ME.email].filter(Boolean).join(' | ')}
${ME.linkedin}`
);

const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
console.log('Opening Gmail compose →', to);
console.log(
  resume
    ? `Attach: ${resume}`
    : 'Attach your fixed resume manually (or set CAREER_OPS_RESUME_PATH)',
);
execSync(`open "${url}"`, { stdio: 'inherit' });
