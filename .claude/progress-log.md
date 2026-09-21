# Progress Log — pedant-studios-web

---

## 2026-09-21 - Session End
**Status**: ended
**Branch**: main

**Accomplishments**:
- Renamed product WebCenter → Pedant Clok per `../pedant-clok-marketing-brief.md` (71e5ae4): `/webcenter` → `/clok` with 301 redirect (Astro config → Vercel output), full page rewrite (positioning line as H1, volume-tiered pricing $19/$16/$14, 30-day trial + lapse grandfathering, waitlist CTAs, paid-tier claims trimmed to feature matrix), header/footer/index/404/contact renamed, API routes accept `clok` + legacy `webcenter` values, privacy/terms updated (billing clause + dates). Deployed and verified live; user reviewed terms/privacy in browser and approved.
- Set up Dependabot (fe43dbc): weekly npm + github-actions, astro/tailwind groups + catch-all, minor+patch-only groups; vulnerability alerts + automated security fixes enabled via API.
- Merged 10 Dependabot PRs including the Astro 6→7.3.3 / @astrojs/vercel 10→11 / sharp 0.35.4 security major (d30f91b, fixed a critical AVIF RCE; verified locally + on Vercel preview before merge). Repo now at 0 open alerts, 0 open PRs.
- Retired the Astro major deferral: ignore list emptied, major-upgrade-watch workflow/script removed, issues #1/#2 closed (77740ab).

**WIP**:
- None. Working tree clean, all pushed, production verified (pedantstudios.com/clok 200, /webcenter 301, page content spot-checked on Astro 7).

**Next Steps**:
- [ ] (User action) Rename `RESEND_TOPIC_ID_WEBCENTER` env var in Vercel, then update its two refs in `src/pages/api/subscribe.ts` in the same change. Also check the topic's display name inside Resend — subscribers see it on unsubscribe/preferences pages.
- [ ] At app launch: swap the waitlist CTA on `/clok` for the real signup link (see brief §7).
- [ ] Eventually drop legacy `webcenter` values from `ALLOWED_LISTS`/`ALLOWED_TOPICS` in `src/pages/api/{subscribe,contact}.ts` (kept for cached pages).
- [ ] Weekly: review Monday Dependabot group PRs (Vercel preview = CI check).

**Blockers**:
- None.

**Active Plans**:
- None (no `.claude/plans/` in this repo).

**Quality Status**:
- Last Review: not reviewed (no /review run; verification was local builds + Vercel previews + live-prod curl checks)
- Unresolved Critical: None
- Accepted Risks: None

**Notes**:
- Sibling repo `../pedant-studios-docs` got the matching rename + Dependabot setup this session; its own progress-log has details. Umbrella docs (brief, brand decisions) live in the parent non-git folder `../`.
- Do NOT mention pedantclok.com (domain deliberately unpurchased) or Citosoft's "Clok" anywhere on the site. Composite mark "Pedant Clok" in headings/titles/LD-JSON.
- Facts source of truth: app repo `~/Projects/WebCenterReact` (`pricing.ts`, `feature-matrix.ts`) beats the marketing brief on conflict.
- This handoff commit is local-only (not pushed) to avoid triggering a pointless Vercel deploy; push whenever convenient.
