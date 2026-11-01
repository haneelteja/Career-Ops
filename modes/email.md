# Mode: email — Application / Follow-up Email Drafts (fork)

Generate a formal email the candidate can paste into Gmail/Outlook.
**Never send. Never click Send. Draft only.**

## Invocation

| Input | Behavior |
|-------|----------|
| `/career-ops email {NNN}` | Draft from `reports/{NNN}-*.md` |
| `/career-ops email` + JD | Draft cold application email |
| `/career-ops email followup {NNN}` | Post-apply follow-up |
| `/career-ops email referral {company}` | Ask warm contact for referral |

## Load

- `config/profile.yml`, `cv.md`, `modes/_profile.md`
- Matching report if numbered
- `data/contacts.md` for referral targets (gitignored — do not paste contact lists into git)

## Variants

### A. Cold / recruiter application

Subject: `{Role} — {Name}, CPBA + CSSA, Hyderabad`

Body:
1. One-line who you are + role you're applying for
2. 3 fit points from cv.md / report (metrics only if in CV)
3. Notice 45 days · Hyderabad · expected CTC from profile if asked
4. Attach resume path note (do not invent attachments)

### B. Follow-up (already applied)

Subject: `Follow-up — {Role} application ({Name})`

Body: applied date, role still of interest, ask status, offer to resend resume.

### C. Referral ask (LinkedIn/WhatsApp can reuse shorter form)

Subject optional. Body: specific role URL + why fit + ask for referral/intro — not "any job".

## Hard rules

- Never claim healthcare / A&G / domain experience absent from `cv.md`
- Never fabricate interview times or prior conversations
- Keep ≤180 words unless user asks for longer
- End with explicit: "Draft only — review and send yourself"

## Output

Show draft in chat. On request, save:

`output/{company-slug}-email-{variant}-YYYY-MM-DD.md`
