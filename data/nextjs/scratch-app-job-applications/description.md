# Job Application Tracker

A single-page React app to track job applications through a pipeline with contacts and notes.

## Routes / Pages

- **Home** (`home`): Dashboard — total applications, count by status, most-recent application company name.
- **Applications** (`applications`): List all applications. Each application: company, role, status (`applied`|`interview`|`offer`|`rejected`), appliedDate (ISO date), url (optional). Add application. Update status via dropdown. Delete application.
- **Contacts** (`contacts`): List contacts associated with applications. Each contact: name, email, applicationId, role (string). Add contact. Delete contact.
- **Notes** (`notes`): List notes. Each note: applicationId, text, createdAt (ISO date string). Add note (select application, enter text). Delete note.

## Seed Data

- Application: `{ id: "a1", company: "Acme Inc", role: "Engineer", status: "applied", appliedDate: "2025-10-01", url: "" }`
- Application: `{ id: "a2", company: "Globex", role: "Designer", status: "interview", appliedDate: "2025-10-15", url: "https://globex.com" }`
- Contact: `{ id: "ct1", applicationId: "a1", name: "John Doe", email: "john@acme.com", role: "Recruiter" }`
- Note: `{ id: "n1", applicationId: "a1", text: "Applied via LinkedIn", createdAt: "2025-10-01" }`

## Behaviors

- Dashboard shows count for each status (applied, interview, offer, rejected).
- Most recent application = sorted by appliedDate descending, show company name.
- Applications sorted by appliedDate descending.
- Adding application requires company and role (non-empty), appliedDate.
- Contacts show application company name next to contact name.
- Notes show application company next to note text.
- NavBar: Home, Applications, Contacts, Notes. Active route `data-active="true"`.

## API Routes

`/api/applications` — GET all; POST create `{ company, role, status, appliedDate, url }`; PATCH `?id=` body `{ status }`; DELETE `?id=`.

## Data-testids

- `nav-home`, `nav-applications`, `nav-contacts`, `nav-notes`
- `dashboard-total`, `dashboard-applied-count`, `dashboard-interview-count`, `dashboard-offer-count`, `dashboard-rejected-count`, `dashboard-recent-company`
- `app-list`, `app-item`, `app-add-form`, `app-company-input`, `app-role-input`, `app-date-input`, `app-url-input`, `app-submit`, `app-status-select`, `app-delete`
- `contact-list`, `contact-item`, `contact-add-form`, `contact-app-select`, `contact-name-input`, `contact-email-input`, `contact-role-input`, `contact-submit`, `contact-delete`
- `note-list`, `note-item`, `note-add-form`, `note-app-select`, `note-text-input`, `note-submit`, `note-delete`
