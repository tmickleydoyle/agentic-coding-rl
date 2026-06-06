# Freelance Tracker

A single-page React application for freelancers to manage clients, projects, and invoices.

## Routes / Pages

- **Home** (`home`): Dashboard showing summary stats — total clients, active projects, unpaid invoices total.
- **Clients** (`clients`): List all clients. Add a new client (name, email, company). Delete a client (also deletes their projects/invoices).
- **Projects** (`projects`): List all projects. Each project has: title, clientId, status (`active`|`completed`), hourlyRate (number), hoursLogged (number). Add project. Update status. Delete project.
- **Invoices** (`invoices`): List all invoices. Each invoice has: id, projectId, amount (number), status (`unpaid`|`paid`), dueDate (ISO date string). Add invoice (amount auto-calculated as project.hourlyRate * project.hoursLogged if not overridden). Mark invoice paid. Delete invoice.

## Seed Data

On first load the store contains:
- Client: `{ id: "c1", name: "Alice Corp", email: "alice@example.com", company: "Alice Corp" }`
- Client: `{ id: "c2", name: "Bob LLC", email: "bob@example.com", company: "Bob LLC" }`
- Project: `{ id: "p1", clientId: "c1", title: "Website Redesign", status: "active", hourlyRate: 100, hoursLogged: 10 }`
- Project: `{ id: "p2", clientId: "c2", title: "Logo Design", status: "completed", hourlyRate: 80, hoursLogged: 5 }`
- Invoice: `{ id: "i1", projectId: "p1", amount: 1000, status: "unpaid", dueDate: "2025-12-01" }`
- Invoice: `{ id: "i2", projectId: "p2", amount: 400, status: "paid", dueDate: "2025-11-01" }`

## Behaviors

- Dashboard: unpaid invoices total = sum of amount for all invoices with status "unpaid".
- Adding a client requires name and email (non-empty); company is optional.
- Adding a project requires title, selecting a clientId, hourlyRate > 0, hoursLogged >= 0.
- Deleting a client removes all their projects and all invoices linked to those projects.
- NavBar shows links: Home, Clients, Projects, Invoices.
- Active route link has `data-active="true"`.

## API Routes

`/api/invoices` — GET returns all invoices; POST creates a new invoice (body: `{ projectId, amount, dueDate }`); PATCH `?id=` updates status to paid; DELETE `?id=` removes invoice.

## Data-testids

- `nav-home`, `nav-clients`, `nav-projects`, `nav-invoices`
- `dashboard-clients-count`, `dashboard-projects-count`, `dashboard-unpaid-total`
- `client-list`, `client-item`, `client-add-form`, `client-name-input`, `client-email-input`, `client-submit`, `client-delete`
- `project-list`, `project-item`, `project-add-form`, `project-title-input`, `project-client-select`, `project-rate-input`, `project-hours-input`, `project-submit`, `project-delete`, `project-status-toggle`
- `invoice-list`, `invoice-item`, `invoice-add-form`, `invoice-project-select`, `invoice-amount-input`, `invoice-due-input`, `invoice-submit`, `invoice-pay`, `invoice-delete`
