# API Docs Viewer

A single-page interactive API documentation viewer.

## Seed Data

Four endpoints pre-loaded:
1. id:1, method:"GET", path:"/api/users", description:"List all users", tag:"Users", deprecated:false
2. id:2, method:"POST", path:"/api/users", description:"Create a new user", tag:"Users", deprecated:false
3. id:3, method:"GET", path:"/api/posts", description:"List all posts", tag:"Posts", deprecated:false
4. id:4, method:"DELETE", path:"/api/posts/:id", description:"Delete a post by ID", tag:"Posts", deprecated:true

## Layout

- Heading: "API Docs"
- Summary stats (data-testid):
  - `count-total`: total number of endpoints
  - `count-deprecated`: number of deprecated endpoints

## Add Endpoint Form

Fields:
- Select, aria-label "Method" — options: GET, POST, PUT, DELETE (default: GET)
- Text input, aria-label "Path" — e.g. /api/resource
- Text input, aria-label "Description"
- Text input, aria-label "Tag" — grouping category
- Checkbox, aria-label "Deprecated" — checked = deprecated

Button "Add Endpoint": adds the endpoint. Clears fields (method resets to GET, deprecated unchecked). Does nothing if path is empty.

## Endpoint List

Each endpoint rendered with:
- `data-testid="endpoint-item"` on the container
- `data-testid="endpoint-method"` showing the HTTP method
- `data-testid="endpoint-path"` showing the path
- `data-testid="endpoint-description"` showing the description
- `data-testid="endpoint-tag"` showing the tag
- `data-testid="endpoint-deprecated"` showing "Yes" if deprecated, "No" if not

## Filter by Tag

A select with aria-label "Filter by tag" with options: All, Users, Posts (plus any dynamically added tags).
Default: "All". Shows only endpoints matching the selected tag.

## Filter by Method

A select with aria-label "Filter by method" with options: All, GET, POST, PUT, DELETE.
Default: "All". Filters list by HTTP method.

Both filters are applied simultaneously (AND logic).

## Delete

Each endpoint has a "Delete" button that removes the endpoint.

## Edge Cases

- Adding with empty path does nothing.
- Global counts always reflect all endpoints regardless of filters.
- Deprecated count updates when endpoints are added or deleted.
