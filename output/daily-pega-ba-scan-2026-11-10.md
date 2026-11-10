# Daily Pega BA Scan — 2026-11-10

### 1. Today's headline
- **TCS Pega Business Analyst 430542 is live again on official iBegin.** Yesterday the page rendered only the careers shell. Today the job description, Hyderabad line, and Apply controls are on the page. This is the same req, not a new posting. **0 net-new Hyderabad Pega BA roles.**
- Virtusa CREQ264873 is still live and still a skip. Pegasystems' Hyderabad count moved from 14 to 15; the added role is a systems engineer, not a BA. The Florida Lead Pega Business Architect page now returns "Looking for something?"

### 2. ATS-verified live roles

| Priority | Company | Role | ATS link | Score | Status | Action |
|---|---|---|---|---:|---|---|
| 1 | TCS | Pega Business Analyst — 430542 | [Official TCS iBegin](https://ibegin.tcsapps.com/candidate/next/en-IN/jobs/430542J) | 4.2/5 | Live. Hyderabad. 8–12 years. Apply shown twice. Apply by 2026-12-31 | Conditional apply |
| — | Virtusa | Pega BA — CREQ264873 | [Official Virtusa referral ATS](https://virtusapolaris.referrals.selectminds.com/jobs/pega-ba-79738) | 3.1/5 | Live. Apply for Job present. Posted 2026-07-30 (103 days) | Skip |
| — | Accenture | Business Analyst — ATCI-5492055-S2005583 | [Official job page](https://www.accenture.com/in-en/careers/jobdetails?id=ATCI-5492055-S2005583_en&title=Business+Analyst) | 3.2/5 | Live. schema.org JobPosting. Apply for this job. Bengaluru | Skip — not Hyderabad or Remote India |

TCS verification: a rendered official page shows title "Pega Business Analyst", Location Hyderabad, Experience 8–12 Years, Exp Range 8+ Years, job ID 430542, Skills Pega, "Apply By: 31st December 2026", and Apply controls. Responsibilities are BA work (requirements, Pega alignment, stakeholder management, mentoring business analysts). The same page labels Function "IT INFRASTRUCTURE SERVICES" and Role "Developer". Compensation is not stated. `config/profile.yml` is not in this checkout, so experience, notice period, and the compensation floor were not re-read and are not copied here. Score is 4.0 for an ATS-verified Pega BA plus 0.2 for Hyderabad, and it stays at 4.2 because of the Developer metadata label, the 8–12 year band, and the missing compensation line.

Virtusa CREQ264873: title Pega BA, requisition CREQ264873, category "Architect (Level: Manager)", location string "Hyderabad, Andhra Pradesh, India", post date 30 Jul 2026. The JD line says Job Location Hyderabad, so this is not an Andhra-only posting. The JD requires 10+ years of business analyst experience, 3+ years with Pega, a Pega certification, and a notice window of 0 to 15 days. Scoring stays 3.1. Compensation is not stated.

Accenture Bengaluru remains a real Pega BA posting (required skill Pega Platform, minimum 7.5 years in Pega BA, "This position is based at our Bengaluru office"). It is outside the Hyderabad-only rule.

### 3. Unverified / dropped
- **Virtusa P-100973** ([main careers URL](https://www.virtusa.com/careers/job-search/global/en/job/P-100973/Senior-Consultant)): HTTP 403, Akamai Access Denied, same as `virtusa.com/careers/in/hyderabad`. A keyword search for Pega on the referral board returned **23 results**. The Hyderabad location facet on that search is 11. The Hyderabad Pega BA card is still CREQ264873. **Pega Business Analyst** (Senior Pega BA snippet) is Dubai. P-100973 is not in the result cards. **Do not apply.**
- **Virtusa referral board, other Pega hits:** Hyderabad cards besides CREQ264873 are Pega Constellations (Lead Software Engineer) and non-BA titles. Also Bangalore Pega CLM, Chennai Pega Senior Systems Architect (two), Canada/US LSA and developer roles. Skip.
- **Wipro:** official RSS for `(pega) AND locationSearch:(Hyderabad)`, built 2026-11-10 03:36 UTC, says "No jobs currently available." A global `pega` RSS has India developer, solution-architect, and techno-functional titles in Bengaluru, Chennai, and Pune, and no Hyderabad item. The previous Technical Lead pages ([204847](https://careers.wipro.com/job/Hyderabad-TECHNICAL-LEAD-L1-IND-500032/204847-en_US/), [204848](https://careers.wipro.com/job/Hyderabad-TECHNICAL-LEAD-L1-IND-500032/204848-en_US/)) return a generic Job Details shell with no PEGA text and no Apply control. Still closed.
- **Pegasystems:** sitemap has 76 job URLs. **15** pages contain the location line "India - Telangana - Hyderabad", matching the facet count of 15 (yesterday 14). The new Hyderabad page is [Senior Systems and Storage Engineer](https://www.pega.com/about/careers/24137/senior-systems-and-storage-engineer), with Apply now. The other 14 are Senior System Architect (five), System Architect, Senior Applications Engineer (two), Application Engineer for Marketing Operations (CSA/CSSA), Senior Manager Consulting, Senior Manager Solutions Consulting India, Payroll Specialist, Senior Payroll Specialist, and Associate Project Delivery Leader. No Business Analyst or non-lead Business Architect in Hyderabad. **Lead Business Architect** is still [US - Georgia - Remote](https://www.pega.com/about/careers/24139/lead-business-architect) with Apply now. **Lead Pega Business Architect** [24041](https://www.pega.com/about/careers/24041/lead-pega-business-architect) is now HTTP 404, title "Looking for something?", and it is no longer in the sitemap. Skip.
- **Accenture Workday** search text "Pega Business Analyst": Hyderabad facet count 1. Paging that result set found two Hyderabad cards, both titled Custom Software Engineer (ATCI-5107007-S1890714 and ATCI-5710687-S2065408). No Hyderabad Business Analyst title in that set. The Bengaluru Pega BA above is the only analyst title confirmed on the official job page.
- **Deloitte USI** `search=Pega` (`data-total="5"`): Senior Software Engineer, GESTC, Pega, .NET & Integration (Hyderabad); Applied AI Platform Engineer (PEGA Systems Engineer) as Lead Software Engineer I and as Software Specialist Engineer II (Multiple Locations); Consultant, GESTC Tier 2 product support (Hyderabad); Senior Software Engineer, Workflow .NET, GESTC (Hyderabad). A separate Business Analyst search (`data-total="65"`) has no Pega text on the results page.
- **Lloyds Technology Centre** Workday search "Pega": 1 job, Lead Software Engineer, Hyderabad Knowledge Park, req 163071, posted 30+ days ago. Search "Business Analyst": Head of Digital Marketing Data, AI & Operations (posted 6 days ago) and Insight Analyst (posted 10 days ago). Neither is a Pega BA.
- **Capgemini** official RSS for Pega AND Hyderabad: "No jobs currently available."
- **LTM** `careers.ltm.com` RSS for Pega AND Hyderabad: "No jobs currently available." The LTIMindtree careers URL redirects to the LTM marketing page.
- **Truviq:** the prior PEGA Business Analyst Zoho URL still says the posting is no longer available. Open titles include PEGA CSSA (Bangalore city on the posting record), PEGA CLSA, Decisioning, and Constellation (Hyderabad), plus Pega LBA - US in Chicago, Illinois. No India BA title.
- **Credera:** rendered page says "No open positions found."
- **Tenth Revolution** Pega + Hyderabad: "No job listings found."
- **Eclatprime** `/careers/` and `/pega-ba/`: both HTTP 404.
- **Instasmart** Zoho Recruit: "Page does not exist."
- **Areteans** `/job-listing/` is still the Credera stub with static PEGA CLM/KYC product-engineer text, not a BA apply button.
- **Religent:** `/careers/` is a job list again (yesterday it was a parking page). Ten open titles, all Hyderabad: Camunda Administrator, SAP PI/PO Consultant, Pega Developer – Banking Domain, CAMUNDA Architect, Pega Administrator, Pega Developer with Constellation, Pega Developer (CSA/CSSA), Full Stack Developer, GCP Data Engineer, Testing Engineer. No Business Analyst title.
- **Sutherland** homepage loaded (HTTP 200) with a city widget. The keyword search URL returned HTTP 404, and the Pega keyword was not executed, so this is **not a confirmed keyword zero**.
- **Cognizant** keyword Pega and location Hyderabad: Cloudflare "Just a moment" (HTTP 403). **Not a confirmed zero.**
- **Infosys** `career.infosys.com/joblist`: Akamai Access Denied. `digitalcareers.infosys.com` loaded a global careers shell and did not apply the Pega keyword. **Not a confirmed zero.**
- **Perficient** careers page hit a Vercel security checkpoint (HTTP 429). Not a confirmed zero.
- **ArcelorMittal** `careers.arcelormittal.com` and `jobs.arcelormittal.com`: DNS does not resolve. The corporate careers URL returned HTTP 403. Unreachable, not a confirmed zero.

### 4. Pipeline updates
- This checkout has no `data/pipeline.md`, `data/contacts.md`, or `config/profile.yml`. Comparison is against the last committed scan, 2026-11-09. No personal values from those files are copied here. `output/target-companies-playbook-2026-05-19.md` is not in the repo.
- **TCS 430542:** was unverified yesterday because the JD did not render. Today the official page shows the Pega Business Analyst description and Apply controls. Newly reconfirmed. Still the same req, apply-by 31 Dec 2026. Conditional on the posted 8–12 year band.
- **Wipro 204847 and 204848:** unchanged. Still absent from the official Hyderabad Pega RSS, and the job URLs still show no JD.
- **Virtusa CREQ264873:** unchanged — still live, still a 3.1/5 skip. Posted 30 Jul 2026, now 103 days old.
- **Virtusa P-100973:** not newly live. Still absent from the Pega referral results. Main careers host is Access Denied again. Keep it closed.
- **Accenture Bengaluru Pega BA (ATCI-5492055-S2005583):** still live on the official job page. Still out of city.
- **Pega Lead Business Architect (Georgia):** still live, still Lead track, still outside Hyderabad.
- **Pega Lead Pega Business Architect (Florida, 24041):** newly closed. Official URL is 404 and the sitemap no longer lists it.
- **Pegasystems Hyderabad:** facet and page count are 15, up from 14. The added posting is Senior Systems and Storage Engineer. No new BA.
- **Religent:** careers URL is a live job list again. Still no Pega BA.
- **#73 Eclatprime PEGA BA:** unchanged — both URLs still 404.
- **#064 Truviq PEGA BA:** unchanged — official Zoho page still says the posting is no longer available.
- No eligible Hyderabad Pega BA was found on Deloitte USI, Lloyds, Truviq, Credera, Tenth Revolution, Pegasystems, Accenture, LTIMindtree/LTM, or Capgemini.

### 5. Today's action list
1. **Conditional apply — TCS iBegin.** Open [job 430542](https://ibegin.tcsapps.com/candidate/next/en-IN/jobs/430542J). Apply with the existing resume only if total experience is inside the posted 8–12 year band. Do not tailor the resume. Compensation is not on the JD; do not invent a figure if the form asks for one.
2. **Do not apply to TCS if experience is under 8 years.** The official line is 8–12 years and "Exp Range: 8+ Years".
3. **Skip Virtusa CREQ264873.** It is live on the referral ATS and still asks for 10+ years and a 0–15 day notice window. It is 103 days old.
4. **Do not force Virtusa P-100973.** It is not on the Pega referral results. The standing A&G question stays with the existing Virtusa contact. No new application.
5. **No other applications today.** Leave the Wipro Technical Lead URLs, the Accenture Bengaluru role, the Pega Georgia Lead Business Architect, the closed Florida posting, #73, and #064 alone. Named warm outreach is not possible from this run because `data/contacts.md` is not in the checkout.

### 6. Scan log
- Checked the 20 requested official portals plus TCS iBegin 430542.
- Eligible live Hyderabad Pega BA roles on an ATS: 2 (TCS 430542 conditional, Virtusa CREQ264873 skip). Net-new postings: 0. Apply-worthy roles: 1, and only if the posted 8–12 year band matches.
- TCS 430542 was reconfirmed after yesterday's blank render. Wipro Hyderabad Pega RSS is still empty. P-100973 stayed closed on the referral board. Pega Florida 24041 closed. Pega Hyderabad gained a systems-engineer req, not a BA.
