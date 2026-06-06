# title-case

A GET API route that converts a string to title case (first letter of each word capitalized, rest lowercase).

## Endpoint

`GET /api/title-case?text=<string>`

## Query Parameters

- `text` (string, required): The text to convert to title case.

## Behavior

- Split `text` by spaces.
- Capitalize the first character of each word and lowercase the remaining characters.
- Re-join with single spaces.
- If `text` is missing or empty string, return `{ error: 'text is required' }` with status 400.
- Return `{ result: string }` with status 200 on success.

## Examples

```
GET /api/title-case?text=hello+world
-> 200 { "result": "Hello World" }

GET /api/title-case?text=the+QUICK+brown+FOX
-> 200 { "result": "The Quick Brown Fox" }

GET /api/title-case
-> 400 { "error": "text is required" }
```
