# Guarded workflow engine API route

Implement `app/api/workflow/route.ts` using only Web standard globals (`Request`,
`Response`, `URL`, `JSON`). No `next` import, no third-party packages.

Model a guarded state machine over multiple order entities. Each entity:

```
{ id: number, state: string, items: string[], history: string[] }
```

States advance: `draft -> submitted -> approved -> fulfilled`.

Actions and their guarded transitions:
- `addItem` (body also has `item: string`): allowed only in `draft`; appends
  `item` to `items`. State stays `draft`. Guard: `item` must be a non-empty string.
- `submit`: `draft -> submitted`. Guard: order must have at least one item
  (cannot submit an empty order).
- `approve`: `submitted -> approved`.
- `reject`: `submitted -> draft`.
- `fulfill`: `approved -> fulfilled`.

Every successful action appends a string to `history` of the form
`"<action>:<resultingState>"` (for `addItem` the resulting state is `draft`).

Export `__reset()` that seeds exactly two entities:

```
{ id: 1, state: 'draft',     items: [],          history: [] }
{ id: 2, state: 'submitted', items: ['widget'],  history: [] }
```

## GET
Query `?id=`. Unknown id -> `404` `{ "error": "not found" }`. Else `200`
`{ "state": string, "history": string[] }`.

## POST
Query `?id=`, body `{ "action": string, ... }`.
- Unknown id -> `404` `{ "error": "not found" }`.
- Unknown action -> `409` `{ "error": "invalid transition" }`.
- Action not valid from current state -> `409` `{ "error": "invalid transition" }`.
- Guard failure (e.g. `submit` an empty order, or `addItem` with bad item) ->
  `409` `{ "error": "guard failed" }`.
- Success -> `200` `{ "id": number, "state": <new state>, "items": string[],
  "history": string[] }`.

All responses set header `content-type: application/json`.
