# Fix: Accordion only allows one panel open at a time

`components/Accordion.tsx` renders three panels (`Alpha`, `Beta`, `Gamma`). Each has a
header button (`data-testid="header-<name>"`) that toggles its body
(`data-testid="body-<name>"`). A panel's body is present in the DOM only when that panel
is open. Panels are meant to open and close **independently** — multiple can be open at
once.

**Bug:** Opening one panel closes any other open panel (old single-open accordion
behavior). Each header should toggle only its own panel without affecting the others.

Find and fix the bug so any combination of panels can be open simultaneously. Keep the
same `data-testid` attributes. Default export.
