# Feedback API route

Implement `app/api/feedback/route.ts` using only Web standard globals (`Request`,
`Response`). No `next` import, no third-party packages.

Maintain a module-level in-memory list of submitted feedback entries. Export a
`__reset()` function that clears it. Tests call it in `beforeEach`.

## POST
Body `{ "rating": number, "comment"?: string }`.
- `rating` must be an integer in `1..5` inclusive. Otherwise return `400` with
  `{ "error": "invalid rating" }`. Treat invalid JSON the same way.
- On success, store the entry and return `201` with `{ "ok": true }`.

## GET
Return `200` with `{ "count": number, "average": number }` where:
- `count` is the number of stored entries.
- `average` is the mean rating rounded to 1 decimal place, or `0` when empty.

All responses set header `content-type: application/json`.
