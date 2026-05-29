# Atomic bulk operations API route

Implement `app/api/bulk/route.ts` using only Web standard globals (`Request`,
`Response`, `URL`, `JSON`). No `next` import, no third-party packages.

Maintain a module-level store mapping numeric `id -> { id: number, value: number }`.
Export `__reset()` which re-seeds the store to exactly:

```
{ id: 1, value: 10 }
{ id: 2, value: 20 }
```

## POST
Body: `{ "ops": Array<Op> }` where each `Op` is one of:
- `{ "op": "create", "id": number, "value": number }`
- `{ "op": "update", "id": number, "value": number }`
- `{ "op": "delete", "id": number }`

Operations are applied **atomically**: validate ALL ops first; if ANY op is
invalid, apply NONE and return `422` with `{ "errors": [{ "index": number, "message": string }] }`
listing every invalid op (in op order). Otherwise apply all ops in order and
return `200` with `{ "applied": number, "state": Record<string,...> }` where
`state` is the post-mutation store keyed by id and `applied` is the op count.

Validation rules (each produces one error with the op's `index`):
- Body must be an object with `ops` being a non-empty array, else `400`
  `{ "error": string }` (this is a request-shape error, NOT the 422 path).
- Unknown `op` value -> message `"unknown op"`.
- `id` not a number -> message `"invalid id"`.
- `create`/`update` with `value` not a number -> message `"invalid value"`.
- `create` for an id that already exists -> message `"exists"` (a 409-style conflict).
- `update`/`delete` for an id that does NOT exist -> message `"not found"`.

Conflict checks must account for earlier ops in the SAME batch: e.g. a `create`
then a later `create` of the same id is a conflict; a `create` then `update` of
the same id is valid; validate against the projected state, not just the
initial state. Validate id/value shape before existence.

`state` values are serialized as `{ "1": { "id": 1, "value": 10 }, ... }`.
All responses set header `content-type: application/json`.
