# Controlled input

Implement a client component `Greeting` in `components/Greeting.tsx` that:

- Renders a `<label>` "Your name" associated with an `<input>` of type "text".
- Below the input, displays `"Hello, <name>!"` (where `<name>` is whatever's currently typed)
  inside an element with `data-testid="greeting"`.
- If the input is empty, the greeting shows `"Hello, stranger!"`.

The input must be a **controlled** input (React state holds its value). Export
`Greeting` as the default export.
