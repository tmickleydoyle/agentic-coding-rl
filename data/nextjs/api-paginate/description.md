# Pagination API route

Implement the GET handler in `app/api/paginate/route.ts` using only Web standard
globals (`Request`, `Response`, `URL`). No `next` import, no third-party packages.

There is a fixed in-module dataset of 25 items: the numbers `1..25` (i.e.
`items[i] = i + 1`).

## GET
Query params `?page=&limit=` (both optional). Defaults: `page=1`, `limit=10`.

- Parse `page` and `limit` as integers. If either is present but non-numeric or
  `<= 0`, return `400` with `{ "error": "invalid params" }`.
- Compute `total` (always 25) and `totalPages = ceil(total / limit)`.
- Clamp `page` into `[1, totalPages]` (so page beyond the end returns the last page,
  page below 1 is impossible because of the validation above).
- Return `200` with:

```json
{ "items": [...], "page": <clamped page>, "limit": <limit>, "total": 25, "totalPages": <n> }
```

`items` is the slice for the (clamped) page.

All responses set header `content-type: application/json`.
