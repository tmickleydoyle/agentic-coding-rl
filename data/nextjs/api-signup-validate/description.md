# Signup validation API route

Implement the POST handler in `app/api/signup/route.ts` using only Web standard
globals (`Request`, `Response`). No `next` import, no third-party packages.

## POST
Body: `{ "email": string, "password": string }`.

Validation rules:
- `email` must contain both `@` and `.`.
- `password` must have length >= 8.

If everything is valid, return `200` with `{ "ok": true }`.

If anything fails, return `400` with `{ "errors": { ... } }` where `errors`
contains only the failing fields:
- `errors.email` = `"invalid email"` when email is invalid.
- `errors.password` = `"password too short"` when password is too short.

A missing/non-string field counts as failing that field's rule. If the body is
not valid JSON, treat it as both fields failing (return 400 with both errors).

All responses set header `content-type: application/json`.
