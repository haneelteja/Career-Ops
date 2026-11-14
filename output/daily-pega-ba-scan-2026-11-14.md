# Daily Pega BA Scan — 2026-11-14

### 1. Today's headline
- **0 net-new ATS-verified Hyderabad Pega BA roles, and nothing cleared the apply bar.**
- **TCS iBegin 430542 is still live.** The official page and job API show Pega Business Analyst, Hyderabad, experience 8–12 years, and Apply. The same page labels the role Developer. That stays a skip.
- Wipro 204847 and 204848 now say the job is not available. Sutherland's official `keyword=pega` result is one Bucharest engineering role, not a Hyderabad BA.

### 2. ATS-verified live roles

| Priority | Company | Role | ATS link | Score | Status | Action |
|---|---|---|---|---:|---|---|
| — | TCS | Pega Business Analyst — 430542 | [Official TCS iBegin](https://ibegin.tcsapps.com/candidate/next/en-IN/jobs/430542J) | 3.4/5 | Live. Hyderabad. 8–12 years. Apply shown twice. Apply by 2026-12-31. Role labeled Developer | Skip |
| — | Accenture | Business Analyst — ATCI-5492055-S2005583 | [Official job page](https://www.accenture.com/in-en/careers/jobdetails?id=ATCI-5492055-S2005583_en&title=Business+Analyst) | 3.2/5 | Live. Apply for this job. Bengaluru. Required skill Pega Platform. Minimum 7.5 years in Pega BA. datePosted was not in today's HTML | Skip — not Hyderabad or Remote India |

TCS verification: the rendered official page and `GET /candidate/next/api/en-IN/job/desc/430542` both return title "Pega Business Analyst", location Hyderabad, experience "8 - 12 Years", role "Developer", skills Pega, and Apply. Responsibilities are BA work. Compensation is not stated. The band and Developer label are unchanged, so the score stays at 3.4. Personal values are not copied here.

Accenture Bengaluru remains a real Pega BA posting ("This position" header is Bengaluru, Apply for this job is present, must-have skill Pega Platform, minimum 7.5 years in Pega BA). It is outside the Hyderabad-only rule. A related line on the same page says "Hyderabad | Full time | Experience: 5-10 years" and does not include a job title, so it is not treated as a second posting.

### 3. Unverified / dropped
- **Virtusa CREQ264873** ([referral ATS](https://virtusapolaris.referrals.selectminds.com/jobs/pega-ba-79738)): HTTP 503, title "Zone Maintenance". The body says the Oracle Cloud environment is currently unavailable. The Pega search on the same host is the same maintenance page. **Not reconfirmed live today.** Not treated as newly closed. Last readable state (2026-11-11) was a 3.1/5 skip: 10+ years, notice window 0–15 days, posted 2026-07-30 (now 107 days if that date still holds).
- **Virtusa P-100973** ([main careers URL](https://www.virtusa.com/careers/job-search/global/en/job/P-100973/Senior-Consultant)): HTTP 403, Akamai Access Denied, same as `virtusa.com/careers/in/hyderabad`. The referral board could not be searched. **Do not apply.**
- **Wipro:** official RSS for `(pega) AND locationSearch:(Hyderabad)`, built 2026-11-14 03:41 UTC, says "No jobs currently available." A global `pega` RSS has 14 items. India titles are solution architect, techno-functional consultant, and developer in Bengaluru, Chennai, and Pune. No Hyderabad item. The previous Technical Lead pages ([204847](https://careers.wipro.com/job/Hyderabad-TECHNICAL-LEAD-L1-IND-500032/204847-en_US/), [204848](https://careers.wipro.com/job/Hyderabad-TECHNICAL-LEAD-L1-IND-500032/204848-en_US/)) now say "You can't view this job because it's not available at this time." **Newly explicit closed.**
- **Pegasystems:** sitemap has 73 career URLs (yesterday 72). The Hyderabad location filter renders "Showing 14 results," each with a Learn More and Apply link. One of those, Senior System Architect [23914](https://www.pega.com/about/careers/23914/senior-system-architect), is still HTTP 404, so the live set is still the non-BA list: Senior System Architect, System Architect, Senior Applications Engineer, Application Engineer for Marketing Operations, Senior Manager Consulting, Senior Payroll Specialist, Associate Project Delivery Leader, Senior Systems and Storage Engineer, and Principal ATP Instructor. Spot-check [24111](https://www.pega.com/about/careers/24111/senior-system-architect) is Senior System Architect with location "India - Karnataka - Bangalore | India - Telangana - Hyderabad". No Business Analyst or non-lead Business Architect slug is in the sitemap. **Lead Business Architect** is still [US - Georgia - Remote](https://www.pega.com/about/careers/24139/lead-business-architect) with Apply now. **Lead Pega Business Architect** [24041](https://www.pega.com/about/careers/24041/lead-pega-business-architect) is still HTTP 404. Skip.
- **Accenture** India job search with keyword Pega did not lock to Hyderabad. The page says these are the 10,000 newest listings. The first visible card was Customer Service Associate in Gurugram. A Hyderabad-only zero is **not** claimed. The known Bengaluru Pega BA above is still the only analyst title confirmed on an official job page.
- **Deloitte USI** `search=Pega` (`data-total="5"`): the same five engineering titles as yesterday (GESTC Pega/.NET, two Applied AI Platform Engineer PEGA roles, GESTC Tier 2 product support, GESTC Workflow .NET). A Business Analyst keyword search with the Hyderabad location parameter (`data-total="86"`, yesterday's unlocked count was 84) has no Pega text in the results. No Pega BA.
- **Lloyds Technology Centre** Workday search "Pega": 1 job, Lead Software Engineer, Hyderabad Knowledge Park, req 163071, posted 30+ days ago. Search "Business Analyst": Insight Analyst only (posted 14 days ago, req 165604). Neither is a Pega BA.
- **Capgemini** global Pega RSS, built 2026-11-14 03:41 UTC, has 20 items and no Hyderabad posting. Visible Pega BA and Business Architect titles are in Berlin, Wrocław, and Vienna. The India item in that feed is Marketing AI and Personalization SME in Bangalore. The Hyderabad-scoped RSS query did not return a usable feed. The careers search page stayed on the cookie shell.
- **LTM** `careers.ltm.com` global Pega RSS loaded once and said "No jobs currently available." A later fetch of the same host returned HTTP 503. The LTIMindtree careers URL still redirects to the LTM marketing page.
- **Truviq:** 20 open titles on the Zoho careers index (India 17, United States 2, Canada 1). No India Business Analyst title. Pega titles include PEGA CSSA (Bangalore), PEGA CLSA, Decisioning, and Constellation (Hyderabad), plus Pega LBA - US. Hyderabad Delivery Manager remains a delivery-track role.
- **Credera:** rendered page says "No open positions found."
- **Tenth Revolution** Pega + Hyderabad: HTTP status 403, and the rendered board says "NO JOB LISTINGS FOUND."
- **Eclatprime** `/careers/` and `/pega-ba/`: both HTTP 404.
- **Instasmart** Zoho Recruit: "Page does not exist."
- **Areteans** `/job-listing/` rendered as the Credera marketing home, not a BA apply button.
- **Religent:** `/careers/` first screen is still the same ten Hyderabad titles (Camunda Administrator, SAP PI/PO, Pega Developer – Banking Domain, CAMUNDA Architect, Pega Administrator, Pega Developer with Constellation, Pega Developer CSA/CSSA, Full Stack Developer, GCP Data Engineer, Testing Engineer). Load more adds Pega Smart Claims, Pega PRPC, Pega CLSA, SAP ABAP, Senior Java, and Appian Developer. No Business Analyst title.
- **Sutherland:** the city facet on the board shell still shows Hyderabad (23). The India hash did not switch that shell, so yesterday's India-scoped "0 positions" was not remeasured. The official results URL with `keyword=pega` returned "Your search resulted in: 1 position": Forward Deployed Engineer, Bucharest, Romania, hybrid, posted 28 days ago (16/10/2026), with Apply Now. That is an engineering title outside Hyderabad. Skip.
- **Cognizant** keyword Pega and location Hyderabad: "Displaying 0 to 0 of 0 matching jobs." Confirmed keyword zero.
- **Infosys** `career.infosys.com/joblist`: Akamai Access Denied. `digitalcareers.infosys.com` keyword `pega` shows 7 jobs. The only Business Analyst is Mississauga, Canada. No Hyderabad item. The India careers host is **not** a confirmed zero.
- **Perficient** careers page hit a Vercel security checkpoint (HTTP 429). Not a confirmed zero.
- **ArcelorMittal** `careers.arcelormittal.com` and `jobs.arcelormittal.com`: DNS does not resolve. The company's SmartRecruiters board says "No job postings are currently available."

### 4. Pipeline updates
- This checkout has no `data/pipeline.md`, `data/contacts.md`, or `config/profile.yml`. Scoring used the candidate profile from the last committed scan. Personal values are not copied here. Comparison is against the last committed scan, 2026-11-13. `output/target-companies-playbook-2026-05-19.md` is not in the repo. The compensation floor was not rechecked against personal figures.
- **TCS 430542:** unchanged. Still live, still Hyderabad, still 8–12 years, still labeled Role Developer, still Apply. The job API returned the same fields. Skip.
- **Virtusa CREQ264873:** still behind Oracle zone maintenance. Not newly closed. Do not apply from yesterday's page.
- **Virtusa P-100973:** not newly live. Main careers host is Access Denied again. The referral search could not be read. Keep it closed. Do not force apply. The A&G question stays with the existing Virtusa contact.
- **Wipro 204847 and 204848:** newly explicit closed. Both URLs now say the job is not available. They remain absent from the official Hyderabad Pega RSS.
- **Accenture Bengaluru Pega BA (ATCI-5492055-S2005583):** still live on the official job page, Apply present. datePosted was not in today's HTML (yesterday recorded 2026-09-21). Still out of city.
- **Pega Lead Business Architect (Georgia):** still live, still Lead track, still outside Hyderabad.
- **Pega Lead Pega Business Architect (Florida, 24041):** still closed.
- **Pegasystems Hyderabad:** the filtered index shows 14 cards, up from yesterday's 13 live pages, because closed Senior System Architect 23914 is listed and still 404. No new BA. Sitemap career URLs: 73, up from 72, with no business-analyst slug.
- **Lloyds Business Analyst search:** still 1 result. Insight Analyst is now "Posted 14 Days Ago" (yesterday 13). The Pega result is still the Lead Software Engineer.
- **Deloitte Pega search:** still 5 engineering titles, none a BA. The Business Analyst keyword count moved from 84 to 86 and still has no Pega text.
- **Sutherland:** global `keyword=pega` returned 1 position, a Bucharest Forward Deployed Engineer. That is new relative to yesterday's India-scoped zero, and it is not a Hyderabad BA. The India-scoped count was not remeasured. The Hyderabad city facet is still 23.
- **Cognizant:** the official Pega + Hyderabad URL again rendered 0 matching jobs.
- **Religent:** Load more shows additional Pega developer, CLSA, PRPC, and claims titles. Still no Business Analyst.
- **#73 Eclatprime PEGA BA:** unchanged — both URLs still 404.
- **#064 Truviq PEGA BA:** unchanged — no India Business Analyst title on the official Zoho index.
- No eligible Hyderabad Pega BA was found on Deloitte USI, Lloyds, Truviq, Credera, Tenth Revolution, Pegasystems, Accenture, LTIMindtree/LTM, Capgemini, Sutherland, Cognizant, or Religent.

### 5. Today's action list
1. **Skip TCS.** [Job 430542](https://ibegin.tcsapps.com/candidate/next/en-IN/jobs/430542J) is live, with Apply, and the official band is still 8–12 years. The page also labels the role Developer. Leave the existing resume as it is.
2. **Leave the Virtusa referral link alone.** [CREQ264873](https://virtusapolaris.referrals.selectminds.com/jobs/pega-ba-79738) is behind an Oracle maintenance page. If the same 10+ year and 0–15 day notice lines are there when it returns, it stays a skip.
3. **Leave Virtusa P-100973 closed.** The main careers URL is Access Denied, and the referral board could not be searched. Leave the A&G question with the existing Virtusa contact. No new application.
4. **Treat the Wipro Technical Lead URLs as closed.** [204847](https://careers.wipro.com/job/Hyderabad-TECHNICAL-LEAD-L1-IND-500032/204847-en_US/) and [204848](https://careers.wipro.com/job/Hyderabad-TECHNICAL-LEAD-L1-IND-500032/204848-en_US/) now say the job is not available. No Hyderabad Pega role is on the official RSS.
5. **No other applications today.** The only new keyword hit is Sutherland's Bucharest Forward Deployed Engineer, which is out of city and off the BA track. Named warm outreach is not possible from this run because `data/contacts.md` is not in the checkout. Infosys India careers and Perficient were not confirmed empty.

### 6. Scan log
- Checked the 20 requested official portals plus TCS iBegin 430542, the Virtusa referral host, and the known Wipro and Pega job URLs. Method: Playwright render, plus official RSS and the TCS job API.
- Eligible live Hyderabad Pega BA roles on an ATS: 1 (TCS 430542), and it is a skip. Net-new postings: 0. Apply-worthy roles: 0.
- TCS 430542 was reconfirmed live with the same 8–12 year band and Developer role label. Virtusa's referral ATS is still in maintenance. Wipro 204847 and 204848 changed from an empty job shell to an explicit "not available" message. Pegasystems Hyderabad index shows 14 cards, with 23914 still a 404 and no new BA. Sutherland `keyword=pega` returned 1 Bucharest engineering role. Cognizant Pega + Hyderabad is still 0.
