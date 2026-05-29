# Slugify API route

Implement the POST handler in `app/api/slugify/route.ts` using only Web standard
globals (`Request`, `Response`). No `next` import, no third-party packages.

## POST
Body `{ "title": string }`. Produce a URL slug:
1. Lowercase the title.
2. Trim leading/trailing whitespace.
3. Replace every run of non-alphanumeric characters with a single `-`.
4. Strip leading and trailing `-`.

Return `200` with `{ "slug": string }`.

If `title` is missing, not a string, or is empty/whitespace-only (slug would be
empty), return `400` with `{ "error": "title required" }`. Treat invalid JSON
the same way.

Examples:
- `"Hello, World!"` -> `"hello-world"`
- `"  Foo   Bar  "` -> `"foo-bar"`
- `"a@@@b"` -> `"a-b"`

All responses set header `content-type: application/json`.
