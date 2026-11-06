# Daily Pega BA Scan — 2026-11-06

### 1. Today's headline
- **No new apply.** Official portals did not produce a Hyderabad Pega BA / Senior BA role that clears the bar.
- Virtusa referral ATS still has **Pega BA CREQ264873** live with an Apply button. It stays a **3.1/5 skip**: 10+ years, a 0–15 day notice window, posted 30 Jul 2026 (over 90 days).
- **P-100973 could not be re-read.** The official careers URL returns Akamai Access Denied today. The last successful read (2026-11-05) said the job has been filled, and it is still absent from the 23-result Pega search on the referral board. Do not apply. Accenture still has a live Pega Platform Business Analyst (job ATCI-5492055-S2005583) with an Apply button, based at the Bengaluru office. That is outside Hyderabad.

### 2. ATS-verified live roles

| Priority | Company | Role | ATS link | Score | Status | Action |
|---|---|---|---|---:|---|---|
| — | Virtusa | Pega BA — CREQ264873 | [Official Virtusa referral ATS](https://virtusapolaris.referrals.selectminds.com/jobs/pega-ba-79738) | 3.1/5 | Live, Apply button present, posted 2026-07-30 | Skip |

Scoring for CREQ264873 is unchanged: 4.0 base (Pega BA JD: user stories, backlog, DCO, Pega certification required) +0.2 Hyderabad JD line −0.3 age over 90 days = 3.9, then held to 3.1 because the 10+ year bar and 0–15 day notice window miss the configured profile. The board category is "Architect (Level: Manager)" while the JD itself is BA work. The ATS geo string says "Hyderabad, Andhra Pradesh"; the JD location line says Hyderabad, so this is not an Andhra-only posting. Compensation is undisclosed. The profile file is not in this checkout; the experience band, notice period, and compensation floor were not re-read and are not copied here.

### 3. Unverified / dropped
- **Virtusa P-100973** ([main careers URL](https://www.virtusa.com/careers/job-search/global/en/job/P-100973/Senior-Consultant)): HTTP 403, Akamai "Access Denied" on both the www and apex hosts, including in a browser. `virtusa.com/careers/in/hyderabad` is the same Access Denied page. Not in today's 23-result Pega search on the referral board. Last confirmed state remains **filled** (HTTP 410 on 2026-11-05). **Do not apply.**
- **Virtusa referral board, other Pega hits (23 results across 3 pages, all skip):** Hyderabad facet is 11 roles: Pega Constellations, Pega SSA, Pega SSA Constellation, Pega Support, Pega Developer (two), Pega Constellation, Senior Software Engineer, Pega Project Manager, Playwright Consultant, plus CREQ264873. Also Bangalore Pega CLM, Chennai SSA (two) and Pega Developer, Gurgaon Pega UI, Canada/US LSA and developer roles. **Pega Business Analyst** in Dubai (Senior Pega BA snippet, Apply path live on the result card). **Business Analyst - LOS** is Dubai. **Architect (ATC)** is Bangalore; the body is a Senior Pega Business Analyst JD. All three are outside Hyderabad.
- **Accenture India** relevancy search "Pega Business Analyst" (official job search, keyword applied): the first card is **Business Analyst, Bengaluru, required skill Pega Platform, 5–10 years** ([job details](https://www.accenture.com/in-en/careers/jobdetails?id=ATCI-5492055-S2005583_en&title=Business+Analyst)). Apply is live. The JD says minimum 7.5 years in Pega BA and "This position is based at our Bengaluru office." The Hyderabad card on that first page is **Custom Software Engineer, Pega Platform, 2–5 years**. Other first-page cards are engineer titles in Bengaluru, Navi Mumbai, Ahmedabad, and Chennai. Outside the Hyderabad-only rule.
- **Deloitte USI** keyword Pega (posted search, 5 jobs): Applied AI Platform Engineer (PEGA Systems Engineer) as Software Specialist Engineer II and as Lead Software Engineer I (Multiple Locations); Senior Software Engineer, GESTC (Pega, .NET & Integration), Hyderabad; Consultant, GESTC Tier 2 product support, Hyderabad; Senior Software Engineer – Workflow (.NET), GESTC, Hyderabad. No BA.
- **Lloyds Technology Centre** Workday search "Pega": 1 job, Lead Software Engineer, Hyderabad Knowledge Park, req 163071, posted 30+ days ago (facet: 31–120 days). Not a BA.
- **Sutherland** job-results keyword Pega: 1 position, Forward Deployed Engineer, Bucharest, posted 16 Oct 2026 (about 20 days ago). Not India and not a BA. The unfiltered city list still shows Hyderabad jobs; none survived the Pega keyword.
- **Wipro** official search Pega + Hyderabad: "No jobs found."
- **Cognizant** keyword Pega and location Hyderabad: "Displaying 0 to 0 of 0 matching jobs."
- **Capgemini** official search Pega + Hyderabad: "There are currently no open positions matching Pega AND Hyderabad."
- **LTM** `careers.ltm.com` search Pega + Hyderabad: no open positions. `www.ltimindtree.com/careers` resolves to an LTM marketing page, not a job list.
- **Infosys** `career.infosys.com/joblist`: Akamai Access Denied. `digitalcareers.infosys.com` loaded a global careers shell (1,237 jobs, mostly US) and the Pega keyword was not applied. **Not a confirmed zero.**
- **Pegasystems** Hyderabad facet (clicked from the careers index): 14 results. Titles are Senior System Architect, System Architect, Senior Applications Engineer, Application Engineer (CSA/CSSA, sales automation), Senior Manager Consulting, Senior Manager Solutions Consulting India, Associate Project Delivery Leader (Bangalore + 1 other location), and payroll roles. No Business Analyst or Business Architect.
- **Truviq:** the prior PEGA Business Analyst Zoho URL still says the posting is no longer available. Open roles (20 on the careers index) include PEGA CSSA (Bangalore), PEGA CLSA, Decisioning, and Constellation (Hyderabad), plus a US LBA in Chicago. No India BA.
- **Religent:** after Load more, live roles are Pega Developer, Pega Administrator, CSSA, CLSA, LSA, Smart Claims, Decisioning, PRPC, and other engineering titles. No Business Analyst title.
- **Credera:** "No open positions found."
- **Tenth Revolution** Pega + Hyderabad: "No job listings found."
- **Eclatprime** `/careers/` and `/pega-ba/`: both HTTP 404.
- **Instasmart** Zoho Recruit: the host "does not exist."
- **Areteans** `/job-listing/` is a stub ("Areteans is now Credera!") with unrendered job shortcodes, not a live apply board. Credera itself has no openings.
- **Perficient** careers page hit a Vercel security checkpoint (HTTP 429). Not a confirmed zero.
- **ArcelorMittal** `careers.arcelormittal.com`: DNS does not resolve. Unreachable, not a confirmed zero.

### 4. Pipeline updates
- This checkout has no `data/pipeline.md` or `data/contacts.md`. Comparison is against the last committed scan, 2026-11-05.
- **Virtusa P-100973:** not newly live. Yesterday the careers URL was HTTP 410 and the page said the job has been filled. Today the same URL is Access Denied, so that filled page could not be re-read. It is still absent from the 23 Pega referral results. Keep it closed. Do not force apply.
- **Virtusa CREQ264873:** unchanged — still live, still a 3.1/5 skip. Posted 30 Jul 2026, still over 90 days.
- **Accenture Bengaluru Pega BA (ATCI-5492055-S2005583):** still live on the official job page with Apply. Same out-of-city result as 2026-11-05. Not a Hyderabad apply.
- **#73 Eclatprime PEGA BA:** unchanged — unverified/removed. Both URLs still 404.
- **#064 Truviq PEGA BA:** unchanged — closed. Official Zoho page is still the unavailable posting.
- **#063 Virtusa creq254918:** not among today's Pega referral-board results.
- No eligible Hyderabad Pega BA was found on Deloitte USI, Lloyds, Sutherland, Truviq, Credera, Religent, Tenth Revolution, Pegasystems, Cognizant, LTIMindtree/LTM, Accenture, Wipro, or Capgemini.
- Portal caveats, not confirmed zeroes: Infosys India board blocked (global shell did not take the Pega keyword), Perficient bot wall, ArcelorMittal DNS, Eclatprime 404, Instasmart portal gone, Areteans board is a Credera stub with no openings listed. Virtusa's main careers host is blocked today; the referral ATS was readable.

### 5. Today's action list
1. **Do not apply today.** Nothing ATS-verified in Hyderabad clears a 4.0.
2. **Virtusa referral thread:** P-100973 is still not an open apply. The public careers link is blocked from this check, and the last successful read said the job has been filled. If a replacement Hyderabad Pega BA req opens, the A&G/healthcare line and whether comp clears the configured floor are still the two gates.
3. **CREQ264873:** leave it. 10+ years, 0–15 day notice, posted 30 Jul 2026.
4. **Warm follow-up from the local contact map** (it was not in this checkout): Eclatprime, Deloitte USI, Lloyds, and Sutherland showed no Hyderabad Pega BA on the official board. A short "any Hyderabad Pega BA this week?" note is the useful ask. Do not apply from LinkedIn or Naukri copies, and do not treat the Accenture Bengaluru Pega BA as a Hyderabad role.
5. **Tracker:** keep #064 closed, #73 unverified/removed, and #063 closed. Keep P-100973 closed/filled as of the 2026-11-05 confirmation. No new Applied row.

### 6. Scan log
- Checked official company portals for the preferred set and Pega partners (Workday JSON, Zoho posting list, SelectMinds keyword search across 3 pages plus the Hyderabad facet, Deloitte posted keyword search, Accenture relevancy search and the Bengaluru job page, Infosys India board and global shell, Pega.com Hyderabad facet, Sutherland keyword results, Religent after Load more).
- Eligible live Pega BA roles in Hyderabad: 1 (CREQ264873, skip). Net-new apply recommendations: 0.
- P-100973 stayed closed on the last confirmed read; today's main-site recheck was Access Denied, not a reopening.
