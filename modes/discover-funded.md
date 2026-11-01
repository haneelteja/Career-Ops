# Mode: discover-funded — Funded company discovery (lightweight fork)

Surface recently funded companies that might hire Pega BA / Senior BA talent.
**Review-first — never auto-apply. Never edit tracker unless user asks.**

## Invocation

`/career-ops discover-funded` or "find funded companies hiring BA in Hyderabad / India"

## Steps

1. WebSearch (use current year):
   - `"Series A" OR "Series B" OR "Series C" funding India fintech OR insurtech OR banking {year}`
   - `"raised" funding Hyderabad SaaS OR enterprise software {year}`
   - `Pega partner funding OR "digital transformation" funding India {year}`
2. For each interesting company (max 8):
   - Note funding round, date, domain
   - Find official careers URL
   - Search careers for: Business Analyst, Business Architect, Pega, Product Owner
3. Output a table:

| Company | Round | Domain | Careers URL | BA/Pega hit? | Next step |
|---------|-------|--------|-------------|--------------|-----------|

4. Tier-1 only for apply recommendations (official ATS). Aggregator hits = UNVERIFIED.
5. Suggest warm intros from `data/contacts.md` when no ATS hit.

## Hard rules

- Do not invent funding facts — cite search snippet / date
- Hyderabad or Remote India preferred
- Skip pure engineering / data-science-only shops unless BA role exists
- Save optional report: `output/funded-discovery-YYYY-MM-DD.md`
