# parse-template

Implement a mini template engine in `lib/template.ts`.

## Exported signature

```ts
export function render(tpl: string, data: unknown): string;
```

## Syntax

- `{{ var.path }}` — interpolation of a dotted path resolved against the current
  context. The value is coerced to a string and **HTML-escaped**
  (`& < > " '`). A missing path resolves to empty string `''`.
- `{{{ raw.path }}}` — same lookup, but NOT escaped.
- `{{#if path}}...{{/if}}` — render the body only when the value at `path` is
  "truthy": not `undefined`/`null`/`false`/`0`/`''`/`NaN` and, for arrays, not
  empty (`[]` is falsy).
- `{{#each list}}...{{/each}}` — iterate an array. Inside the body the current
  item becomes the context; `{{this}}` is the item itself, `{{@index}}` is the
  zero-based index. Dotted paths inside resolve against the item. If `list` is
  missing or not a non-empty array, the body renders nothing.
- Blocks may be **nested** (if inside each, each inside if, etc.).
- Whitespace inside `{{ ... }}` around the expression is ignored
  (`{{ x }}` === `{{x}}`).
- Literal text outside tags is emitted verbatim.

## Path resolution

- Split the path on `.`; walk objects/arrays. `this` refers to the current
  context item. Numeric segments index arrays (`items.0.name`). A failed lookup
  at any step yields "missing" (empty string for interpolation, falsy for if).

## Examples

- `render('Hi {{name}}', { name: 'A' })` → `Hi A`
- `render('{{a.b}}', { a: { b: 1 } })` → `1`
- `render('{{x}}', { x: '<b>' })` → `&lt;b&gt;`
- `render('{{{x}}}', { x: '<b>' })` → `<b>`
- `render('{{#if ok}}Y{{/if}}', { ok: true })` → `Y`
- `render('{{#each xs}}[{{@index}}:{{this}}]{{/each}}', { xs: ['a','b'] })`
  → `[0:a][1:b]`
