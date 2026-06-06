# clamp-value

A GET API route that clamps a numeric value between a minimum and maximum.

## Endpoint

`GET /api/clamp-value?value=<number>&min=<number>&max=<number>`

## Query Parameters

- `value` (number, required): The value to clamp.
- `min` (number, required): The minimum bound (inclusive).
- `max` (number, required): The maximum bound (inclusive).

## Behavior

- Parse all three query params as floats.
- If any of `value`, `min`, or `max` is missing or not a valid number (NaN), return `{ error: 'value, min, and max are required numbers' }` with status 400.
- If `min` > `max`, return `{ error: 'min must be <= max' }` with status 400.
- Return `{ result: number }` where result = Math.min(Math.max(value, min), max).

## Examples

```
GET /api/clamp-value?value=5&min=1&max=10
-> 200 { "result": 5 }

GET /api/clamp-value?value=15&min=1&max=10
-> 200 { "result": 10 }

GET /api/clamp-value?value=-3&min=0&max=100
-> 200 { "result": 0 }

GET /api/clamp-value?value=5&min=10&max=1
-> 400 { "error": "min must be <= max" }
```
