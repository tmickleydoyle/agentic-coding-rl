# luhn-check

A GET API route that validates a credit card number using the Luhn algorithm.

## Endpoint

`GET /api/luhn-check?number=<string>`

## Query Parameters

- `number` (string, required): The card number to validate (digits only, spaces allowed and stripped).

## Behavior

- Strip all spaces from the input.
- If `number` is missing or empty after stripping, return `{ error: 'number is required' }` with status 400.
- If `number` contains non-digit characters after stripping spaces, return `{ error: 'number must contain only digits' }` with status 400.
- Apply the Luhn algorithm:
  1. Starting from the rightmost digit, double every second digit.
  2. If doubling results in a number > 9, subtract 9.
  3. Sum all digits.
  4. If the sum modulo 10 equals 0, the number is valid.
- Return `{ valid: boolean }` with status 200.

## Examples

```
GET /api/luhn-check?number=4532015112830366
-> 200 { "valid": true }

GET /api/luhn-check?number=1234567890123456
-> 200 { "valid": false }

GET /api/luhn-check?number=4532+0151+1283+0366
-> 200 { "valid": true }
```
