# HTTP Status Code Lookup

Build an HTTP status code reference tool with search and category filtering.

## Seed Data (all codes)

### 1xx Informational
- 100: Continue
- 101: Switching Protocols

### 2xx Success
- 200: OK
- 201: Created
- 204: No Content
- 206: Partial Content

### 3xx Redirection
- 301: Moved Permanently
- 302: Found
- 304: Not Modified
- 307: Temporary Redirect
- 308: Permanent Redirect

### 4xx Client Error
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 405: Method Not Allowed
- 409: Conflict
- 410: Gone
- 422: Unprocessable Entity
- 429: Too Many Requests

### 5xx Server Error
- 500: Internal Server Error
- 501: Not Implemented
- 502: Bad Gateway
- 503: Service Unavailable
- 504: Gateway Timeout

Each status has a short description:
- 100: "The server has received the request headers and the client should proceed."
- 101: "The server is switching protocols as requested by the client."
- 200: "The request has succeeded."
- 201: "The request has been fulfilled and a new resource has been created."
- 204: "The server has fulfilled the request but does not need to return a body."
- 206: "The server is delivering only part of the resource."
- 301: "The requested resource has been permanently moved to a new URL."
- 302: "The resource is temporarily located at a different URL."
- 304: "The resource has not been modified since the last request."
- 307: "The resource is temporarily at another URI, method must not change."
- 308: "The resource has permanently moved and the method must not change."
- 400: "The server cannot process the request due to a client error."
- 401: "Authentication is required and has failed or not been provided."
- 403: "The server refuses to authorize the request."
- 404: "The requested resource could not be found."
- 405: "The request method is not supported for this resource."
- 409: "The request conflicts with the current state of the resource."
- 410: "The resource is no longer available and will not be available again."
- 422: "The request was well-formed but contains semantic errors."
- 429: "The user has sent too many requests in a given amount of time."
- 500: "The server encountered an unexpected condition."
- 501: "The server does not support the functionality required."
- 502: "The server received an invalid response from an upstream server."
- 503: "The server is currently unable to handle the request."
- 504: "The upstream server did not respond in time."

## Layout

- Page heading: "HTTP Status Codes"
- Search input (label "Search codes") — filters by code number or name (case-insensitive)
- Category filter buttons: "All", "1xx", "2xx", "3xx", "4xx", "5xx" — one active at a time; clicking changes filter
  - Each button has data-testid="filter-[label]" e.g. "filter-All", "filter-2xx"
- A list of matching status codes; each item has data-testid="status-item" and shows:
  - Code number with data-testid="code-[number]" e.g. "code-200"
  - Status name with data-testid="name-[number]"
  - Category badge (e.g. "2xx") with data-testid="category-[number]"
- Result count: "N results" with data-testid="result-count"
- Clicking a status item expands/collapses an inline description below that item
  - Collapsed by default; clicking shows data-testid="desc-[number]"
  - Clicking the same item again collapses it

## Behaviors

- Search and category filter combine: both must match
- "All" category shows everything
- Active filter button appears visually distinct (add aria-pressed="true")
- Clicking a code item toggles its description; only one can be open at a time (closing previous when opening new)
- Result count reflects combined filter

## Edge Cases

- Search "404" matches code 404; search "not" matches "Not Found", "Not Modified", "Not Implemented"
- Category filter "4xx" shows only 400-level codes
