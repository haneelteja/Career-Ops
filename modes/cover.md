# Mode: cover — Cover Letter Draft (fork)

Draft a tailored cover letter for Haneel's Pega BA / Senior BA applications.
**Draft only — never send.** PDF generation uses the existing CV HTML/PDF path when available; otherwise deliver markdown in chat + `output/`.

## Invocation

- `/career-ops cover` + pasted JD
- `/career-ops cover {report-number}` — load matching `reports/{NNN}-*.md`
- Or: "write cover letter for Virtusa P-100973"

## Steps

1. **Load** `config/profile.yml`, `cv.md`, `modes/_profile.md`
2. **Parse JD** — role, company, top requirements, location, domain
3. **Research** — 2–3 WebSearch queries on company priorities (current year)
4. **Gap check** — flag domain mismatch, notice period, title mismatch; ask how to handle
5. **Draft in chat** — structure below; wait for approval before writing files
6. **On approval** — save `output/{company-slug}-{role-slug}-cover.md` (and HTML/PDF only if `generate-pdf.mjs` / templates already support it)

## Letter structure

```
[Name] | [Location] | [Email] | [Phone] | [LinkedIn]

Cover Letter: [Role]
[Company], [City]   [Date]

Opening (2 sentences) — why this role, mirrored JD vocabulary
Profile intro (1 short paragraph) — CPBA+CSSA, 7+ yrs, Novitates BA path
Achievements (4–5 bullets) — exact metrics from cv.md only
Problems I will solve (2–3 sentences) — company-specific from research
Closing — 45-day notice, Hyderabad, ask for conversation
```

## Hard rules

- Never invent employers, metrics, domains, or certifications
- Never claim healthcare / Appeals & Grievances unless it appears in `cv.md`
- Active voice; no "I am excited to"; 350–420 words body
- Mirror JD keywords only where they fit real experience
- If score from report is &lt; 4.0, recommend against investing in a letter unless user overrides

## Output

After approval, write:

`output/{company-slug}-{role-slug}-cover-YYYY-MM-DD.md`

Optionally note path in the evaluation report under `## Cover Letter Draft`.
