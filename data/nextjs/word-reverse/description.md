# word-reverse

A GET API route that reverses each word in a sentence while preserving word order.

## Endpoint

`GET /api/word-reverse?sentence=<string>`

## Query Parameters

- `sentence` (string, required): A sentence whose words should be individually reversed.

## Behavior

- Split the `sentence` by single spaces.
- Reverse each word's characters individually.
- Re-join with single spaces.
- If `sentence` is missing or empty string, return `{ error: 'sentence is required' }` with status 400.
- Return `{ result: string }` with status 200 on success.

## Examples

```
GET /api/word-reverse?sentence=hello+world
-> 200 { "result": "olleh dlrow" }

GET /api/word-reverse?sentence=abc
-> 200 { "result": "cba" }

GET /api/word-reverse
-> 400 { "error": "sentence is required" }
```
