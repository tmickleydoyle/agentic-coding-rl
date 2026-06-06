# Tech Radar

Build a single-page Tech Radar app that categorizes technologies by adoption status.

## Seed Data

```ts
const TECHNOLOGIES = [
  { id: 1, name: "TypeScript", category: "Languages", status: "Adopt", description: "Strongly typed JS superset" },
  { id: 2, name: "GraphQL", category: "Protocols", status: "Trial", description: "Query language for APIs" },
  { id: 3, name: "Deno", category: "Runtimes", status: "Assess", description: "Secure JS/TS runtime" },
  { id: 4, name: "CoffeeScript", category: "Languages", status: "Hold", description: "JS transpiler language" },
  { id: 5, name: "React", category: "Frameworks", status: "Adopt", description: "UI component library" },
  { id: 6, name: "Svelte", category: "Frameworks", status: "Trial", description: "Compile-time UI framework" },
  { id: 7, name: "Bun", category: "Runtimes", status: "Assess", description: "Fast JS runtime & toolkit" },
  { id: 8, name: "REST", category: "Protocols", status: "Adopt", description: "Stateless HTTP architecture" },
]
```

## Fields

- **id**: unique number
- **name**: technology name
- **category**: one of Languages, Protocols, Runtimes, Frameworks
- **status**: one of Adopt, Trial, Assess, Hold
- **description**: short text

## UI Requirements

1. Page heading "Tech Radar" (`data-testid="heading"`).
2. Display all technologies in a list. Each item has:
   - `data-testid="tech-item-{id}"` on the container
   - `data-testid="tech-name-{id}"` showing the name
   - `data-testid="tech-status-{id}"` showing the status
   - `data-testid="tech-category-{id}"` showing the category
3. Filter by status: four buttons "Adopt", "Trial", "Assess", "Hold" (`data-testid="filter-{status}"` lowercased, e.g. `filter-adopt`). An "All" button (`data-testid="filter-all"`) shows all. Default is "All".
4. Filter by category: a `<select>` (`data-testid="category-select"`) with options "All", "Languages", "Protocols", "Runtimes", "Frameworks". Default "All".
5. Status + category filters combine (AND logic).
6. Count display: `data-testid="tech-count"` shows "{n} technologies".
7. Add form: text input `data-testid="add-name"`, select `data-testid="add-category"`, select `data-testid="add-status"`, button `data-testid="add-button"`. On submit, adds new tech with next available id and empty description. Name must be non-empty; if empty, do nothing.
8. Each item has a Remove button `data-testid="remove-{id}"`. Clicking removes that technology permanently.

## Edge Cases

- Filters reset visible count correctly after add/remove.
- Adding with empty name does nothing.
- Removing all items of a filtered category shows 0 count for that filter combination.
