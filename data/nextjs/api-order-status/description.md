# Order status state-machine API route

Implement `app/api/orders/route.ts` using only Web standard globals (`Request`,
`Response`, `URL`). No `next` import, no third-party packages.

Maintain a module-level map of order id -> state. States advance in this order:

```
pending -> paid -> shipped -> delivered
```

Valid actions and the transition each performs:
- `pay`: `pending -> paid`
- `ship`: `paid -> shipped`
- `deliver`: `shipped -> delivered`

Export a `__reset()` function that reseeds the store with a single order id `1`
in state `pending`. Tests call it in `beforeEach`.

## GET
Query `?id=`. Return `200` with `{ "id": number, "state": string }`. If the id
is unknown, return `404` with `{ "error": "not found" }`.

## POST
Query `?id=`, body `{ "action": string }`.
- If the id is unknown, return `404` with `{ "error": "not found" }`.
- If the action is a valid transition from the current state, apply it and
  return `200` with `{ "id": number, "state": <new state> }`.
- Otherwise (unknown action, or action not valid from the current state),
  return `409` with `{ "error": "invalid transition" }`.

All responses set header `content-type: application/json`.
