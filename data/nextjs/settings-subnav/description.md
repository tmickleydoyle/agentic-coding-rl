# Settings with sub-pages

Implement a client component `Settings` in `components/Settings.tsx`:

- Three sub-pages: **Profile**, **Privacy**, **Notifications** (Profile is initial).
- Sub-nav: three `<button>`s with `data-testid="sub-profile"`, `sub-privacy`, `sub-notifications`. The active one has `aria-current="page"`.
- Each sub-page renders a `<section data-testid="section">` whose content depends on the page:
  - Profile: a controlled `<input data-testid="display-name">` for display name.
  - Privacy: a `<button data-testid="public-toggle">` whose label is `"Make profile public"` initially, `"Make profile private"` after one click (toggles each click). A `<span data-testid="visibility">` shows `"private"` or `"public"`.
  - Notifications: a `<input type="checkbox" data-testid="email-pref">` (controlled checkbox).
- Critically: **each sub-page preserves its own state when navigating away and back.** Typing into the profile name, switching to Privacy, switching back to Profile must still show the typed value.

Default export.
