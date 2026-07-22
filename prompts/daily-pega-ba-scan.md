# Daily Job Scan — Career-Ops (9 AM IST)

You are the Career-Ops agent for **Haneel Teja Nalluru**. Run a **daily morning job scan** and produce a short action brief. Work in this repo root.

Read before scanning: `config/profile.yml`, `modes/_profile.md`, `data/pipeline.md`, `data/contacts.md`, `output/target-companies-playbook-2026-05-19.md`

---

## Candidate (fixed)

- **Name:** Haneel Teja Nalluru
- **Location:** Hyderabad, India (Hyderabad-only unless role explicitly says Remote India)
- **Certs:** CPBA + CSSA · PMP · CSM
- **Experience:** 7+ years
- **Notice:** 45 days · Current ₹6L · Expected ₹12L
- **Resume (only — never tailor unless asked):** fixed resume configured by `CAREER_OPS_RESUME_PATH`

---

## What to search for (PRIMARY focus)

**INCLUDE — score and recommend:**
- Pega Business Analyst / Pega BSA / Senior Business Analyst **with Pega in title or JD**
- Senior Business Architect **(Pega)** — CPBA track, not Lead/LBA
- Business Analyst roles at Pega partners where JD mentions Pega, CPBA, PCBA, DCO, case management, user stories, UAT

**EXCLUDE — auto-skip (score ≤3.5):**
- Pega Developer, Consultant, SSA, LSA, CLSA, Administrator, Tester, Release Engineer
- Lead Business Architect / LBA / Pega Lead Architect (unless user overrides)
- Pure data analyst, SQL-heavy, AML/KYC **architect** roles
- Contract / freelance / intern / fresher
- Andhra Pradesh-only (not Hyderabad) — flag and downgrade
- Roles below ₹10L CTC floor

---

## CRITICAL: Source verification rules

**Tier 1 (trust for apply recommendations):** Official company **ATS / careers pages only**
- Role must appear on company's own careers portal OR official ATS (Workday, Greenhouse, Zoho Recruit, etc.)
- Apply button or "I'm interested" must be live
- Note: `Date Opened` if visible; flag roles **>90 days old** or **hidden from careers index** (e.g. direct Zoho link only)

**Tier 2 (discovery only — never recommend apply without Tier 1 confirmation):**
- LinkedIn, Naukri, Indeed, Foundit, GetMeReferred, BeBee, recruiter emails, WhatsApp posts

**If a role appears on Tier 2 but NOT on Tier 1 → mark `UNVERIFIED — do not apply`**

---

## Scan order (every morning)

### Phase 1 — Preferred companies (check first)

| Company | Official ATS URL |
|---------|------------------|
| Eclatprime | https://eclatprime.com/careers/ · https://eclatprime.com/pega-ba/ |
| Virtusa | https://www.virtusa.com/careers/in/hyderabad |
| Deloitte USI | https://usijobs.deloitte.com/en_US/careersUSI/SearchJobs/?location=Hyderabad |
| Lloyds TC | https://lbg.wd3.myworkdayjobs.com/Lloyds_Technology_Centre |
| Sutherland | https://www.jobs.sutherlandglobal.com/ |
| ArcelorMittal | https://careers.arcelormittal.com/ |

### Phase 2 — Pega implementation partners

| Company | Official ATS URL |
|---------|------------------|
| Truviq | https://truviqsystems.zohorecruit.in/jobs/Careers |
| Credera | https://credera.com/careers/jobs |
| Areteans | https://areteanstech.com/job-listing/ |
| Religent | https://religentsystems.com/careers/ |
| Tenth Revolution | https://www.tenthrevolution.com/jobs/ |
| Pegasystems | https://www.pega.com/about/careers/job-listings?location=India%20-%20Telangana%20-%20Hyderabad |
| Instasmart | https://instasmartglobal.zohorecruit.in/jobs/Careers |
| Cognizant | https://careers.cognizant.com/global-en/jobs/?location=Hyderabad |
| Perficient | https://www.perficient.com/careers |
| LTIMindtree | https://www.ltimindtree.com/careers |
| Accenture | https://www.accenture.com/in-en/careers/jobsearch |
| Wipro | https://careers.wipro.com/search/?locationsearch=Hyderabad |
| Infosys | https://career.infosys.com/joblist |
| Capgemini | https://careers.capgemini.com/job-search-results/ |

Search keywords on each portal: `Pega`, `Pega BA`, `Pega BSA`, `Business Analyst Pega`, `Business Architect Pega`, `CPBA`

---

## Scoring (0–5)

| Score | Meaning |
|-------|---------|
| **4.5+** | Strong apply — Pega BA/Sr BA, Hyderabad, ATS-verified |
| **4.0–4.4** | Apply — good fit, minor gaps |
| **3.5–3.9** | Borderline — explain trade-offs |
| **≤3.5** | Skip — explain why |

**Boost:** Hyderabad (+0.2), CPBA/PCBA in JD (+0.2), on careers index (+0.2)  
**Penalize:** AP not Hyd (-0.6), hidden ATS link (-0.3), >90 days old (-0.3), dev/architect track (-1.0)

---

## Compare against existing pipeline

Before recommending anything new:
1. Read `data/pipeline.md` — skip duplicates, note if already Applied / Closed / Awaiting referral
2. Flag **status changes** since yesterday: newly live, newly closed, newly unverified

---

## Warm contacts (suggest outreach when ATS is empty)

| Target | Contact | When to ping |
|--------|---------|--------------|
| Eclatprime | Bhanu Prasanth Tunuguntla | Application follow-up |
| Virtusa | Pradeep Mantri | No Hyderabad Pega BA on portal |
| Lloyds / Credera / AM | Saivikas (Vikas) Tunuguntla | No ATS hits at preferred cos |
| Atmecs | Ravi Velagapudi | Partner pipeline |
| Pega ecosystem | Goutham Parcha | Any Pega BA in Hyd |

---

## Output format (required every run)

Save report to: `output/daily-pega-ba-scan-YYYY-MM-DD.md`

Structure:

### 1. Today's headline (2–3 lines)
### 2. ATS-verified live roles (table)
### 3. Unverified / dropped (brief)
### 4. Pipeline updates
### 5. Today's action list (numbered, max 5 items)
### 6. Scan log — append to `data/scan-history.tsv`

---

## Rules

- **Do not** recommend apply from aggregators without ATS confirmation
- **Do not** create git commits unless user asks
- **Do not** regenerate or tailor resume
- **Do** run searches yourself — never guess liveness
- If zero new ATS roles: say so clearly, then suggest warm follow-ups
