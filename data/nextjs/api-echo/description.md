# Echo API route

Implement the route handlers in `app/api/echo/route.ts` using only Web standard
globals (`Request`, `Response`, `URL`). No `next` import, no third-party packages.

## GET
Echo all query parameters. Return `200` with JSON:

```json
{ "method": "GET", "query": { "<k>": "<v>", ... } }
```

`query` is an object of every query parameter (string values). With no params,
`query` is `{}`.

## POST
Parse the JSON request body and echo it back. Return `200` with JSON:

```json
{ "received": <parsed body> }
```

If the body is not valid JSON, return `400` with `{ "error": "invalid json" }`.

All responses must set header `content-type: application/json`.
