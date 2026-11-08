# Daily Pega BA Scan — 2026-11-08

### 1. Today's headline
- **0 net-new ATS-verified roles.** One important correction: TCS **Pega Business Analyst 430542** was omitted from recent briefs but remains live on official iBegin; it is not newly posted.
- TCS is a **4.2/5 conditional apply**: Hyderabad, live Apply button, deadline 31 Dec 2026, but the JD requires 8–12 years and does not disclose salary. Virtusa CREQ264873 remains live but stale and unsuitable.
- Wipro now has two live Hyderabad PEGA Technical Lead roles, but both are coding/lead jobs, not BA. Today: apply to TCS only if experience is at least 8 years and CTC clears ₹10L.

### 2. ATS-verified live roles

| Priority | Company | Role | ATS link | Score | Status | Action |
|---|---|---|---|---:|---|---|
| 1 | TCS | Pega Business Analyst — 430542 | [Official TCS iBegin](https://ibegin.tcsapps.com/candidate/next/en-IN/jobs/430542J) | 4.2/5 | Live; Hyderabad; 8–12 years; Apply enabled; apply by 2026-12-31 | Apply today **only if total experience is 8+ years**; use the existing resume and confirm CTC ≥₹10L |
| — | Virtusa | Pega BA — CREQ264873 | [Official Virtusa referral ATS](https://virtusapolaris.referrals.selectminds.com/jobs/pega-ba-79738) | 3.1/5 | Live, Apply button present, posted 2026-07-30 | Skip |
| — | Wipro | Technical Lead L1 (two reqs) | [204847](https://careers.wipro.com/job/Hyderabad-TECHNICAL-LEAD-L1-IND-500032/204847-en_US/) · [204848](https://careers.wipro.com/job/Hyderabad-TECHNICAL-LEAD-L1-IND-500032/204848-en_US/) | 2.5/5 | Live, Apply now on both pages, RSS pubDate 2026-10-24 | Skip — not a BA |

TCS verification: the rendered official page shows “Pega Business Analyst,” Hyderabad, 8–12 years, job ID 430542, “Apply By: 31st December 2026,” and enabled Apply buttons. The JD is BA-focused (requirements, Pega capability alignment, stakeholder management and BA mentoring), although TCS metadata labels the internal role “Developer.” Salary is not stated, so the ₹10L floor remains a recruiter-screen gate.

Scoring for CREQ264873 is unchanged: 4.0 base (Pega BA JD: user stories, backlog, DCO, Pega certification required) +0.2 Hyderabad JD line −0.3 age over 90 days = 3.9, then held to 3.1 because the JD asks for 10+ years and a 0–15 day notice window. The board category is "Architect (Level: Manager)" while the JD itself is BA work. The ATS geo string says "Hyderabad, Andhra Pradesh"; the JD location line says Hyderabad, so this is not an Andhra-only posting. Compensation is undisclosed. The profile file is not in this checkout; the experience band, notice period, and compensation floor were not re-read and are not copied here.

Wipro is 2.5 because the title and JD are Technical Lead work: module-level code review, configuration, and replication patterns, with mandatory skill PEGA and 5–8 years. Hyderabad and a live Apply button do not make it a BA role.

### 3. Unverified / dropped
- **Virtusa P-100973** ([main careers URL](https://www.virtusa.com/careers/job-search/global/en/job/P-100973/Senior-Consultant)): HTTP 403, Akamai "Access Denied" on both the www and apex hosts. `virtusa.com/careers/in/hyderabad` is the same Access Denied page. Not in today's 23-result Pega search on the referral board (3 pages). Last confirmed state remains **filled** (HTTP 410 on 2026-11-05). **Do not apply.**
- **Virtusa referral board, other Pega hits (23 results across 3 pages, all skip):** Hyderabad facet is 11 roles: Pega Constellations, Pega BA CREQ264873, Pega Project Manager, Pega SSA, Pega SSA Constellation, Pega Support, Pega Developer (two), Pega Constellation, Senior Software Engineer, Playwright Consultant. Also Bangalore Pega CLM, Chennai Pega Senior Systems Architect (two) and Pega Developer, Gurgaon Pega UI, Canada/US LSA and developer roles. **Pega Business Analyst** is Dubai (Senior Pega BA snippet, Apply path on the result card). **Business Analyst - LOS** is Dubai. **Architect (ATC)** is Bangalore. All three are outside Hyderabad.
- **Pegasystems:** the Hyderabad location facet count is 14. The full careers index (74 postings across 3 pages) has 12 jobs whose location line is India - Telangana - Hyderabad: Senior System Architect, System Architect, Senior Applications Engineer, Application Engineer (CSA/CSSA, sales automation), Senior Manager Consulting, Senior Manager Solutions Consulting India, and payroll roles. No Business Analyst or Business Architect in Hyderabad. **Lead Business Architect** is still live with Apply now, location **US - Georgia - Remote** ([job page](https://www.pega.com/about/careers/24139/lead-business-architect)). **Lead Pega Business Architect** is on the official index at **US - Florida - Remote** ([listing](https://www.pega.com/about/careers/24041/lead-pega-business-architect)). Both are Lead track and outside Hyderabad. Skip.
- **Accenture India** official find-jobs API, keyword "Pega Business Analyst": first card is still **Business Analyst, Bengaluru, required skill Pega Platform, 5–10 years** ([job details](https://www.accenture.com/in-en/careers/jobdetails?id=ATCI-5492055-S2005583_en&title=Business+Analyst)). Apply is live. The JD says minimum 7.5 years in Pega BA and "This position is based at our Bengaluru office." A skill filter for Pega Platform plus Hyderabad returns **15 jobs, every one titled Custom Software Engineer** (2–5 or 5–10 years). No Hyderabad Business Analyst with Pega Platform in that set. Other Hyderabad Business Analyst cards in the broader search are Dynamics 365, Calypso, or ServiceNow, not Pega.
- **Deloitte USI** keyword `search=Pega` (5 jobs, `data-total="5"`): Senior Software Engineer, GESTC (Pega, .NET & Integration), Hyderabad; Applied AI Platform Engineer (PEGA Systems Engineer) as Software Specialist Engineer II and as Lead Software Engineer I (Multiple Locations); Senior Software Engineer – Workflow (.NET), GESTC, Hyderabad; Consultant, GESTC Tier 2 product support, Hyderabad. No BA.
- **Lloyds Technology Centre** Workday search "Pega": 1 job, Lead Software Engineer, Hyderabad Knowledge Park, req 163071, posted 30+ days ago (facet: 31–120 days). A separate "Business Analyst" search returned Head of Digital Marketing Data, AI & Operations and Insight Analyst. Neither is a Pega BA.
- **Sutherland** job-results page loaded (HTTP 200). The listing is a client-side widget; this pass did not retrieve the keyword result set, so it is **not a confirmed zero**. The homepage city list still links an India job-results route.
- **Cognizant** keyword Pega and location Hyderabad: Cloudflare "Just a moment" (HTTP 403), including the search-results URL and the widgets API. **Not a confirmed zero.**
- **Capgemini** official RSS for Pega AND Hyderabad: "No jobs currently available." The HTML search says the same.
- **LTM** `careers.ltm.com` RSS for Pega AND Hyderabad: "No jobs currently available." `www.ltimindtree.com/careers` is an LTM marketing page, not a job list.
- **Infosys** `career.infosys.com/joblist`: Akamai Access Denied. `digitalcareers.infosys.com` loaded a global careers shell and did not apply the Pega keyword. **Not a confirmed zero.**
- **Truviq:** the prior PEGA Business Analyst Zoho URL still says the posting is no longer available. Open roles (20 on the careers payload) include PEGA CSSA (Bangalore), PEGA CLSA, Decisioning, and Constellation (Hyderabad), plus a US LBA in Chicago. No India BA title.
- **Religent:** live roles include Pega Developer (banking, Constellation, CSA/CSSA), Pega Administrator, CSSA, CLSA, PRPC, and Smart Claims. No Business Analyst title.
- **Credera:** "No open positions found."
- **Tenth Revolution** Pega + Hyderabad: "No job listings found."
- **Eclatprime** `/careers/` and `/pega-ba/`: both HTTP 404.
- **Instasmart** Zoho Recruit: the host "does not exist."
- **Areteans** `/job-listing/` is a stub ("Areteans is now Credera!") with static text for a PEGA CLM/KYC product-engineer role, not a BA apply button. Credera itself has no openings.
- **Perficient** careers page hit a Vercel security checkpoint (HTTP 429). Not a confirmed zero.
- **ArcelorMittal** `careers.arcelormittal.com` and `jobs.arcelormittal.com`: DNS does not resolve. The corporate careers URL returned HTTP 403. Unreachable, not a confirmed zero.

### 4. Pipeline updates
- This checkout has no `data/pipeline.md` or `data/contacts.md`. Comparison is against the last committed scan, 2026-11-07.
- **TCS 430542:** restored to the active list after being omitted from recent daily reports. This is a reporting correction, not a new posting. Official iBegin remains live through 31 Dec 2026.
- **Virtusa P-100973:** not newly live. The careers URL is Access Denied again, so the filled page could not be re-read. It is still absent from the 23 Pega referral results. Keep it closed. Do not force apply.
- **Virtusa CREQ264873:** unchanged — still live, still a 3.1/5 skip. Posted 30 Jul 2026, now 101 days old.
- **Wipro:** changed versus yesterday's HTML "No jobs found." The official RSS (built 2026-11-08) and both job pages are live Technical Lead L1 / PEGA / Hyderabad roles, posted 24 Oct 2026. Wrong track. No Applied row.
- **Accenture Bengaluru Pega BA (ATCI-5492055-S2005583):** still live on the official job page with Apply, and still the first card on the official "Pega Business Analyst" search. Same out-of-city result. Not a Hyderabad apply.
- **Pega Lead Business Architect:** still live on the official careers site, location US - Georgia - Remote. The Florida Lead Pega Business Architect is also on the index. Neither is a new Hyderabad opening.
- **#73 Eclatprime PEGA BA:** unchanged — unverified/removed. Both URLs still 404.
- **#064 Truviq PEGA BA:** unchanged — closed. Official Zoho page is still the unavailable posting.
- **#063 Virtusa creq254918:** not among today's Pega referral-board results.
- No eligible Hyderabad Pega BA was found on Deloitte USI, Lloyds, Truviq, Credera, Religent, Tenth Revolution, Pegasystems, Accenture, LTIMindtree/LTM, or Capgemini.
- Portal caveats, not confirmed zeroes: Sutherland keyword widget did not return a result set, Cognizant bot wall, Infosys India board blocked, Perficient bot wall, ArcelorMittal DNS/403, Eclatprime 404, Instasmart portal gone, Areteans board is a Credera stub with no openings listed. Virtusa's main careers host is blocked today; the referral ATS was readable.

### 5. Today's action list
1. **Apply — TCS iBegin (10 minutes):** If total experience is at least 8 years, apply to [job 430542](https://ibegin.tcsapps.com/candidate/next/en-IN/jobs/430542J) with the existing resume. Do not tailor it. If asked for expected CTC, use ₹12L; stop if the range is below ₹10L.
2. **Skip — TCS if under 8 years:** The official minimum is 8 years. Do not stretch “7+” into 8.
3. **LinkedIn — Pradeep Mantri:** “Hi Pradeep, I’m checking whether a replacement Hyderabad Pega Business Analyst/BSA opening has come up at Virtusa. I’m CPBA/CSSA certified with 7+ years’ experience and a 45-day notice period. If you see a suitable current req, could you please share the official job ID?”
4. **LinkedIn — Goutham Parcha:** “Hi Goutham, have you seen any current Hyderabad or Remote India Pega BA/BSA openings in the Pega ecosystem this week? I’m targeting CPBA-track roles, not developer or LBA positions. An official careers link or job ID would be very helpful.”
5. **No other applications today:** Leave CREQ264873, the Wipro Technical Lead roles, #73, #064 and aggregator copies alone.

### 6. Scan log
- Checked 20 requested official portals: Eclatprime, Virtusa, Deloitte USI, Lloyds TC, Sutherland, ArcelorMittal, Truviq, Credera, Areteans, Religent, Tenth Revolution, Pegasystems, Instasmart, Cognizant, Perficient, LTIMindtree/LTM, Accenture, Wipro, Infosys and Capgemini; also rechecked TCS iBegin 430542.
- Eligible live Hyderabad Pega BA roles: 2. Net-new postings: 0. Apply-worthy restored candidate: 1.
- P-100973 stayed closed on the last confirmed read; today's main-site recheck was Access Denied, not a reopening.
