# Card with parts

Implement a `Card` component that **composes three sub-components**. This task spans **4 files**:

- `components/Card.tsx` (entry) — accepts props `{ title: string; body: string; action?: string }` and composes the three sub-components below.
- `components/CardHeader.tsx` — renders `<header data-testid="card-header">` with the title.
- `components/CardBody.tsx` — renders `<section data-testid="card-body">` with the body.
- `components/CardFooter.tsx` — renders `<footer data-testid="card-footer">` containing a `<button data-testid="card-action">` whose label is the `action` prop. If `action` is omitted, **the footer must NOT appear in the DOM**.

The `Card` component must import and use the three sub-components by name (not inline). The wrapper element rendered by Card has `data-testid="card"`. Default export the `Card`.
