# fibonacci-nth

An API route that returns the Nth Fibonacci number.

## Endpoint

`GET /api/fibonacci-nth?n=<integer>`

## Query Parameters

- `n` (integer, required): The position in the Fibonacci sequence (0-indexed). Must be a non-negative integer.

## Response

Returns a JSON object:

```json
{ "n": <integer>, "result": <integer> }
```

- `n`: the input position
- `result`: the Fibonacci number at position n

## Fibonacci Sequence (0-indexed)

Position: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
Value:     0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55

F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)

## Error Cases

If the `n` parameter is missing, return HTTP 400:
```json
{ "error": "n query parameter is required" }
```

If `n` is not a valid non-negative integer, return HTTP 422:
```json
{ "error": "n must be a non-negative integer" }
```

## Examples

- `?n=0` → `{ "n": 0, "result": 0 }`
- `?n=1` → `{ "n": 1, "result": 1 }`
- `?n=10` → `{ "n": 10, "result": 55 }`
- `?n=-1` → HTTP 422
- `?n=abc` → HTTP 422
