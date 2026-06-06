# percentage-calc

An API route that calculates percentage values.

## Endpoint

`GET /api/percentage-calc`

### Query Parameters

| Parameter | Type   | Required | Description                        |
|-----------|--------|----------|------------------------------------|
| value     | number | yes      | The base value                     |
| total     | number | yes      | The total (denominator)            |
| decimals  | number | no       | Decimal places to round to (default: 2) |

### Response (200)

```json
{
  "value": 25,
  "total": 200,
  "percentage": 12.5,
  "decimals": 2
}
```

### Error Cases

- Missing `value` or `total`: `400 { "error": "value and total are required" }`
- Non-numeric `value` or `total`: `400 { "error": "value and total must be numbers" }`
- `total` is zero: `400 { "error": "total must not be zero" }`

## Behavior

- `percentage = (value / total) * 100` rounded to `decimals` places
- `decimals` defaults to `2` if omitted; clamped to `[0, 10]`
- Returned `value` and `total` are parsed numbers (not strings)
