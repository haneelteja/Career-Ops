#!/usr/bin/env node
/** Open Gmail compose for Unico #40 — attach resume manually if not auto-attached. */
import { execSync } from 'child_process';

const resume = process.env.CAREER_OPS_RESUME_PATH;
const to = 'hr@unicoconnect.com';
const subject = encodeURIComponent(
  'Application — Senior Business Analyst — Haneel Teja Nalluru (Hyderabad)'
);
const body = encodeURIComponent(
  `Dear Unico Connect Hiring Team,

I am applying for the Senior Business Analyst role. I have 7+ years in requirements, functional specifications, Agile delivery, and stakeholder leadership (CPBA, CSSA, CSM, PMP). I am Hyderabad-based.

Notice period: 45 days | Current CTC: ₹6,00,000 | Expected CTC: ₹12,00,000

Please find my resume attached.

Best regards,
Haneel Teja Nalluru
+91 9642917777 | nalluruhaneel@gmail.com
https://www.linkedin.com/in/haneel-teja-nalluru-8872b0125`
);

const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
console.log('Opening Gmail compose →', to);
console.log(
  resume
    ? `Attach: ${resume}`
    : 'Attach your fixed resume manually (or set CAREER_OPS_RESUME_PATH)',
);
execSync(`open "${url}"`, { stdio: 'inherit' });
