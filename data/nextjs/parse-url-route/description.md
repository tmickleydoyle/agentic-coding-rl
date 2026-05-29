# parse-url-route

Implement an Express-style route compiler and matcher in `lib/route.ts`.

## Exported signatures

```ts
export interface CompiledRoute {
  match(path: string): Record<string, string> | null;
}
export function compile(pattern: string): CompiledRoute;
export function match(
  pattern: string,
  path: string,
): Record<string, string> | null;
```

`match(pattern, path)` is sugar for `compile(pattern).match(path)`.

## Pattern grammar

Patterns and paths are `/`-separated. Patterns are made of segments:

- **Static** `users` — must equal the path segment verbatim.
- **Param** `:id` — captures exactly one segment into `params.id`.
- **Optional param** `:id?` — the segment may be absent; if present captures it,
  if absent the param is omitted from the result.
- **Wildcard tail** `:path*` — captures the rest of the path (zero or more
  segments, joined with `/`) into `params.path`. Must be the LAST segment. With
  zero remaining segments it captures `''`.

Rules:

- A leading `/` is optional in both pattern and path; treat `/a/b` and `a/b`
  the same. The root pattern `/` matches the root path `/` (and `''`).
- Matching is exact: every pattern segment must consume input and there must be
  no leftover path segments (except what a wildcard tail consumes).
- On a match, return a plain object of captured params; values are
  **URL-decoded** with `decodeURIComponent`. On no match, return `null`.
- A trailing slash on the path is ignored (`/users/1` === `/users/1/`).

## Examples

- `match('/users/:id', '/users/42')` → `{ id: '42' }`
- `match('/users/:id', '/users')` → `null`
- `match('/files/:path*', '/files/a/b/c.txt')` → `{ path: 'a/b/c.txt' }`
- `match('/files/:path*', '/files')` → `{ path: '' }`
- `match('/posts/:id?', '/posts')` → `{}`
- `match('/a/b', '/a/c')` → `null`
- `match('/u/:name', '/u/john%20doe')` → `{ name: 'john doe' }`
