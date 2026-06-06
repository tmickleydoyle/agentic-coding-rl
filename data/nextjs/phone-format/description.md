# phone-format

An API route that formats a raw phone number string into a standard US format.

## Endpoint

`GET /api/phone-format`

### Query Parameters

| Parameter | Type   | Required | Description                     |
|-----------|--------|----------|---------------------------------|
| phone     | string | yes      | Raw phone number string to format |

### Response (200)

```json
{
  "raw": "5551234567",
  "formatted": "(555) 123-4567"
}
```

### Error Cases

- Missing `phone`: `400 { "error": "phone is required" }`
- Not exactly 10 digits after stripping non-digits: `400 { "error": "phone must contain exactly 10 digits" }`

## Behavior

- Strip all non-digit characters from the input before processing
- Format as `(NXX) NXX-XXXX` where N is 2-9
- The `raw` field in the response is the original input string (not stripped)
- Accepts inputs like `"555-123-4567"`, `"(555) 123-4567"`, `"5551234567"`, `"+15551234567"` (stripped to 10 digits)
- If stripping `+1` country code leaves 10 digits, that is valid
