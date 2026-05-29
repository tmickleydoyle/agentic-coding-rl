# Cursor pagination API route

Implement `app/api/items/route.ts` using only Web standard globals (`Request`,
`Response`, `URL`, `btoa`, `atob`, `JSON`). No `next` import, no third-party packages.

Maintain a module-level, fixed, ordered dataset of items. Seed it (and expose a
`__reset()` that re-seeds it) with exactly these items, in this order:

```
{ id: 1, name: 'a' }
{ id: 2, name: 'b' }
{ id: 3, name: 'c' }
{ id: 4, name: 'd' }
{ id: 5, name: 'e' }
{ id: 6, name: 'f' }
{ id: 7, name: 'g' }
```

Ordering is stable: always iterate the dataset in id-ascending order.

## GET
Query params:
- `limit` (optional) — page size. Default `2`. Must be an integer `1..100`.
- `cursor` (optional) — an opaque cursor. When present it is `btoa(String(lastId))`
  i.e. the base64 of the id of the last item returned on the previous page. Items
  are returned that come strictly AFTER that id in the ordering.

Behaviour:
- Return `200` with `{ "items": Item[], "nextCursor": string | null, "hasMore": boolean }`.
- `items` is at most `limit` items, those strictly after the cursor's id.
- `hasMore` is `true` iff at least one item remains after this page.
- `nextCursor` is `btoa(String(lastReturnedId))` when `hasMore` is true, else `null`.
- No cursor means start from the beginning.

Validation (return `400` with `{ "error": string }`):
- `limit` present but not an integer in `1..100`.
- `cursor` present but malformed: not decodable via `atob`, or decodes to something
  that is not a base-10 integer.

All responses set header `content-type: application/json`.
