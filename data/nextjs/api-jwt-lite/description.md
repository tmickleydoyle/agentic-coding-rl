# JWT-lite signing & verification API route

Implement `app/api/auth/route.ts` using only Web standard globals (`Request`,
`Response`, `URL`, `btoa`, `atob`, `JSON`). No `next` import, no `crypto`, no
third-party packages. Implement your own deterministic string hash.

## Token format
A token is three dot-separated parts: `base64(header).base64(payload).sig`

- `header` is the JSON string `{"alg":"HS-lite","typ":"JWT"}`.
- `payload` is the JSON string `{"user":<string>,"exp":<number ms epoch>}`.
- `sig` is `signingHash(b64header + "." + b64payload + SECRET)` rendered as an
  unsigned base-36 string, where `SECRET = "acrl-secret"`.

`signingHash` is this exact algorithm (a simple deterministic rolling hash):

```
let h = 5381
for each char c (left to right): h = ((h * 33) ^ c.charCodeAt(0)) >>> 0
return h   // unsigned 32-bit, then String(h, base 36) via h.toString(36)
```

Base64 the header/payload with `btoa(JSON.stringify(...))`.

## Time
Token TTL is `60000` ms. `exp = now() + 60000`. Read time via an internal `now()`
that defaults to `Date.now`. Export `__setNow(ms: number)` so tests can pin the
clock; also export `__reset()` that clears any pinned clock (back to `Date.now`).

## POST  (login / issue)
Body `{ "user": string }`.
- If `user` is missing or not a non-empty string -> `400` `{ "error": "user required" }`.
- Else `200` `{ "token": string }`.

## GET  (verify)
Read header `Authorization: "Bearer <token>"` via `req.headers.get('authorization')`.
- Missing/!Bearer header -> `401` `{ "error": "missing token" }`.
- Token whose three parts don't parse, or whose recomputed sig != provided sig
  (tampering) -> `401` `{ "error": "invalid token" }`.
- Token whose payload `exp <= now()` -> `401` `{ "error": "expired" }`.
- Valid & unexpired -> `200` `{ "user": <payload.user> }`.

All responses set header `content-type: application/json`.
