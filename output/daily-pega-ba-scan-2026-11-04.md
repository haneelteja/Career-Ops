# Daily Pega BA Scan — 2026-11-04

### 1. Today's headline
- **No new apply.** Official portals did not produce a Hyderabad Pega BA / Senior BA role that clears the bar.
- Virtusa referral ATS still has **Pega BA CREQ264873** live with an Apply button. It stays a **3.1/5 skip**: 10+ years, a 0–15 day notice window, posted 30 Jul 2026 (over 90 days).
- **P-100973 could not be re-read.** The official careers URL returns Akamai Access Denied today. The last successful read (2026-11-03) said the job has been filled, and it is still absent from the referral-board Pega results. Do not apply.

### 2. ATS-verified live roles

| Priority | Company | Role | ATS link | Score | Status | Action |
|---|---|---|---|---:|---|---|
| — | Virtusa | Pega BA — CREQ264873 | [Official Virtusa referral ATS](https://virtusapolaris.referrals.selectminds.com/jobs/pega-ba-79738) | 3.1/5 | Live, Apply button present, posted 2026-07-30 | Skip |

Scoring for CREQ264873 is unchanged: 4.0 base (Pega BA JD: user stories, backlog, DCO, Pega certification required) +0.2 Hyderabad JD line −0.3 age over 90 days = 3.9, then held to 3.1 because the 10+ year bar and 0–15 day notice window miss the configured profile. The board category is "Architect (Level: Manager)" while the JD itself is BA work. The ATS geo string says "Hyderabad, Andhra Pradesh"; the JD location line says Hyderabad, so this is not an Andhra-only posting. Compensation is undisclosed. The profile file is not in this checkout; the experience band, notice period, and compensation floor were applied without copying those values here.

### 3. Unverified / dropped
- **Virtusa P-100973** ([main careers URL](https://www.virtusa.com/careers/job-search/global/en/job/P-100973/Senior-Consultant)): HTTP 403, Akamai "Access Denied" on both the www and apex hosts. `virtusa.com/careers/in/hyderabad` is the same Access Denied page. Not in today's 23-result Pega search on the referral board. Last confirmed state remains **filled** (HTTP 410 on 2026-11-03). **Do not apply.**
- **Virtusa referral board, other Pega hits (23 results, all skip):** Hyderabad Pega Constellations, Pega SSA, Pega SSA Constellation, Pega Support, Pega Developer (two), Pega Constellation, Senior Software Engineer, Pega Project Manager, Playwright Consultant; plus Bangalore Pega CLM, Chennai SSA (two) and Pega Developer, Gurgaon Pega UI, Canada/US LSA and developer roles. **Pega Business Analyst CREQ262292** is Dubai (posted 2026-07-08, Apply live, commercial lending). **Business Analyst - LOS CREQ262340** is Dubai (posted 2026-07-15) and the JD is Newgen/Flowable loan origination, not a Pega BA. **Architect (ATC) CREQ262308** is Bangalore; the body is a Senior Pega Business Analyst JD. All three are outside Hyderabad.
- **Deloitte USI** keyword Pega: 5 jobs, all engineer or support. Titles today: Applied AI Platform Engineer (PEGA Systems Engineer) — Software Specialist Engineer II, and the same family as Lead Software Engineer I (both Multiple Locations); Senior Software Engineer, GESTC (Pega, .NET & Integration), Hyderabad; Consultant, GESTC Tier 2 product support; Senior Software Engineer – Workflow (.NET), GESTC. No BA.
- **Accenture India** search "Pega Business Analyst": the cards that rendered are Custom Software Engineer, required skill Pega Platform, including Hyderabad at 5–10 years, plus Chennai, Bengaluru, and Kolkata at 5–10 years. No Business Analyst title. Outside the BA track.
- **Lloyds Technology Centre** Workday search "Pega": 1 job, Lead Software Engineer, Hyderabad Knowledge Park, posted 30+ days ago (req 163071). Not a BA.
- **Sutherland** job-results keyword Pega: 1 position, Forward Deployed Engineer, Bucharest, posted 16 Oct 2026. Not India and not a BA.
- **Wipro** official search Pega + Hyderabad: "No jobs found."
- **Cognizant** India English board, Hyderabad + Pega: "Displaying 0 to 0 of 0 matching jobs."
- **Capgemini** official search Pega + Hyderabad: "There are currently no open positions matching Pega AND Hyderabad."
- **LTM** `careers.ltm.com` search Pega + Hyderabad: no open positions. `www.ltimindtree.com/careers` redirects to an LTM marketing page, not a job list.
- **Infosys** `career.infosys.com/joblist` and `infosys.com/careers.html`: Akamai Access Denied. `digitalcareers.infosys.com` loaded a global careers shell, and the keyword field was not usable. **Not a confirmed zero.**
- **Pegasystems** Hyderabad facet (clicked from the careers index): 14 results. Titles are Senior System Architect, System Architect, Senior Applications Engineer, Application Engineer (CSA/CSSA), Senior Manager Consulting, Senior Manager Solutions Consulting, Associate Project Delivery Leader (Bangalore + 1 other location), and payroll roles. No Business Analyst or Business Architect.
- **Truviq:** the prior PEGA Business Analyst Zoho URL still says the posting is no longer available. Open Pega roles include CSSA (Bangalore), CLSA and Decisioning and Constellation (Hyderabad), plus a US LBA. No India BA.
- **Religent:** live roles are Pega Developer, Pega Administrator, CSSA, CLSA, Smart Claims, and related engineering titles. No BA title on the careers index.
- **Credera:** "No open positions found."
- **Tenth Revolution** Pega + Hyderabad: "No job listings found."
- **Eclatprime** `/careers/` and `/pega-ba/`: both HTTP 404.
- **Instasmart** Zoho Recruit: the host "does not exist."
- **Areteans** `/job-listing/` redirects to the Credera country picker. No separate job board.
- **Perficient** careers page hit a Vercel security checkpoint (HTTP 429). Not a confirmed zero.
- **ArcelorMittal** `careers.arcelormittal.com`: DNS does not resolve. The corporate careers URL returned HTTP 403. Unreachable, not a confirmed zero.

### 4. Pipeline updates
- This checkout has no `data/pipeline.md` or `data/contacts.md`. Comparison is against the last committed scan, 2026-11-03.
- **Virtusa P-100973:** not newly live. Yesterday the careers page said the job has been filled (HTTP 410). Today the same URL is Access Denied, so that filled page could not be re-read. It is still absent from the 23 Pega referral results. Keep it closed. Do not force apply.
- **Virtusa CREQ264873:** unchanged — still live, still a 3.1/5 skip. Posted 30 Jul 2026, still over 90 days.
- **#73 Eclatprime PEGA BA:** unchanged — unverified/removed. Both URLs still 404.
- **#064 Truviq PEGA BA:** unchanged — closed. Official Zoho page is still the unavailable posting.
- **#063 Virtusa creq254918:** not among today's Pega referral-board results.
- No eligible Hyderabad Pega BA was found on Deloitte USI, Lloyds, Sutherland, Truviq, Credera, Religent, Tenth Revolution, Pegasystems, Cognizant, LTIMindtree/LTM, Accenture, Wipro, or Capgemini.
- Portal caveats, not confirmed zeroes: Infosys Akamai block, Perficient bot wall, ArcelorMittal DNS/403, Eclatprime 404, Instasmart portal gone, Areteans board redirected to Credera with no openings listed. Virtusa's main careers host is blocked today; the referral ATS was readable.

### 5. Today's action list
1. **Do not apply today.** Nothing ATS-verified clears a 4.0.
2. **Virtusa referral thread:** P-100973 is still not an open apply. The public careers link is blocked from this check, and the last successful read said the job has been filled. If a replacement Hyderabad Pega BA req opens, the A&G/healthcare line and whether comp clears the configured floor are still the two gates.
3. **CREQ264873:** leave it. 10+ years, 0–15 day notice, posted 30 Jul 2026.
4. **Warm follow-up from the local contact map** (it was not in this checkout): Eclatprime, Deloitte USI, Lloyds, and Sutherland showed no Hyderabad Pega BA on the official board. A short "any Hyderabad Pega BA this week?" note is the useful ask. Do not apply from LinkedIn or Naukri copies.
5. **Tracker:** keep #064 closed, #73 unverified/removed, and #063 closed. Keep P-100973 closed/filled as of the 2026-11-03 confirmation. No new Applied row.

### 6. Scan log
- Checked official company portals for the preferred set and Pega partners (Workday JSON, Zoho, SelectMinds keyword search across 3 pages, SuccessFactors-style search, Accenture job search, Pega.com Hyderabad facet).
- Eligible live Pega BA roles in Hyderabad: 1 (CREQ264873, skip). Net-new apply recommendations: 0.
- P-100973 stayed closed on the last confirmed read; today's main-site recheck was Access Denied, not a reopening.
