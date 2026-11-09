# Daily Pega BA Scan — 2026-11-09

### 1. Today's headline
- **0 net-new ATS-verified Hyderabad Pega BA roles.** Nothing new cleared the apply bar on the official portals that returned a job list.
- **TCS 430542 is not confirmed live today.** The official iBegin URL loaded the careers shell only. The job description and Apply button did not render, and the job JSON GET is served that same shell. Do not apply from yesterday's note until the JD is visible again.
- Wipro's two Hyderabad PEGA Technical Lead reqs are gone from the official RSS. Virtusa CREQ264873 is still live and still a skip.

### 2. ATS-verified live roles

| Priority | Company | Role | ATS link | Score | Status | Action |
|---|---|---|---|---:|---|---|
| — | Virtusa | Pega BA — CREQ264873 | [Official Virtusa referral ATS](https://virtusapolaris.referrals.selectminds.com/jobs/pega-ba-79738) | 3.1/5 | Live, Apply for Job present, posted 2026-07-30 (102 days) | Skip |
| — | Accenture | Business Analyst — ATCI-5492055-S2005583 | [Official job page](https://www.accenture.com/in-en/careers/jobdetails?id=ATCI-5492055-S2005583_en&title=Business+Analyst) | 3.2/5 | Live, schema.org JobPosting, Apply for this job, Bengaluru | Skip — not Hyderabad or Remote India |

Virtusa CREQ264873: title Pega BA, requisition CREQ264873, category "Architect (Level: Manager)", location string "Hyderabad, Andhra Pradesh, India", post date 30 Jul 2026. The JD line says Job Location Hyderabad, so this is not an Andhra-only posting. The JD requires 10+ years of business analyst experience, 3+ years with Pega, a Pega certification, and a notice window of 0 to 15 days. Scoring stays 3.1: Pega BA content, Hyderabad JD line, and an indexed referral posting, held down by the 10+ year bar, the short notice window, and age past 90 days. Compensation is not stated. `config/profile.yml` is not in this checkout, so the compensation floor was not re-read and is not copied here.

Accenture Bengaluru is a real Pega BA posting (required skill Pega Platform, minimum 7.5 years in Pega BA, "This position is based at our Bengaluru office"). It is outside the Hyderabad-only rule.

### 3. Unverified / dropped
- **TCS Pega Business Analyst 430542** ([iBegin](https://ibegin.tcsapps.com/candidate/next/en-IN/jobs/430542J)): headless render reached "Loading complete" and showed only the India careers chrome (Login, Register, Guided Search). No title, no Hyderabad line, no experience band, and no Apply control. GET `https://ibegin.tcsapps.com/candidate/next/en-IN/job/desc/430542` returns the SPA HTML, not job JSON. **UNVERIFIED — do not apply.**
- **Wipro:** official RSS for `(pega) AND locationSearch:(Hyderabad)`, built 2026-11-09 03:36 UTC, says "No jobs currently available." A global `pega` RSS has India developer, solution-architect, and techno-functional titles in Bengaluru, Chennai, and Pune, and no Hyderabad item. The previous Technical Lead pages ([204847](https://careers.wipro.com/job/Hyderabad-TECHNICAL-LEAD-L1-IND-500032/204847-en_US/), [204848](https://careers.wipro.com/job/Hyderabad-TECHNICAL-LEAD-L1-IND-500032/204848-en_US/)) return a generic Job Details shell with no title, no PEGA text, and no Apply control. Treat both as closed.
- **Virtusa P-100973** ([main careers URL](https://www.virtusa.com/careers/job-search/global/en/job/P-100973/Senior-Consultant)): HTTP 403, Akamai Access Denied, same as `virtusa.com/careers/in/hyderabad`. Not among today's 23 Pega results on the referral board. Last confirmed state remains filled. **Do not apply.**
- **Virtusa referral board, other Pega hits (23 across 3 pages, all skip):** Hyderabad titles are Pega Constellations, Pega BA CREQ264873, Pega Project Manager, Pega SSA, Pega SSA Constellation, Pega Support, Pega Developer (two), Pega Constellation, Senior Software Engineer, and Playwright Consultant. Also Bangalore Pega CLM, Chennai Pega Senior Systems Architect (two) and Pega Developer, Gurgaon Pega UI, Canada/US LSA and developer roles. **Pega Business Analyst** and **Business Analyst - LOS** are Dubai. **Architect (ATC)** is Bangalore.
- **Pegasystems:** sitemap lists 77 career URLs. All 77 job pages were fetched. **14** have a Hyderabad location line: Senior System Architect (five, one also Bangalore), System Architect, Senior Applications Engineer (two), Application Engineer for Marketing Operations (CSA/CSSA), Senior Manager Consulting, Senior Manager Solutions Consulting India, Payroll Specialist, Senior Payroll Specialist, and Associate Project Delivery Leader (Bangalore and Hyderabad). Sampled Hyderabad pages show Apply Now. No Business Analyst or non-lead Business Architect in Hyderabad. **Lead Business Architect** is still [US - Georgia - Remote](https://www.pega.com/about/careers/24139/lead-business-architect) with Apply now. **Lead Pega Business Architect** is still [US - Florida - Remote](https://www.pega.com/about/careers/24041/lead-pega-business-architect) with Apply now. Both are Lead track and outside Hyderabad. The Hyderabad facet count on the rendered index is 14. Skip.
- **Accenture Workday** search text "Pega" with the Hyderabad location facet: 34 jobs, every title Custom Software Engineer (21 of the location strings say Hyderabad; the rest in that response are Bengaluru or Chennai). No Business Analyst in that set. The Bengaluru Pega BA above is the only analyst title found on the broader Pega search.
- **Deloitte USI** `search=Pega` (`data-total="5"`): Applied AI Platform Engineer (PEGA Systems Engineer) as Lead Software Engineer I and as Software Specialist Engineer II (Multiple Locations); Senior Software Engineer, GESTC, Pega, .NET & Integration (Hyderabad); Senior Software Engineer, Workflow .NET, GESTC (Hyderabad); Consultant, GESTC Tier 2 product support (Hyderabad). No BA.
- **Lloyds Technology Centre** Workday search "Pega": 1 job, Lead Software Engineer, Hyderabad Knowledge Park, req 163071, posted 30+ days ago. Search "Business Analyst": Head of Digital Marketing Data, AI & Operations (posted 5 days ago) and Insight Analyst (posted 9 days ago). Neither is a Pega BA.
- **Capgemini** official RSS for Pega AND Hyderabad: "No jobs currently available."
- **LTM** `careers.ltm.com` RSS for Pega AND Hyderabad: "No jobs currently available."
- **Truviq:** the prior PEGA Business Analyst Zoho URL still says the posting is no longer available. Open titles (20) include PEGA CSSA (Bangalore), PEGA CLSA, Decisioning, and Constellation (Hyderabad), plus a US LBA in Chicago whose description uses Senior Business Analyst wording. The posting title is Pega LBA - US, city Chicago. No India BA title.
- **Credera:** "No open positions found."
- **Tenth Revolution** Pega + Hyderabad: "No job listings found."
- **Eclatprime** `/careers/` and `/pega-ba/`: both HTTP 404.
- **Instasmart** Zoho Recruit: "Page does not exist."
- **Areteans** `/job-listing/` is still the Credera stub with static PEGA CLM/KYC product-engineer text, not a BA apply button.
- **Religent:** `religentsystems.com` and `/careers/` redirect to a domain parking page (`/lander`). The previous developer listings could not be re-read. Not a live board today.
- **Sutherland** India job-results page shows a result count of 0 in the HTML. The Pega keyword is a client-side filter and was not executed, so this is **not a confirmed keyword zero**.
- **Cognizant** keyword Pega and location Hyderabad: Cloudflare "Just a moment" (HTTP 403). **Not a confirmed zero.**
- **Infosys** `career.infosys.com/joblist`: Akamai Access Denied. `digitalcareers.infosys.com` loaded a global careers shell and did not apply the Pega keyword. **Not a confirmed zero.**
- **Perficient** careers page hit a Vercel security checkpoint (HTTP 429). Not a confirmed zero.
- **ArcelorMittal** `careers.arcelormittal.com` and `jobs.arcelormittal.com`: DNS does not resolve. The corporate careers URL returned HTTP 403. Unreachable, not a confirmed zero.

### 4. Pipeline updates
- This checkout has no `data/pipeline.md`, `data/contacts.md`, or `config/profile.yml`. Comparison is against the last committed scan, 2026-11-08. No personal values from those files are copied here. `output/target-companies-playbook-2026-05-19.md` is not in the repo.
- **TCS 430542:** was a conditional apply yesterday. Today the official page did not render the JD. Newly unverified. Do not submit.
- **Wipro 204847 and 204848:** newly absent. Yesterday both were live Technical Lead / PEGA / Hyderabad roles. Today's official RSS has no Hyderabad Pega item, and the job URLs no longer show a JD.
- **Virtusa CREQ264873:** unchanged — still live, still a 3.1/5 skip. Posted 30 Jul 2026, now 102 days old.
- **Virtusa P-100973:** not newly live. Still absent from the 23 Pega referral results. Main careers host is Access Denied again. Keep it closed.
- **Accenture Bengaluru Pega BA (ATCI-5492055-S2005583):** still live on the official job page. Still out of city.
- **Pega Lead Business Architect (Georgia) and Lead Pega Business Architect (Florida):** still live, still Lead track, still outside Hyderabad. Hyderabad facet remains 14 non-BA jobs.
- **Religent:** careers URL changed from a job list to a parking page.
- **#73 Eclatprime PEGA BA:** unchanged — both URLs still 404.
- **#064 Truviq PEGA BA:** unchanged — official Zoho page still says the posting is no longer available.
- No eligible Hyderabad Pega BA was found on Deloitte USI, Lloyds, Truviq, Credera, Tenth Revolution, Pegasystems, Accenture, LTIMindtree/LTM, or Capgemini.

### 5. Today's action list
1. **Do not apply to TCS today.** Open [job 430542](https://ibegin.tcsapps.com/candidate/next/en-IN/jobs/430542J) in a normal browser. Apply only if the Pega Business Analyst description and an enabled Apply button are actually on the page. Do not use yesterday's brief as proof that it is still open.
2. **Skip Virtusa CREQ264873.** It is live on the referral ATS and still asks for 10+ years and a 0–15 day notice window.
3. **Do not force Virtusa P-100973.** It is not on the referral board. The standing A&G question stays with the existing Virtusa contact. No new application.
4. **No other applications today.** Leave the Wipro Technical Lead URLs, the Accenture Bengaluru role, the Pega US Lead Business Architect roles, #73, and #064 alone.
5. **Named warm outreach is not possible from this run.** `data/contacts.md` is not in the checkout, so no new people are named here. Religent's public careers URL is parked; do not send candidates there.

### 6. Scan log
- Checked the 20 requested official portals plus TCS iBegin 430542.
- Eligible live Hyderabad Pega BA roles still on an ATS: 1 (Virtusa CREQ264873), and it remains a skip. Net-new postings: 0. Apply-worthy roles: 0.
- TCS 430542 was not reconfirmed. Wipro Hyderabad PEGA reqs dropped off the official feed. P-100973 stayed closed on the referral board; the main careers host returned Access Denied.
