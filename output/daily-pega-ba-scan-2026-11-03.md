# Daily Pega BA Scan — 2026-11-03

### 1. Today's headline
- **No new apply.** Official portals did not produce a Hyderabad Pega BA / Senior BA role that clears the bar.
- **Virtusa P-100973 is filled.** The official careers URL now returns HTTP 410 and the page says the job has been filled. Do not apply. This was unverified yesterday.
- Virtusa referral ATS still has **Pega BA CREQ264873** live with an Apply button. It stays a **3.1/5 skip**: 10+ years, a 0–15 day notice window, posted 30 Jul 2026 (over 90 days).

### 2. ATS-verified live roles

| Priority | Company | Role | ATS link | Score | Status | Action |
|---|---|---|---|---:|---|---|
| — | Virtusa | Pega BA — CREQ264873 | [Official Virtusa referral ATS](https://virtusapolaris.referrals.selectminds.com/jobs/pega-ba-79738) | 3.1/5 | Live, Apply button present, posted 2026-07-30 | Skip |

Scoring for CREQ264873: 4.0 base (Pega BA JD: user stories, backlog, DCO, Pega certification required) +0.2 Hyderabad JD line −0.3 age over 90 days = 3.9, then held to 3.1 because the 10+ year bar and 0–15 day notice window miss the configured profile. The board category is "Architect (Level: Manager)" while the JD itself is BA work. The ATS geo string says "Hyderabad, Andhra Pradesh"; the JD location line says Hyderabad, so this is not an Andhra-only posting. Compensation is undisclosed. `config/profile.yml` is not in this checkout, so the compensation floor was not re-read today.

### 3. Unverified / dropped
- **Virtusa P-100973** ([main careers URL](https://www.virtusa.com/careers/job-search/global/en/job/P-100973/Senior-Consultant)): HTTP 410. Page text: "the job you are trying to apply for has been filled." Same message on the apex host. Not in today's 23-result Pega search on the referral board. **Closed — do not apply.** `careers.virtusa.com` still redirects to a Taleo page that says the career section is unavailable. `virtusa.com/careers/in/hyderabad` renders an in-page 404.
- **Virtusa referral board, other Pega hits (23 results, all skip):** Hyderabad Pega Constellations, Pega SSA, Pega SSA Constellation, Pega Support, Pega Developer, Pega Constellation, Senior Software Engineer, Pega Project Manager, Playwright Consultant; plus Chennai/Canada/US/Gurgaon LSA, SSA, and developer roles. **Pega Business Analyst in Dubai**, **Business Analyst - LOS in Dubai**, and **Architect (ATC) in Bangalore** (snippet says Senior Pega Business Analyst) are outside Hyderabad.
- **Deloitte USI** keyword Pega: 5 jobs, all engineer or support. Hyderabad hits include Senior Software Engineer, GESTC (Pega, .NET & Integration), a .NET workflow engineer, and a GESTC support consultant. No BA.
- **Accenture India** relevancy search "Pega Business Analyst": the only Business Analyst card is Bengaluru, 5–10 years, required skill Pega Platform. Hyderabad cards on that page are Custom Software Engineer (2–5 years, Pega Platform). Outside the Hyderabad-only rule. No Hyderabad BA title.
- **Lloyds Technology Centre** Workday search "Pega": 1 job, Lead Software Engineer, Hyderabad Knowledge Park, posted 30+ days ago. Not a BA.
- **Sutherland** job-results keyword Pega: 1 position, Forward Deployed Engineer, Bucharest, posted 16 Oct 2026. Not India and not a BA. The India city list shows 22 Hyderabad jobs with no keyword; none survived the Pega keyword.
- **Wipro** official search Pega + Hyderabad: "No jobs found."
- **Cognizant** Hyderabad + Pega: 0 matching jobs.
- **Capgemini** official search Pega + Hyderabad: no open positions matching that query.
- **LTM** `careers.ltm.com` search Pega + Hyderabad: no open positions. `careers.ltimindtree.com` does not resolve.
- **Infosys** India careers search after a Pega keyword submit: the page said "0 jobs found." No Pega title was listed.
- **Pegasystems** Hyderabad location filter: 14 results. Titles are Senior System Architect, System Architect, Senior Applications Engineer, Application Engineer (CSA/CSSA), Senior Manager Consulting, Senior Manager Solutions Consulting, Associate Project Delivery Leader, and payroll roles. No Business Analyst or Business Architect.
- **Truviq:** the prior PEGA Business Analyst Zoho URL still says the posting is no longer available. Open Pega roles are CSSA, CLSA, Decisioning, and Constellation (Hyderabad), plus a US LBA. No India BA.
- **Religent:** live roles are Pega Developer, Pega Administrator, CSSA, CLSA, and related engineering titles. No BA.
- **Credera:** "No open positions found."
- **Tenth Revolution** Pega + Hyderabad: "No job listings found."
- **Eclatprime** `/careers/` and `/pega-ba/`: both HTTP 404.
- **Instasmart** Zoho Recruit: "Page does not exist."
- **Areteans** `/job-listing/` now redirects to the Credera homepage. No separate job board rendered.
- **Perficient** careers page hit a Vercel security checkpoint. Not a confirmed zero.
- **ArcelorMittal** `careers.arcelormittal.com`: DNS does not resolve. The corporate careers URL stopped on a Cloudflare check. Unreachable, not a confirmed zero.

### 4. Pipeline updates
- This checkout has no `data/pipeline.md` or `data/contacts.md`. Comparison is against the last committed scan, 2026-11-02.
- **Virtusa P-100973:** status change — **newly closed**. Yesterday the URL was Access Denied and the role was marked unverified. Today the same URL is HTTP 410 and the careers page says the job has been filled. It is also absent from the referral-board Pega results. Do not force apply. The A&G thread is moot unless a replacement req opens.
- **Virtusa CREQ264873:** unchanged — still live, still a 3.1/5 skip. Posted 30 Jul 2026, still over 90 days.
- **#73 Eclatprime PEGA BA:** unchanged — unverified/removed. Both URLs still 404.
- **#064 Truviq PEGA BA:** unchanged — closed. Official Zoho page is still the unavailable posting.
- **#063 Virtusa creq254918:** not among today's 23 Pega referral-board results.
- No eligible Hyderabad Pega BA was found on Deloitte USI, Lloyds, Sutherland, Truviq, Credera, Religent, Tenth Revolution, Pegasystems, Cognizant, LTIMindtree/LTM, Accenture, Wipro, Infosys, or Capgemini.
- Portal caveats, not confirmed zeroes: Perficient bot wall, ArcelorMittal DNS/Cloudflare, Eclatprime 404, Instasmart portal gone, Areteans board redirected to Credera with no openings listed.

### 5. Today's action list
1. **Do not apply today.** Nothing ATS-verified clears a 4.0.
2. **Pradeep — close the P-100973 thread:** "Hi Pradeep — Virtusa P-100973 now shows as filled on the public careers page (the posting says the job has been filled). I will not apply. If a replacement Hyderabad Pega BA req opens, the A&G/healthcare line and whether comp clears my floor are still the two gates."
3. **CREQ264873:** leave it. 10+ years, 0–15 day notice, posted 30 Jul 2026.
4. **Warm follow-up from the local contact map** (it was not in this checkout): Eclatprime, Deloitte USI, Lloyds, and Sutherland showed no Hyderabad Pega BA on the official board. A short "any Hyderabad Pega BA this week?" note is the useful ask. Do not apply from LinkedIn or Naukri copies.
5. **Tracker:** keep #064 closed, #73 unverified/removed, and #063 closed. Mark P-100973 closed/filled as of 2026-11-03. No new Applied row.

### 6. Scan log
- Checked official company portals for the preferred set and Pega partners (Workday, Zoho, SelectMinds, SuccessFactors search, Infosys careers, Accenture job search, Pega.com location filter).
- Eligible live Pega BA roles in Hyderabad: 1 (CREQ264873, skip). Net-new apply recommendations: 0.
- P-100973 moved from unverified (2026-11-02) to closed/filled (2026-11-03).
