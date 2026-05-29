# GraphQL-lite field-selection API route

Implement `app/api/graphql/route.ts` using only Web standard globals (`Request`,
`Response`, `URL`, `JSON`). No `next` import, no `graphql`, no third-party
packages. Write a minimal hand-rolled parser.

## Data (fixed, module-level)
Export `__reset()` re-seeding:

```
users = [
  { id: 1, name: 'Ada',  posts: [ { id: 10, title: 'Engines' }, { id: 11, title: 'Notes' } ] },
  { id: 2, name: 'Lin',  posts: [ { id: 20, title: 'Graphs' } ] },
]
```

## Query language (subset)
A query selects a root `user(id:<n>)` with a brace-enclosed selection set of
fields. `posts` is itself a selectable object list with its own selection set:

```
user(id:1){ name posts{ title } }
```

Grammar essentials your parser must handle:
- Root is always `user(id:<integer>)` followed by `{ ... }`.
- Inside a selection set, fields are whitespace-separated identifiers.
- Selectable fields on `user`: `id`, `name`, `posts`. `posts` REQUIRES a nested
  selection set `{ ... }`; scalar fields must NOT have one.
- Selectable fields on a post: `id`, `title`.
- Whitespace is insignificant; the query may have arbitrary spaces/newlines.

## POST
Body `{ "query": string }`.

- Parse errors (not starting with `user`, missing/invalid `(id:N)`, unbalanced
  braces, empty selection set) -> `400` `{ "errors": [ { "message": string } ] }`.
- A selected field that isn't valid for its type, or `posts` used without a
  selection set, or a scalar field given a selection set -> `400`
  `{ "errors": [ { "message": string } ] }`.
- If the user id does not exist -> `200` `{ "data": { "user": null } }`.
- Otherwise resolve only the requested fields -> `200`
  `{ "data": { "user": { ...selected } } }`. `posts` resolves to an array of
  objects containing only the requested post fields, in data order.

Field order in output follows the order requested in the query.
All responses set header `content-type: application/json`.
