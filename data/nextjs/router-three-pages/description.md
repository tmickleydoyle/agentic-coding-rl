# Three-page router

Implement a client component `App` in `components/App.tsx` that simulates a tiny 3-page
app with client-side state routing:

- Three pages: **Home**, **About**, **Contact**.
- Nav: three `<button>`s with `data-testid="nav-home"`, `nav-about`, `nav-contact`. Their labels are `"Home"`, `"About"`, `"Contact"`.
- A `<main data-testid="page">` shows the current page's content:
  - Home: `"Welcome"`
  - About: `"About us"`
  - Contact: `"Get in touch"`
- A `<span data-testid="current">` shows the current page name in lowercase: `"home"`, `"about"`, or `"contact"`.
- Starts on **Home**.
- The active page's nav button must have `aria-current="page"`; the others must not have that attribute.

Default export.
