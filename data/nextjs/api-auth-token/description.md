# Auth token API route

Implement the POST handler in `app/api/auth/route.ts` using only Web standard
globals (`Request`, `Response`). No `next` import, no third-party packages.

There is one fixed valid credential: username `admin`, password `secret`.

## POST
Body `{ "username": string, "password": string }`.

- If `username` or `password` is missing (not a non-empty string), return `400`
  with `{ "error": "missing fields" }`. Treat invalid JSON the same way.
- If the credentials match the fixed valid pair, return `200` with
  `{ "token": "token-<username>" }` (e.g. `"token-admin"`).
- Otherwise return `401` with `{ "error": "invalid credentials" }`.

All responses set header `content-type: application/json`.
