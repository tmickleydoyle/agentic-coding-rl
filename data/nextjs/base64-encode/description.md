# base64-encode

A POST API route that base64-encodes or decodes a string.

## Endpoint

`POST /api/base64-encode`

## Request Body (JSON)

```json
{ "text": string, "mode": "encode" | "decode" }
```

- `text` (string, required): The input string.
- `mode` (string, required): Either `"encode"` to base64-encode or `"decode"` to base64-decode.

## Behavior

- Parse the JSON body.
- If `text` is missing or not a string, return `{ error: 'text is required' }` with status 400.
- If `mode` is not `"encode"` or `"decode"`, return `{ error: 'mode must be encode or decode' }` with status 400.
- For `"encode"`: return `{ result: btoa(text) }`.
- For `"decode"`: return `{ result: atob(text) }`. If decoding fails (invalid base64), return `{ error: 'invalid base64 input' }` with status 400.
- Return status 200 on success.

## Examples

```
POST /api/base64-encode
{ "text": "hello", "mode": "encode" }
-> 200 { "result": "aGVsbG8=" }

POST /api/base64-encode
{ "text": "aGVsbG8=", "mode": "decode" }
-> 200 { "result": "hello" }
```
