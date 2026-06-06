# API Mocker

A single-page app that lets users define mock API endpoints and simulate requests against them.

## Seed Data

```
const SEED_ROUTES = [
  { id: 1, method: 'GET', path: '/api/users', status: 200, body: '{"users": []}' },
  { id: 2, method: 'POST', path: '/api/users', status: 201, body: '{"created": true}' },
  { id: 3, method: 'GET', path: '/api/health', status: 200, body: '{"status": "ok"}' },
]
```

## UI Elements

- Heading: "API Mocker"
- A section for adding a new route:
  - A `<select>` with `aria-label="Method"` containing options: GET, POST, PUT, DELETE
  - An `<input>` with `aria-label="Path"` for the route path (e.g., /api/foo)
  - An `<input>` with `aria-label="Status code"` (type="number") for HTTP status code
  - An `<input>` with `aria-label="Response body"` for JSON body text
  - A button "Add Route"
- A list of route rows, each `data-testid="route-row"`, showing: METHOD PATH → STATUS body
  - e.g., "GET /api/users → 200 {"users": []}"
  - A "Delete" button per row
- A section for making a mock request:
  - A `<select>` with `aria-label="Request method"` (GET, POST, PUT, DELETE)
  - An `<input>` with `aria-label="Request path"`
  - A button "Send Request"
- `<p data-testid="response-status">` showing response status after request, initially empty
- `<p data-testid="response-body">` showing response body after request, initially empty
- `<p data-testid="route-count">` showing "Routes: N" where N = current number of routes

## Behavior

### Adding a Route
- User fills in method, path, status code, response body and clicks "Add Route"
- If path is empty: do nothing
- If status code is not a valid integer > 0: do nothing
- Otherwise: add to list, clear the path/status/body inputs (keep method selected as-is)
- route-count updates

### Deleting a Route
- Clicking "Delete" on a row removes that route
- route-count updates

### Sending a Request
- User selects method and path, clicks "Send Request"
- Find the first route that matches both method and path (exact match, case-sensitive path)
- If found: show response-status as "Status: {status}" and response-body as the route's body
- If not found: show response-status as "Status: 404" and response-body as '{"error": "Not found"}'

## Edge Cases
- Multiple routes with same method+path: first match wins
- Deleting a route updates the count immediately
- Request path must match exactly (no trailing slash normalization needed)
- Initial route-count shows "Routes: 3"
