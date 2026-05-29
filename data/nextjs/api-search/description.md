# Search API route

Implement the GET handler in `app/api/search/route.ts` using only Web standard
globals (`Request`, `Response`, `URL`). No `next` import, no third-party packages.

There is a fixed in-module list of items `{ id: number, name: string }`:

```
{ id: 1, name: 'Apple' }
{ id: 2, name: 'Banana' }
{ id: 3, name: 'Cherry' }
{ id: 4, name: 'apricot' }
{ id: 5, name: 'Grape' }
```

## GET
Query `?q=`. Filter items whose `name` contains `q` as a case-insensitive
substring. If `q` is missing or empty, return all items (in order).

Return `200` with `{ "results": Item[], "count": number }` where `count` is
`results.length`.

All responses set header `content-type: application/json`.
