# validate-email

An API route that validates whether a given string is a valid email address.

## Endpoint

`GET /api/validate-email?email=<value>`

## Query Parameters

- `email` (string, required): The email address to validate.

## Response

Returns a JSON object:

```json
{ "email": "<input>", "valid": true | false }
```

- `email`: the original input string
- `valid`: `true` if the string matches a valid email format, `false` otherwise

## Validation Rules

An email is valid if it:
- Contains exactly one `@` character
- Has at least one character before the `@`
- Has a domain part after `@` that contains at least one `.`
- Has at least one character before and after the `.` in the domain
- Contains no spaces

If the `email` query parameter is missing, return HTTP 400:
```json
{ "error": "email query parameter is required" }
```

## Examples

- `?email=user@example.com` → `{ "email": "user@example.com", "valid": true }`
- `?email=notanemail` → `{ "email": "notanemail", "valid": false }`
- `?email=` → `{ "email": "", "valid": false }`
- (no param) → HTTP 400 `{ "error": "email query parameter is required" }`
