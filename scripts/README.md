# Custom scripts (personal layer)

These scripts are local customizations for a Pega BA / Hyderabad search. The
upstream updater (`update-system.mjs`) never touches files in this folder except
the few upstream-owned ones it lists by name, so they survive updates.

**No personal data is committed here.** Every name, phone number, CTC figure and
CV summary is read from `config/profile.yml`, which is gitignored. Private notes
such as `data/contacts.md` are gitignored too.

| Script | What it does |
|--------|--------------|
| `pega-dashboard.mjs` | Builds the review dashboard → `output/dashboard/index.html` (gitignored, local only). `npm run dashboard` |
| `profile-config.mjs` | Shared loader for the `config/profile.yml` values below |
| `apply-batch-targets.mjs` | Opens apply targets and prefills notice/CTC/location. You click Submit |
| `apply-sdna-052.mjs`, `fill-truviq-064.mjs`, `open-unico-email.mjs` | One-off helpers for specific postings |
| `scrape-india-jobs.mjs`, `fresh-pega-ba-search.mjs`, `deep-pega-ba-scan.mjs` | LinkedIn/company-page scrapers → `output/` |

The dashboard is no longer published to `docs/` or Vercel: it holds your whole
pipeline plus contact details, and the repository is public. Open
`output/dashboard/index.html` in a browser instead.

## Keys read from `config/profile.yml`

Add these alongside the standard keys from `config/profile.example.yml`
(placeholder values shown):

```yaml
candidate:
  full_name: "Your Name"
  email: "you@example.com"
  phone: "+91 90000 00000"
  location: "Hyderabad, India"
  linkedin: "linkedin.com/in/your-handle"

compensation:
  minimum: "₹10L"           # floor used by the daily scan prompt
  current_ctc: 600000       # plain number, used in application forms
  expected_ctc: 1200000

cover_letter:
  notice_period_days: 45

dashboard:
  city: "Hyderabad"                     # optional; defaults to first part of candidate.location
  experience: "7+ years"
  current_company: "Current Employer Pvt. Ltd."
  current_title: "Sr. Business Architect"
  work_authorization: "Indian Citizen — no sponsorship required"
  expected_ctc_label: "₹12L CTC (open to discussion)"
  salary_script: "Based on my experience, I am targeting ..."
  ats_keywords: "Business Analyst, Requirements, Agile, PEGA CPBA, ..."
  cv_pdf_prefix: "cv-your-name"         # optional; defaults to cv-<full_name slug>
  resume_path: "/absolute/path/to/resume.pdf"  # or set CAREER_OPS_RESUME_PATH
  summaries:
    pega: "PEGA Certified Business Architect ..."
    product_owner: "Certified Product Owner ..."
    default: "Certified Business Architect ..."
  cover_letter:
    intro: "I am writing to apply for the {role} position at {company}. ..."
    differentiator: "What sets me apart is ..."
    default_points:
      - "first fallback selling point"
      - "second fallback selling point"
      - "third fallback selling point"
```
