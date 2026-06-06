# roman-to-int

An API route that converts a Roman numeral string to its integer value.

## Endpoint

`GET /api/roman-to-int?roman=<value>`

## Query Parameters

- `roman` (string, required): A Roman numeral string (e.g., `XIV`, `IV`, `MCMXC`).

## Response

Returns a JSON object:

```json
{ "roman": "<input>", "value": <integer> }
```

- `roman`: the original input string (as provided, no normalization)
- `value`: the integer value of the Roman numeral

## Conversion Rules

Standard Roman numeral symbols and values:

| Symbol | Value |
|--------|-------|
| I      | 1     |
| V      | 5     |
| X      | 10    |
| L      | 50    |
| C      | 100   |
| D      | 500   |
| M      | 1000  |

Subtractive notation applies: if a smaller value symbol precedes a larger one, subtract it.

If the `roman` query parameter is missing, return HTTP 400:
```json
{ "error": "roman query parameter is required" }
```

If the string contains characters that are not valid Roman numeral symbols, return HTTP 422:
```json
{ "error": "invalid Roman numeral" }
```

## Examples

- `?roman=III` → `{ "roman": "III", "value": 3 }`
- `?roman=IV` → `{ "roman": "IV", "value": 4 }`
- `?roman=XIV` → `{ "roman": "XIV", "value": 14 }`
- `?roman=MCMXCIX` → `{ "roman": "MCMXCIX", "value": 1999 }`
- `?roman=ABC` → HTTP 422 `{ "error": "invalid Roman numeral" }`
