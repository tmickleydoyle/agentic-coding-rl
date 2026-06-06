# Contact Manager

A multi-route contact management application.

## Routes
- `/home` — Shows total contact count, list of groups, quick-add button
- `/contacts` — Full list of all contacts; add new contact; delete contact
- `/groups` — Manage groups: add group, list groups with contact counts
- `/search` — Search contacts by name or email (live filter as user types)

## Data Model

### Contact
```ts
{ id: string; name: string; email: string; phone: string; group: string }
```

### Group
```ts
{ id: string; name: string }
```

## Seed Data
Groups: `[{id:"g1",name:"Friends"},{id:"g2",name:"Work"},{id:"g3",name:"Family"}]`

Contacts:
```
{id:"ct1", name:"Alice Smith", email:"alice@example.com", phone:"555-0101", group:"Friends"}
{id:"ct2", name:"Bob Jones", email:"bob@example.com", phone:"555-0102", group:"Work"}
{id:"ct3", name:"Carol White", email:"carol@example.com", phone:"555-0103", group:"Family"}
{id:"ct4", name:"Dan Brown", email:"dan@example.com", phone:"555-0104", group:"Friends"}
```

## Behaviors
- Add contact: name (required), email (required, valid format), phone (optional), group (select from list)
- Delete contact: removes immediately
- Add group: name (required, unique case-insensitive)
- Search: filters contacts by name or email substring (case-insensitive), shows matching rows
- Home: shows total count and list of group names

## Edge Cases
- Cannot add contact with empty name or invalid email (must contain @)
- Cannot add duplicate group name (case-insensitive)
- Search with empty string shows all contacts
- Deleting a contact updates the total count

## UI Requirements
- NavBar: `data-testid="nav-home"`, `data-testid="nav-contacts"`, `data-testid="nav-groups"`, `data-testid="nav-search"`
- Contact rows: `data-testid="contact-row-{id}"`
- Delete buttons: `data-testid="delete-contact-{id}"`
- Add contact form: `data-testid="contact-name"`, `data-testid="contact-email"`, `data-testid="contact-phone"`, `data-testid="contact-group"`, `data-testid="add-contact-btn"`
- Contact error: `data-testid="contact-error"`
- Group rows: `data-testid="group-row-{id}"`
- Add group form: `data-testid="group-name"`, `data-testid="add-group-btn"`
- Group error: `data-testid="group-error"`
- Home total: `data-testid="contact-count"`
- Search input: `data-testid="search-input"`
- Search results: `data-testid="search-results"` wrapping filtered contact rows
