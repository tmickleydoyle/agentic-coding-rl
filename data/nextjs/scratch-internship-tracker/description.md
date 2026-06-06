# Internship Tracker

A single-page React app for tracking internship applications.

## Seed Data

Start with these 4 applications pre-loaded:

| Company | Role | Status | Deadline | Notes |
|---------|------|--------|----------|-------|
| Google | Software Engineer Intern | Applied | 2024-01-15 | Submitted via LinkedIn |
| Meta | Product Intern | Interview | 2024-01-20 | Phone screen scheduled |
| Amazon | SDE Intern | Rejected | 2024-01-10 | No feedback provided |
| Stripe | Engineering Intern | Offer | 2024-02-01 | Great team, $8500/mo |

## Fields

Each application has:
- **company** (string): Company name
- **role** (string): Job title
- **status** (string): One of "Applied", "Interview", "Offer", "Rejected"
- **deadline** (string): Date string (YYYY-MM-DD)
- **notes** (string): Free-text notes

## Layout

- Page heading: "Internship Tracker"
- Summary row showing counts: total applications, interviews, offers
- A form to add new applications
- A list/table of all applications

## Add Form

Fields:
- Text input labeled "Company" (data-testid="input-company")
- Text input labeled "Role" (data-testid="input-role")
- Select labeled "Status" with options: Applied, Interview, Offer, Rejected (data-testid="select-status")
- Date input labeled "Deadline" (data-testid="input-deadline")
- Textarea labeled "Notes" (data-testid="input-notes")
- Submit button labeled "Add Application" (data-testid="btn-add")

Validation: company and role are required. If either is empty, do not add and show an error message with data-testid="error-message".

On successful add, clear the form.

## Application List

Each application rendered with:
- data-testid="application-item" on the container
- data-testid="app-company" showing company name
- data-testid="app-role" showing role
- data-testid="app-status" showing status
- data-testid="app-deadline" showing deadline
- data-testid="app-notes" showing notes
- A "Delete" button with data-testid="btn-delete" that removes the application

## Status Filter

A set of filter buttons above the list:
- "All" (data-testid="filter-all") — shows all applications (default)
- "Applied" (data-testid="filter-Applied")
- "Interview" (data-testid="filter-Interview")
- "Offer" (data-testid="filter-Offer")
- "Rejected" (data-testid="filter-Rejected")

Clicking a filter shows only matching applications. The active filter button should have an "active" class or aria-pressed="true".

## Summary Counts

- data-testid="count-total": total number of applications
- data-testid="count-interviews": number with status "Interview"
- data-testid="count-offers": number with status "Offer"

## Edge Cases

- Adding with empty company or role shows error (data-testid="error-message")
- Error clears on next successful submission
- Filter "All" after applying a status filter shows all again
- Delete removes only the targeted application
