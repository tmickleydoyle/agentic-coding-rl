# zip-code-validate

An API route that validates a US ZIP code (5-digit or ZIP+4 format).

## Endpoint

`GET /api/zip-code-validate`

### Query Parameters

| Parameter | Type   | Required | Description             |
|-----------|--------|----------|-------------------------|
| zip       | string | yes      | ZIP code string to validate |

### Response (200)

```json
{
  "zip": "12345",
  "valid": true,
  "format": "zip5"
}
```

or for ZIP+4:

```json
{
  "zip": "12345-6789",
  "valid": true,
  "format": "zip+4"
}
```

or when invalid:

```json
{
  "zip": "abc",
  "valid": false,
  "format": null
}
```

### Error Cases

- Missing `zip`: `400 { "error": "zip is required" }`

## Behavior

- Valid ZIP5 format: exactly 5 digits (`/^\d{5}$/`)
- Valid ZIP+4 format: 5 digits, hyphen, 4 digits (`/^\d{5}-\d{4}$/`)
- `format` is `"zip5"`, `"zip+4"`, or `null` (when invalid)
- `valid` is `true` only for the two accepted formats
- The `zip` field in the response echoes the original input
