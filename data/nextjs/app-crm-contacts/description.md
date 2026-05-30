# CRM Contacts app

Build a small multi-route CRM contacts app. Routing is **in-app** (React state — no `next`
imports anywhere). Four routes, a shared Context, and a contacts API route handler backed by
a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. tsconfig `lib` is `["ES2022","DOM"]` — no
`for...of` over Map/Set iterators.

## Types — `lib/types.ts`
- `Contact = { id: string; name: string; companyId: string; tags: string[] }`
- `Company = { id: string; name: string }`
- `Activity = { id: string; contactId: string; kind: 'call'|'email'|'note'; text: string }`
- `Route = 'contacts' | 'contact-detail' | 'companies' | 'activity'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
Context + `useApp()` (throws outside provider). Exposes `companies`, `contacts`,
`activities`, `theme`, `route`, `selectedContactId`, and actions: `addTag(contactId, tag)`
(no dups, ignore blank), `removeTag(contactId, tag)`,
`logActivity({contactId,kind,text})` (fresh id `a4`, …), `selectContact(id)` (sets
selection + navigates to `contact-detail`), `setTheme`, `navigate`. Starts on `contacts`.

Seed companies: `co1` Acme, `co2` Globex. Contacts: `c1` Ada Byron/co1 [vip,lead];
`c2` Grace Hopper/co1 [lead]; `c3` Linus T/co2 []. Activities: `a1` c1 call "Intro call",
`a2` c1 email "Sent deck", `a3` c2 note "Warm lead". First logged activity = `a4`.

## Hook — `hooks/useContacts.ts`
Pure helpers `activitiesForContact`, `contactsForCompany`, `allTags` (sorted unique tags).

## Routing shell — `app/page.tsx` (default export `App`)
`<AppStateProvider>` → inner `Shell` with `app-root` (`data-theme`), `NavBar`
(`nav-contacts | nav-contact-detail | nav-companies | nav-activity`, active gets
`aria-current="page"`), `page-content`.

## Pages
- `contacts` (`page-contacts`): a `tag-filter` select (`all` + one per tag); `contact-list`
  of rows (`contact-<id>-name`, `contact-<id>-company`, `contact-<id>-tagcount`, `open-<id>`).
  When the filter matches nothing render `empty-state` and no `contact-list`.
- `contact-detail` (`page-contact-detail`): `no-contact` if none selected; else
  `detail-name`, `detail-company`, `detail-tags` (`tag-<name>` + `remove-tag-<name>`),
  `tag-input` + `add-tag` button, and `detail-activities` (`activity-<id>` with `data-kind`
  and `activity-<id>-text`) for that contact only.
- `companies` (`page-companies`): `company-list` with `company-<id>-name` and
  `company-<id>-count` (contacts in that company).
- `activity` (`page-activity`): an `activity-form` with `activity-contact`, `activity-kind`,
  `activity-text`, `activity-submit`; blank text → `activity-error`. `activity-total` count
  and `activity-feed` (`feed-<id>` `data-kind`, `feed-<id>-contact`, `feed-<id>-text`).

## API — separate in-memory store + `app/api/contacts/route.ts`
Re-export `__reset`, JSON `content-type: application/json`.
- **GET** — `{ contacts }` with `?companyId=`/`?tag=` filters. `?activity=true` →
  `{ activities }` (optionally `&contactId=`).
- **POST** — `{ name, companyId?, tags? }` → 201 contact (ids `c4`, …; default companyId
  `co1`, tags `[]`); blank name → 400 `{ error: "name required" }`. With `?activity=true`:
  body `{ contactId, kind?, text }` → 201 activity (`a4`, …; default kind `note`); blank
  text → 400 `{ error: "text required" }`; missing contact → 404.
- **PUT** — `?id=` body `{ tag }` adds the tag; `&op=remove` removes it. Blank tag → 400;
  missing id → 404.
- **DELETE** — `?id=` removes the contact and its activities; 404 on missing id.
