# JWT Decoder

Build a client-side JWT (JSON Web Token) decoder that parses and displays token header, payload, and metadata.

## What is a JWT

A JWT is three base64url-encoded JSON parts separated by dots: `header.payload.signature`

Base64url decoding: replace `-` with `+`, `_` with `/`, then atob() to decode.

## Layout

- Page heading: "JWT Decoder"
- A textarea (label "JWT Token") where the user pastes a JWT
- A "Decode" button
- Three output sections (always rendered, empty until decoded):
  - **Header** section: data-testid="header-output" — pretty-printed JSON of the header
  - **Payload** section: data-testid="payload-output" — pretty-printed JSON of the payload
  - **Signature** section: data-testid="signature-output" — the raw signature string (third part)
- Status/metadata row:
  - data-testid="token-valid" — shows "Valid" if decode succeeded, "Invalid" if it failed or textarea is empty
  - data-testid="token-alg" — shows algorithm from header (e.g. "HS256"), or "-" if not available
  - data-testid="token-exp" — shows expiry as human-readable date string if `exp` claim exists in payload, or "No expiry" if absent
    - Format: use `new Date(exp * 1000).toLocaleString()` for the display
  - data-testid="token-iat" — shows issued-at as human-readable date if `iat` claim exists, or "No iat" if absent
- "Clear" button that resets everything (textarea empty, outputs empty, status resets)
- History section: keeps the last 3 successfully decoded tokens
  - Each history entry has data-testid="history-item"
  - Clicking a history item loads it into the textarea and re-decodes it

## Seed / Example Tokens (for testing reference — not shown in UI by default)

Use this known JWT for tests (it never expires in the test context since we check exp relative to "now"):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

This decodes to:
- Header: `{"alg":"HS256","typ":"JWT"}`
- Payload: `{"sub":"1234567890","name":"John Doe","iat":1516239022}`
- No `exp` claim

## Behaviors

- Decode happens on clicking "Decode" (not on input change)
- If the input is empty or not a valid JWT (not 3 dot-separated parts, or base64 decode fails), show "Invalid" in token-valid and leave outputs empty
- Pretty-print JSON with 2-space indent
- History deduplicates: adding the same token again does not create a duplicate entry; it moves it to the front if already present
- History shows newest first; max 3 entries
- Clicking "Clear" empties the textarea and clears all outputs and status back to default state ("Invalid", "-", "No expiry", "No iat")

## Edge Cases

- Tokens with `exp` in the past still decode successfully (do not show "expired" — just show the date)
- Malformed base64 (catch atob errors) → "Invalid"
- Missing `alg` in header → show "-"
