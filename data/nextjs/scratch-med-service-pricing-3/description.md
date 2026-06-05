# Build a Service Pricing Manager

Build a complete single-page React application for managing a service menu — the kind of tool a freelancer or small studio would use to track which services they offer and their prices. The app has **three views** navigated via a top nav bar: **Services**, **Stats**, and **Settings**. The app starts on the **Services** view. All state lives in memory (no backend).

Navigation: a nav bar with buttons **Services**, **Stats**, and **Settings** switches the active view.

## Services view

Displays the current list of services and lets the user manage them.

- An input labeled **Service name** and an input labeled **Price ($)** plus an **Add service** button adds a new service. Ignore the submission if either field is blank or if the price is not a valid positive number.
- Each service row shows the service name, its price formatted as `$X.XX` (two decimal places), and a toggle button whose label is **Deactivate** when the service is active and **Activate** when it is inactive.
- New services are **active** by default.
- A header area shows two live counts: **Active: N** (number of active services) and **Total: N** (total number of services).
- Each service row also has a **Delete** button (labeled `Delete`) that permanently removes it from the list.

## Stats view

A read-only derived summary computed from the current service list:

- `Total services: N`
- `Active services: N`
- `Inactive services: N`
- `Average price (all): $X.XX` — average price across all services, formatted to two decimal places; show `$0.00` when there are no services.
- `Average price (active): $X.XX` — average price across active services only; show `$0.00` when there are no active services.

## Settings view

- A **Toggle theme** button switches the UI theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute on a root wrapper element and persists as the user navigates.
- A **Show inactive** checkbox: when unchecked, inactive services are hidden in the Services view (but still counted in Stats). The checkbox is checked by default.

Seed the app with three initial services so the stats view is interesting on first load:
- **Logo design**, price `120.00`, active
- **Brand consultation**, price `200.00`, active
- **Social media kit**, price `85.00`, inactive
