# Rate-limit API route

Implement `app/api/limit/route.ts` using only Web standard globals (`Request`,
`Response`, `URL`). No `next` import, no third-party packages.

Maintain a module-level in-memory map of per-key request counts. The limit is
`MAX = 3` requests per key.

Export a `__reset()` function that clears all counters. Tests call it in
`beforeEach`.

## GET
Query `?key=` identifies the caller. If `key` is missing, use the literal
`"default"`.

- Each request increments that key's counter.
- For the first `MAX` requests (counts 1, 2, 3), return `200` with
  `{ "count": <n> }`.
- Once the counter would exceed `MAX` (i.e. on the 4th and later requests),
  do NOT keep increasing the reported behavior beyond limiting: return `429`
  with `{ "error": "rate limited" }`.

Different keys are tracked independently.

All responses set header `content-type: application/json`.
