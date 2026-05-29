# Tabbed forms with independent saves

Implement a client component `TabbedForms` in `components/TabbedForms.tsx`:

- Three tabs: **General**, **Contact**, **Bio** (General is initial).
- Tab nav: three `<button>`s with `data-testid="tab-general"`, `tab-contact`, `tab-bio`. The active tab has `aria-current="page"`.
- Each tab contains:
  - **General**: `<input data-testid="name">` (controlled).
  - **Contact**: `<input data-testid="email">` (controlled).
  - **Bio**: `<textarea data-testid="bio">` (controlled).
- Each tab has its own `<button data-testid="save-<tab>">` (e.g., `save-general`) labeled `"Save"` and its own status `<span data-testid="status-<tab>">`.
- Initially `status-<tab>` is empty for all three. Clicking a tab's Save button sets that tab's status to `"Saved: <current value>"`. Saves are **independent**: saving General must not change the status of Contact or Bio.
- Switching tabs preserves all inputs and all statuses.

Default export.
