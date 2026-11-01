# Local app + daily automation (Haneel fork)

## 1. Local product UI (no cloud login)

Career-Ops remains agent-driven. This fork adds a **localhost web app** for inbox / actions / dashboard:

```bash
npm run app
# Dashboard: http://127.0.0.1:8787/
# App shell:  http://127.0.0.1:8787/app
# JSON API:   http://127.0.0.1:8787/api/state
```

Optional gate (still local-only):

```bash
CAREER_OPS_TOKEN='your-local-secret' npm run app
# then: Authorization: Bearer your-local-secret
```

Rebuild dashboard only:

```bash
npm run dashboard
```

Artifacts live under `output/dashboard/` (gitignored). Nothing is published to Vercel/GitHub Pages.

---

## 2. Daily automation → **main only**

Prompt: `prompts/daily-pega-ba-scan.md`

Rules enforced by `scripts/commit-daily-scan.mjs`:

- Must be checked out on **`main`**
- May commit only `output/daily-pega-ba-scan-YYYY-MM-DD.md`
- Refuses if personal files are dirty (`profile.yml`, `pipeline.md`, `contacts.md`, …)

### Cursor / Claude automation settings

| Setting | Value |
|---------|--------|
| Repo | `https://github.com/haneelteja/Career-Ops` |
| Branch | **`main`** (never create `cursor/daily-*` branches) |
| Schedule | **09:00 IST daily** (cron UTC equivalent: `30 3 * * *`) |
| Prompt | Follow `prompts/daily-pega-ba-scan.md` in the repo (includes commit/push steps) |
| After report | **Required:** `node scripts/commit-daily-scan.mjs output/daily-pega-ba-scan-YYYY-MM-DD.md` then `git push origin main` |
| Forbidden | New branches, PRs, committing `profile.yml` / `pipeline.md` / `contacts.md` |

### Preferred scan command (anti-bot)

```bash
npm run scan:ats -- --headed
# optional durable Chrome profile (survives more Cloudflare walls):
CAREER_OPS_USER_DATA_DIR="$HOME/Library/Application Support/CareerOpsChrome" \
  CAREER_OPS_HEADED=1 npm run scan:ats
```

Do **not** rely on Naukri / Indeed / LinkedIn for apply recommendations.

---

## 3. Generic apply helper

```bash
node scripts/apply-url.mjs --headed "https://…/job/…"
```

Prefills name/email/phone/CTC/notice/resume from `config/profile.yml`. **You click Submit.**

Legacy one-offs (`fill-truviq-064.mjs`, `apply-sdna-052.mjs`) remain for historical reqs only.

---

## 4. New agent modes

| Mode | File | Purpose |
|------|------|---------|
| cover | `modes/cover.md` | Cover letter draft |
| email | `modes/email.md` | Application / follow-up / referral email drafts |

---

## 5. Virtusa P-100973

See `output/virtusa-p-100973-decision-2026-11-01.md`.  
Default: **SKIP** (no A&G/healthcare on CV) unless Pradeep confirms the gate is soft and CTC ≥ ₹10L.
