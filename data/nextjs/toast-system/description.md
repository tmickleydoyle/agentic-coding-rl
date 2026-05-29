# Toast notifications via Context

This task spans **4 files**:

- `hooks/useToast.ts` — exports a hook `useToast()` that returns `{ toasts, show, dismiss }`:
  - `toasts: { id: number; text: string }[]` — current list.
  - `show(text: string): void` — appends a new toast with a unique numeric id.
  - `dismiss(id: number): void` — removes the toast with that id.
- `components/ToastContext.tsx` — exports a React Context typed as the return of `useToast()` (or `null` initially) AND a `useToastContext()` hook.
- `components/ToastList.tsx` — uses `useToastContext()` and renders `<ul data-testid="toasts">` with one `<li data-testid="toast-<id>">` per toast containing the text and a `<button data-testid="dismiss-<id>">Dismiss</button>` that calls `dismiss(id)`.
- `components/App.tsx` (entry, default export) — sets up the context with `useToast()`, renders `<button data-testid="show-hi">Show hi</button>` (calls `show("hi")`), `<button data-testid="show-bye">Show bye</button>` (calls `show("bye")`), and `<ToastList />`. Wraps everything in the provider.
