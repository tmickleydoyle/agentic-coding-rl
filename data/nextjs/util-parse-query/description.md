# Parse / stringify query string

Implement `parseQuery` and `stringifyQuery` in `lib/parse-query.ts`.

```ts
export type QueryValue = string | string[];
export function parseQuery(qs: string): Record<string, QueryValue>;
export function stringifyQuery(obj: Record<string, QueryValue>): string;
```

`parseQuery(qs)`:

- Accepts a query string, with or without a leading `?` (e.g. `"?a=1&b=2"` or `"a=1"`).
- An empty string (or just `"?"`) returns `{}`.
- `key=value` pairs become `{ key: value }`.
- A bare key with no `=` (e.g. `"flag"`) maps to the empty string `""`.
- A repeated key produces an **array** of its values in order, e.g.
  `"b=2&b=3"` -> `{ b: ['2', '3'] }`. A single occurrence stays a string.
- Both keys and values are URL-decoded: `%20` becomes a space and `+` becomes a space.

`stringifyQuery(obj)`:

- Produces a query string (no leading `?`) that round-trips through `parseQuery`.
- String values render as `key=value`; array values render as repeated
  `key=v1&key=v2` in order. Keys and values are URL-encoded (spaces as `%20`).

Export both as named exports.
