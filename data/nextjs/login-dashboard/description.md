# Login → dashboard flow

Implement a client component `App` in `components/App.tsx`:

- Two pages: **Login** (initial) and **Dashboard**.
- Login page:
  - `<input data-testid="username">` (controlled).
  - `<input data-testid="password">` (controlled).
  - `<button data-testid="login">Login</button>`.
  - Renders `<p data-testid="error">"Username required"</p>` only after clicking Login with an empty (after trim) username. No error pre-click.
- Login succeeds when username is non-empty (password is ignored for this exercise).
- Dashboard page (after successful login):
  - `<h1 data-testid="welcome">Welcome, <username>!</h1>`
  - `<button data-testid="logout">Logout</button>`.
  - Login-page elements must be absent from the DOM.
- Clicking Logout returns to the Login page **with the previous username cleared** (both fields empty, no error).

Default export.
