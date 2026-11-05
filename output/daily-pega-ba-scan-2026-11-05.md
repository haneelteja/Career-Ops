# Daily Pega BA Scan — 2026-11-05

### 1. Today's headline
- **No new apply.** Official portals did not produce a Hyderabad Pega BA / Senior BA role that clears the bar.
- Virtusa referral ATS still has **Pega BA CREQ264873** live with an Apply button. It stays a **3.1/5 skip**: 10+ years, a 0–15 day notice window, posted 30 Jul 2026 (over 90 days).
- **P-100973 is still filled.** The official careers URL is readable again today and returns HTTP 410: the job has been filled. Do not apply. Accenture has a live Pega Platform Business Analyst (job ATCI-5492055-S2005583) with an Apply button, and the posting says the role is based at the Bengaluru office. That is outside Hyderabad.

### 2. ATS-verified live roles

| Priority | Company | Role | ATS link | Score | Status | Action |
|---|---|---|---|---:|---|---|
| — | Virtusa | Pega BA — CREQ264873 | [Official Virtusa referral ATS](https://virtusapolaris.referrals.selectminds.com/jobs/pega-ba-79738) | 3.1/5 | Live, Apply button present, posted 2026-07-30 | Skip |

Scoring for CREQ264873 is unchanged: 4.0 base (Pega BA JD: user stories, backlog, DCO, Pega certification required) +0.2 Hyderabad JD line −0.3 age over 90 days = 3.9, then held to 3.1 because the 10+ year bar and 0–15 day notice window miss the configured profile. The board category is "Architect (Level: Manager)" while the JD itself is BA work. The ATS geo string says "Hyderabad, Andhra Pradesh"; the JD location line says Hyderabad, so this is not an Andhra-only posting. Compensation is undisclosed. The profile file is not in this checkout; the experience band, notice period, and compensation floor were applied without copying those values here.

### 3. Unverified / dropped
- **Virtusa P-100973** ([main careers URL](https://www.virtusa.com/careers/job-search/global/en/job/P-100973/Senior-Consultant)): HTTP 410 on both the www and apex hosts. Page text: "the job you are trying to apply for has been filled." The same-day official keyword search (`keywords=Pega`) says there are no open positions for "Pega". Not in today's 23-result Pega search on the referral board. **Closed — do not apply.** `virtusa.com/careers/in/hyderabad` is an in-page 404 ("This experience doesn't exist"), HTTP 200.
- **Virtusa referral board, other Pega hits (23 results, all skip):** Hyderabad facet is 11 roles: Pega Constellations, Pega SSA, Pega SSA Constellation, Pega Support, Pega Developer (two), Pega Constellation, Senior Software Engineer, Pega Project Manager, Playwright Consultant, plus CREQ264873. Also Bangalore Pega CLM, Chennai SSA (two) and Pega Developer, Gurgaon Pega UI, Canada/US LSA and developer roles. **Pega Business Analyst** in Dubai (Senior Pega BA snippet, Apply live). **Business Analyst - LOS** is Dubai. **Architect (ATC)** is Bangalore; the body is a Senior Pega Business Analyst JD. All three are outside Hyderabad.
- **Accenture India** search "Pega Business Analyst" (official find-jobs API, 12 cards): **Business Analyst, Bengaluru, required skill Pega Platform, 5–10 years** ([job details](https://www.accenture.com/in-en/careers/jobdetails?id=ATCI-5492055-S2005583_en&title=Business+Analyst)). Apply is live. The JD says minimum 7.5 years in Pega BA and "This position is based at our Bengaluru office." Remote type is blank. Outside the Hyderabad-only rule. Hyderabad cards on that result set are Custom Software Engineer (Pega Platform, 2–5 years) and one **Business Analyst whose required skill is Calypso, not Pega** (10–12 years, job ATCI-5821317-S2072081). A second Bengaluru Business Analyst is Openlink Endur, not Pega.
- **Deloitte USI** keyword Pega: 5 jobs, all engineer or support. Titles today: Senior Software Engineer, GESTC (Pega, .NET & Integration), Hyderabad; Applied AI Platform Engineer (PEGA Systems Engineer) as Software Specialist Engineer II and as Lead Software Engineer I (Multiple Locations); Consultant, GESTC Tier 2 product support, Hyderabad; Senior Software Engineer – Workflow (.NET), GESTC, Hyderabad. No BA.
- **Lloyds Technology Centre** Workday search "Pega": 1 job, Lead Software Engineer, Hyderabad Knowledge Park, req 163071, posted 30+ days ago (facet: 31–120 days). Not a BA.
- **Sutherland** job-results keyword Pega: 1 position, Forward Deployed Engineer, Bucharest, posted 16 Oct 2026. Not India and not a BA. The India city list still shows 22 Hyderabad jobs with no keyword; none survived the Pega keyword.
- **Wipro** official search Pega + Hyderabad: "No jobs found."
- **Cognizant** keyword Pega and location Hyderabad, Telangana: "Displaying 0 to 0 of 0 matching jobs."
- **Capgemini** official search Pega + Hyderabad: "There are currently no open positions matching Pega AND Hyderabad."
- **LTM** `careers.ltm.com` search Pega + Hyderabad: no open positions. `www.ltimindtree.com/careers` is an LTM marketing page, not a job list.
- **Infosys** keyword Pega on `career.infosys.com`: 17 jobs found. The first 10 cards are testing or consulting (Senior System Engineer, IT Delivery, Lead Consultant, Pega Automation Testing Consultant, Pega Smart Investigate Consultant, Pega Consultant, Pega Test Engineer, an internal Pega req code, and two Celonis roles). The only Hyderabad card in that set is **Pega Automation Testing Consultant** (PEGA Testing). No Business Analyst title in those 10. Jobs 11–17 were not read: a follow-up load of the careers host returned Akamai Access Denied. **Not a confirmed zero for the unread page.**
- **Pegasystems** Hyderabad facet (clicked from the careers index): 14 results. Titles are Senior System Architect, System Architect, Senior Applications Engineer, Application Engineer (CSA/CSSA, sales automation), Senior Manager Consulting, Senior Manager Solutions Consulting India, Associate Project Delivery Leader (Bangalore + 1 other location), and payroll roles. No Business Analyst or Business Architect.
- **Truviq:** the prior PEGA Business Analyst Zoho URL still says the posting is no longer available. Open Pega roles include CSSA (Bangalore), CLSA, Decisioning, and Constellation (Hyderabad), plus a US LBA whose body is a Senior Business Analyst JD. No India BA.
- **Religent:** live roles are Pega Developer, Pega Administrator, CSSA, CLSA, Smart Claims, and related engineering titles. No BA title on the careers index.
- **Credera:** "No open positions found."
- **Tenth Revolution** Pega + Hyderabad: "No job listings found."
- **Eclatprime** `/careers/` and `/pega-ba/`: both HTTP 404.
- **Instasmart** Zoho Recruit: the host "does not exist."
- **Areteans** `/job-listing/` renders a Credera page (title loading `credera.com/en-us`). No separate job board. Credera itself has no openings.
- **Perficient** careers page hit a Vercel security checkpoint (HTTP 429). Not a confirmed zero.
- **ArcelorMittal** `careers.arcelormittal.com`: DNS does not resolve. The corporate careers URL returned a Cloudflare check. Unreachable, not a confirmed zero.

### 4. Pipeline updates
- This checkout has no `data/pipeline.md` or `data/contacts.md`. Comparison is against the last committed scan, 2026-11-04.
- **Virtusa P-100973:** not newly live. Yesterday the careers URL was Access Denied and the last successful read (2026-11-03) said the job has been filled. Today the same URL is HTTP 410 again and the page says the job has been filled. It is still absent from the 23 Pega referral results, and the official Pega keyword search shows no open positions. Keep it closed. Do not force apply.
- **Virtusa CREQ264873:** unchanged — still live, still a 3.1/5 skip. Posted 30 Jul 2026, still over 90 days.
- **Accenture Bengaluru Pega BA (ATCI-5492055-S2005583):** still live on the official job page with Apply. Same out-of-city result as 2026-11-03. Not a Hyderabad apply.
- **#73 Eclatprime PEGA BA:** unchanged — unverified/removed. Both URLs still 404.
- **#064 Truviq PEGA BA:** unchanged — closed. Official Zoho page is still the unavailable posting.
- **#063 Virtusa creq254918:** not among today's Pega referral-board results.
- No eligible Hyderabad Pega BA was found on Deloitte USI, Lloyds, Sutherland, Truviq, Credera, Religent, Tenth Revolution, Pegasystems, Cognizant, LTIMindtree/LTM, Accenture, Wipro, or Capgemini.
- Portal caveats, not confirmed zeroes: Infosys page 2 of the Pega keyword results (7 of 17 cards) after Akamai blocked the follow-up, Perficient bot wall, ArcelorMittal DNS/Cloudflare, Eclatprime 404, Instasmart portal gone, Areteans board redirected into Credera with no openings listed.

### 5. Today's action list
1. **Do not apply today.** Nothing ATS-verified in Hyderabad clears a 4.0.
2. **Virtusa referral thread:** P-100973 is filled on the public careers page again today. Do not apply. If a replacement Hyderabad Pega BA req opens, the A&G/healthcare line and whether comp clears the configured floor are still the two gates.
3. **CREQ264873:** leave it. 10+ years, 0–15 day notice, posted 30 Jul 2026.
4. **Warm follow-up from the local contact map** (it was not in this checkout): Eclatprime, Deloitte USI, Lloyds, and Sutherland showed no Hyderabad Pega BA on the official board. A short "any Hyderabad Pega BA this week?" note is the useful ask. Do not apply from LinkedIn or Naukri copies, and do not treat the Accenture Bengaluru Pega BA as a Hyderabad role.
5. **Tracker:** keep #064 closed, #73 unverified/removed, and #063 closed. Keep P-100973 closed/filled. No new Applied row.

### 6. Scan log
- Checked official company portals for the preferred set and Pega partners (Workday JSON, Zoho, SelectMinds keyword search across 3 pages plus the Hyderabad facet, SuccessFactors-style search, Accenture find-jobs, Infosys keyword search, Pega.com Hyderabad facet).
- Eligible live Pega BA roles in Hyderabad: 1 (CREQ264873, skip). Net-new apply recommendations: 0.
- P-100973 was reconfirmed filled (HTTP 410) after yesterday's Access Denied.
