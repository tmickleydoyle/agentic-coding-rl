# Sliding-window rate limiter API route

Implement `app/api/limit/route.ts` using only Web standard globals (`Request`,
`Response`, `URL`, `JSON`). No `next` import, no third-party packages.

Implement a **sliding-window** rate limiter (a timestamp LOG per key, NOT a
fixed-bucket counter). Config:

```
LIMIT  = 3       // max requests allowed within any window
WINDOW = 1000    // window size in ms
```

Maintain a module-level map `key -> number[]` of request timestamps. Export
`__reset()` clearing the map AND any pinned clock. Export `__setNow(ms: number)`
to pin the clock; read time through an internal `now()` defaulting to `Date.now`.

## GET
Query `?key=` (required). Missing/empty key -> `400` `{ "error": "key required" }`.

On each call, at time `t = now()`:
1. Drop logged timestamps for that key that are `<= t - WINDOW` (strictly older
   than the window; a timestamp exactly `WINDOW` ms old has aged out).
2. If the remaining count is `< LIMIT`: record `t`, return `200`
   `{ "remaining": LIMIT - newCount }` where `newCount` includes the just-added one.
3. Else (already at `LIMIT` within the window): do NOT record; return `429`
   `{ "retryAfter": number }` where `retryAfter` is the ms until the oldest
   in-window timestamp ages out, i.e. `oldest + WINDOW - t`.

All responses set header `content-type: application/json`.
