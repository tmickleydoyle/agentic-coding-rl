# credit-card-mask

An API route that masks a credit card number, showing only the last 4 digits.

## Endpoint

`GET /api/credit-card-mask`

### Query Parameters

| Parameter | Type   | Required | Description               |
|-----------|--------|----------|---------------------------|
| number    | string | yes      | The credit card number    |

### Response (200)

```json
{
  "masked": "**** **** **** 1234",
  "last4": "1234"
}
```

### Error Cases

- Missing `number`: `400 { "error": "number is required" }`
- Not exactly 16 digits after stripping non-digits: `400 { "error": "card number must contain exactly 16 digits" }`

## Behavior

- Strip all non-digit characters (spaces, dashes) before processing
- The masked format is always `**** **** **** XXXX` where `XXXX` is the last 4 digits
- `last4` is always a 4-character string of the final 4 digits
- Accepts inputs like `"4111111111111111"`, `"4111-1111-1111-1111"`, `"4111 1111 1111 1111"`
