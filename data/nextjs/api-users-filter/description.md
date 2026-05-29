# Users filter API route

Implement the GET handler in `app/api/users/route.ts` using only Web standard
globals (`Request`, `Response`, `URL`). No `next` import, no third-party packages.

There is a fixed in-module list of users `{ id, name, age, role }`:

```
{ id: 1, name: 'Alice', age: 30, role: 'admin' }
{ id: 2, name: 'Bob',   age: 25, role: 'user' }
{ id: 3, name: 'Carol', age: 40, role: 'admin' }
{ id: 4, name: 'Dave',  age: 19, role: 'user' }
{ id: 5, name: 'Eve',   age: 35, role: 'guest' }
```

## GET
Optional query params `?role=` and `?minAge=` (combinable):
- `role`: keep users whose `role` equals it exactly.
- `minAge`: keep users with `age >= minAge`. If `minAge` is present but not a
  valid non-negative integer, return `400` with `{ "error": "invalid minAge" }`.
- With neither param, return all users.

Return `200` with `{ "users": User[], "count": number }` (filtered, original order).

All responses set header `content-type: application/json`.
