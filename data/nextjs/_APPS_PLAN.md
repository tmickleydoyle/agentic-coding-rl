# Complete-app dataset plan (target: 250 apps)

## PROGRESS (resume here) — 86 / 250 apps done & validated
- DONE & validated: themes 1-10 fully (task/book/fit/fin/shop/note/team/dev/learn/social, 50),
  plus most of themes 11-20 (blog/event/travel/food/estate/hr/crm/support/invent/stat).
- INCOMPLETE THEMES to FILL to 5 apps each (missing slugs to rebuild):
  - blog: `app-blog-series`, `app-blog-portfolio`
  - crm: `app-crm-quotes`
  - estate: `app-estate-openhouse`, `app-estate-rentals`
  - food: `app-food-calorie`
  - hr: `app-hr-directory`
  - invent: `app-invent-supplier`
  - stat: `app-stat-kpi`
  - support: `app-support-feedback`
  - travel: `app-travel-bucketlist`
  (14 apps; specs are in the wave-1/wave-2 prompts / theme list below.)
- NOT STARTED: themes **21-50** (chat→debt) = 30 themes × 5 = 150 apps.
- REMAINING TOTAL: 164 apps (14 + 150).
- Run in waves of ~10 agents (1 theme each, 5 apps), then `validate_one.sh` each; remove any
  partials/orphans (missing meta.json/description.md/empty reference|tests) before counting.
- NOTE: hit session token limits twice (reset 3:10am, then 8:10am ET 2026-05-30). Cut-off
  agents still wrote most apps to disk; validated survivors were kept, partials removed.


Each app is a directory `data/nextjs/<slug>/` with the standard 5 pieces
(description.md, meta.json, starter/, reference/, tests/) — same loader/runner as the
existing tasks. Apps are bigger: multi-route, shared state, API handlers, 15-30 tests.

## Harness rules (apply to every app)
- Deps: react + react-dom ONLY. **No `next` imports** (no next/link, next/navigation,
  next/image, next/font). Routing is an in-app state machine; navigation via buttons/links
  that set route state. API handlers use Web `Request`/`Response` (no `next/server`).
- `app/page.tsx` default-exports the root `App` (entry_point) = the in-app router shell
  (nav + renders the active page). Pages live in `app/<route>/page.tsx`.
- Cross-route state persists via a Context provider wrapping the router.
- `components/`, `hooks/`, `lib/` for shared code. `app/api/<resource>/route.ts` for handlers
  (in-memory store + exported `__reset()` for test isolation).
- strict TS; tsconfig lib is `["ES2022","DOM"]` (no DOM.Iterable) — no `for...of` over
  Map/Set iterators; use `.forEach`/`Array.from`/index loops.
- Tests in `tests/`: navigation + feature-flow (RTL + userEvent) + API-handler. 15-30
  independent `it()` blocks. `data-testid` on queried elements. Test files import vitest
  globals explicitly (`import { describe, it, expect, beforeEach } from 'vitest'`).
- Validate: `bash validate_one.sh <slug> /tmp/app_<slug>` must exit 0 (reference green).
  Starter is a genuine stub (compiles, fails tests).

## Golden reference: `app-task-tracker` (built first — clone its exact shape)

### Cloning checklist (per app)
- 12-16 files across `app/`, `components/`, `hooks/`, `lib/`, `app/api/*/route.ts`.
- 4 routes minimum; cross-route shared state via a Context `*Provider` + `useX()` hook.
- 1-2 API resources with in-memory `lib/store.ts` (seed data + `__reset()`); route files
  re-export `__reset`. Client state and server store are SEPARATE.
- 18-30 independent `it()` blocks: navigation, ≥1 feature flow, a derived/stats view, and
  API-handler CRUD+validation.
- Starter = same file tree, stubbed (empty `data-testid` shells / API returns 501) — must
  compile but fail every meaningful test.

### Gotchas (learned from the golden build — heed these)
1. The root `app/page.tsx` (`App`) renders the Provider, so it CANNOT call `useX()` itself.
   Put an inner `Shell` component inside the Provider that consumes context (route +
   `data-theme`) and renders NavBar + active page.
2. The starter's Provider must supply a NON-NULL stub value (no-op actions), so the app
   still mounts and tests fail on assertions, not on a crash. The "useX outside provider
   throws" contract can still hold (stub only injected inside the provider).
3. Put `data-theme` on a root element in the Shell, driven by context, so theme persists
   across navigation (tested).
4. Mutating API verbs: support BOTH explicit-set and toggle semantics if the spec implies
   it, and 404 on missing id — both are usually tested.
5. Validation may flake on shared vite cache: if a run fails with esbuild/transform/cache
   internal errors (NOT assertion failures), just re-run `validate_one.sh` (fresh workdir).
   Only treat real assertion/type failures as bugs to fix.

## Theme allocation (50 themes × 5 apps = 250). Unique prefix per theme => no slug collisions.
1.  fin    — personal finance / budgeting
2.  shop   — e-commerce storefront + cart/checkout
3.  task   — task / productivity / to-do
4.  note   — notes / knowledge base
5.  team   — team / project management
6.  book   — booking / appointments
7.  fit    — fitness / workout tracking
8.  learn  — courses / quizzes / LMS
9.  dev    — developer tools / build dashboards
10. social — social feed / community
11. blog   — blogging / CMS
12. event  — events / ticketing
13. travel — travel / itinerary planner
14. food   — recipes / meal planning
15. estate — real-estate listings
16. hr     — HR / applicant tracking
17. crm    — sales CRM / pipeline
18. support— helpdesk / support tickets
19. invent — inventory / warehouse
20. stat   — analytics dashboards
21. chat   — messaging / chat rooms
22. market — marketplace / classifieds
23. music  — music / playlist library
24. video  — video / streaming library
25. arcade — games / leaderboards / quiz games
26. habit  — habit / goal tracking
27. folio  — investment portfolio (simulated)
28. bank   — banking dashboard (simulated)
29. poll   — polls / surveys / voting
30. wiki   — wiki / docs
31. issue  — kanban / issue tracker
32. cal    — calendar / scheduling
33. weather— weather dashboard (static data)
34. news   — news aggregator (static data)
35. pantry — pantry / grocery / cooking
36. pet    — pet care / vet records
37. fleet  — car / fleet maintenance
38. rent   — rentals / property management
39. give   — fundraising / donations
40. jobs   — job board / applications
41. school — student / school portal
42. meal   — nutrition / calorie tracking
43. time   — time tracking / pomodoro
44. expense— expense reports / approvals
45. survey — feedback / NPS
46. home   — smart-home device dashboard (simulated)
47. ride   — ride / delivery dispatch
48. read   — reading list / book library
49. garden — gardening / plant care
50. debt   — savings / debt payoff planner
