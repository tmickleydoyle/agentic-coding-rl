# Calculator API route

Implement the POST handler in `app/api/calc/route.ts` using only Web standard
globals (`Request`, `Response`). No `next` import, no third-party packages.

## POST
Body `{ "op": string, "a": number, "b": number }` where `op` is one of
`add`, `sub`, `mul`, `div`.

- `add` -> `a + b`, `sub` -> `a - b`, `mul` -> `a * b`, `div` -> `a / b`.
- On success return `200` with `{ "result": number }`.
- If `a` or `b` is not a number, return `400` with `{ "error": "invalid operands" }`.
- If `op` is unknown, return `400` with `{ "error": "unknown op" }`.
- If `op` is `div` and `b === 0`, return `400` with `{ "error": "division by zero" }`.

Validate operands before checking the op. Treat invalid JSON as invalid operands.

All responses set header `content-type: application/json`.
