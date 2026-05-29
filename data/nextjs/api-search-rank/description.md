# Ranked search API route

Implement `app/api/search/route.ts` using only Web standard globals (`Request`,
`Response`, `URL`, `JSON`). No `next` import, no third-party packages.

Maintain a fixed module-level corpus of documents `{ id: number, title: string,
body: string }`. Export `__reset()` re-seeding exactly:

```
{ id: 1, title: 'apple banana',   body: 'fruit basket with apple' }
{ id: 2, title: 'banana split',   body: 'banana banana cream' }
{ id: 3, title: 'cherry pie',     body: 'apple and cherry filling' }
{ id: 4, title: 'date night',     body: 'plain text here' }
```

## GET
Query params:
- `q` (required) — whitespace-separated search terms. Empty/missing -> `400`
  `{ "error": "q required" }`.
- `page` (optional, default `1`) — 1-based integer >= 1.
- `limit` (optional, default `10`) — integer `1..50`.

Bad `page`/`limit` (non-integer or out of range) -> `400` `{ "error": string }`.

## Scoring
Case-insensitive. Tokenize `q` on whitespace into terms. For each document compute:

```
score = sum over terms of (3 * countInTitle(term) + 1 * countInBody(term))
```

where `countInTitle/Body(term)` counts whole-word occurrences (split the field on
whitespace, lowercase, exact token match) of that term. A document is a result
only if its `score > 0` (it matched at least one term).

Sort results by `score` descending, then by `id` ascending. Then paginate:
the page slice is `results[(page-1)*limit : (page-1)*limit + limit]`.

Return `200` with:

```
{ "results": Array<{ id: number, score: number }>, "total": number, "page": number }
```

`total` is the total number of matching documents (before pagination). A page
beyond the end returns an empty `results` array with the correct `total`.

All responses set header `content-type: application/json`.
