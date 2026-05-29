# parse-json

Implement a hand-written JSON parser in `lib/json.ts`. Do **not** use the
built-in `JSON.parse`.

## Exported signature

```ts
export function parseJSON(src: string): unknown;
```

## Grammar / behavior

Parse the full JSON grammar:

- **Objects** `{ "k": v, ... }` — keys MUST be double-quoted strings. Returns a
  plain object. Duplicate keys: last one wins.
- **Arrays** `[ v, ... ]` — returns a JS array.
- **Strings** double-quoted. Support escapes `\"`, `\\`, `\/`, `\b`, `\f`,
  `\n`, `\r`, `\t`, and `\uXXXX` (4 hex digits). Any other escape is an error.
- **Numbers** — optional leading `-`, integer part, optional `.fraction`,
  optional exponent `e`/`E` with optional `+`/`-`. No leading zeros (except
  `0` itself or `0.x`). Returns a JS `number`.
- **Literals** `true`, `false`, `null`.
- **Whitespace** (space, tab, CR, LF) is allowed between any tokens and around
  the whole document.

## Errors

Throw an `Error` (any message) on malformed input, including:

- Trailing comma in object or array (`[1,]`, `{"a":1,}`).
- Unterminated string, unterminated object/array.
- Junk / trailing content after the top-level value (`1 2`, `{} x`).
- Empty input or whitespace-only input.
- A bare/unquoted key, a missing colon, a missing comma between elements.
- An invalid escape or a `\u` followed by fewer than 4 hex digits.

## Notes

- `parseJSON('  42 ')` returns the number `42`.
- Deeply nested structures must parse correctly.
