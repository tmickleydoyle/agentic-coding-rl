# Client Tracker

A single-page React app for freelancers to manage their clients.

## Seed Data

The app starts with these clients pre-loaded:

| Name           | Email                     | Status   | Rate ($/hr) | Notes               |
|----------------|---------------------------|----------|-------------|---------------------|
| Acme Corp      | contact@acme.com          | active   | 120         | Long-term retainer  |
| Beta Studio    | hello@betastudio.com      | active   | 95          | UI design work      |
| Gamma LLC      | info@gammallc.com         | inactive | 80          | Project on hold     |
| Delta Partners | dp@deltapartners.com      | prospect | 110         | Proposal sent       |

## Fields

Each client record has:
- **name** (string, required)
- **email** (string, required)
- **status** (`active` | `inactive` | `prospect`)
- **rate** (number, hourly rate in USD)
- **notes** (string, optional)

## UI Layout

- Page heading: "Client Tracker"
- Filter bar with buttons: "All", "Active", "Inactive", "Prospect" — filters the list
- Client count display: e.g. "4 clients" (reflects filtered count)
- Client list — each row shows: name, email, status badge, rate, notes, Edit button, Delete button
- "Add Client" button that opens an inline form
- Add/Edit form fields: Name (text), Email (text), Status (select), Rate (number), Notes (textarea)
- Form has Save and Cancel buttons

## Behaviors

1. **Filter**: Clicking a filter button shows only clients with that status. "All" shows everyone. The active filter button is visually distinguished.
2. **Add Client**: Clicking "Add Client" shows the form. Filling all required fields (name, email) and clicking Save appends the client to the list and hides the form.
3. **Edit Client**: Clicking Edit on a row populates the form with that client's data. Saving updates the record in place.
4. **Delete Client**: Clicking Delete removes the client immediately.
5. **Client Count**: Updates in real time to reflect the currently visible (filtered) clients.
6. **Cancel**: Clicking Cancel hides the form without saving.
7. **Empty state**: If no clients match the filter, display "No clients found."

## Edge Cases

- Submitting the form with an empty name or email does nothing (no validation UI required, just no-op).
- Rate defaults to 0 if left blank.
- Deleting the last client in the filtered view shows the empty state message.
