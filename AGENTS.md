# Career-Ops for Codex

Read `CLAUDE.md` for all project instructions, routing, and behavioral rules. They apply equally to Codex.

Key points:
- Reuse the existing modes, scripts, templates, and tracker flow — do not create parallel logic.
- Store user-specific customization in `config/profile.yml`, `modes/_profile.md`, or `article-digest.md` — never in `modes/_shared.md`.
- Submit only when `config/profile.yml` → `application.auto_submit_after_verification` is `true` and the verification gate in `modes/apply.md` is complete; otherwise stop before Submit/Apply.
- Extra modes in this fork: `modes/cover.md`, `modes/email.md`.
- Local UI: `npm run app` → http://127.0.0.1:8787 (see `docs/LOCAL_APP_AND_AUTOMATION.md`).
- Daily scans must land on **`main`** via `scripts/commit-daily-scan.mjs` — never open `cursor/daily-*` branches.

For Codex-specific setup, see `docs/CODEX.md`.
