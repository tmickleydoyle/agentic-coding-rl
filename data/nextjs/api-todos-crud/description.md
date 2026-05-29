# Todos CRUD API route

Implement `app/api/todos/route.ts` using only Web standard globals (`Request`,
`Response`, `URL`). No `next` import, no third-party packages.

Maintain a module-level in-memory store of todos. Each todo is
`{ id: number, text: string, done: boolean }`. `id` auto-increments starting at 1.

Export a `__reset()` function that clears the store and resets the id counter.
Tests call `__reset()` in `beforeEach` so they are independent.

## GET
Return `200` with `{ "todos": Todo[] }` (all todos, insertion order).

## POST
Body `{ "text": string }`. Create a todo `{ id, text, done: false }` and return
`201` with the created todo. If `text` is missing or not a non-empty string,
return `400` with `{ "error": "text required" }`.

## PUT
Query `?id=<n>`, body `{ "done": boolean }`. Set that todo's `done` and return
`200` with the updated todo. If no todo with that id exists, return `404` with
`{ "error": "not found" }`.

## DELETE
Query `?id=<n>`. Remove that todo and return `200` with `{ "ok": true }`. If no
todo with that id exists, return `404` with `{ "error": "not found" }`.

All responses set header `content-type: application/json`.
