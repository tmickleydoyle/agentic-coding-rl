# temperature-convert

An API route that converts a temperature value between Celsius, Fahrenheit, and Kelvin.

## Endpoint

`GET /api/temperature-convert?value=<number>&from=<unit>&to=<unit>`

## Query Parameters

- `value` (number, required): The temperature value to convert.
- `from` (string, required): The source unit. One of: `celsius`, `fahrenheit`, `kelvin`.
- `to` (string, required): The target unit. One of: `celsius`, `fahrenheit`, `kelvin`.

## Response

Returns a JSON object:

```json
{ "value": <input number>, "from": "<unit>", "to": "<unit>", "result": <converted number> }
```

- `result` is rounded to 2 decimal places.

## Conversion Formulas

- Celsius to Fahrenheit: `(C × 9/5) + 32`
- Fahrenheit to Celsius: `(F − 32) × 5/9`
- Celsius to Kelvin: `C + 273.15`
- Kelvin to Celsius: `K − 273.15`
- Fahrenheit to Kelvin: convert to Celsius first, then to Kelvin
- Kelvin to Fahrenheit: convert to Celsius first, then to Fahrenheit
- Same unit to same unit: result equals input value

## Error Cases

If any required parameter is missing, return HTTP 400:
```json
{ "error": "value, from, and to query parameters are required" }
```

If `value` is not a valid number, return HTTP 422:
```json
{ "error": "value must be a valid number" }
```

If `from` or `to` is not one of the valid units, return HTTP 422:
```json
{ "error": "from and to must be celsius, fahrenheit, or kelvin" }
```

## Examples

- `?value=0&from=celsius&to=fahrenheit` → `{ "value": 0, "from": "celsius", "to": "fahrenheit", "result": 32 }`
- `?value=100&from=celsius&to=kelvin` → `{ "value": 100, "from": "celsius", "to": "kelvin", "result": 373.15 }`
- `?value=32&from=fahrenheit&to=celsius` → `{ "value": 32, "from": "fahrenheit", "to": "celsius", "result": 0 }`
