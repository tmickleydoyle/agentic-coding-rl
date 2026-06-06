# scratch-app-personal-crm

## Overview
Build a Personal CRM (Customer Relationship Manager) app for tracking professional contacts, notes, and tags. Users can manage their network of contacts with detailed information.

## Routes
- `/` — Dashboard: total contacts count, recent contacts (last 5 added), quick-add form
- `/contacts` — Contact list with search by name/company, shows all contacts
- `/notes` — All notes across contacts, filterable by contact
- `/tags` — Tag management: list all tags, contacts per tag

## Data Model

### Contact
```ts
interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  tags: string[];
  notes: Note[];
  createdAt: string; // ISO date
}
```

### Note
```ts
interface Note {
  id: string;
  contactId: string;
  content: string;
  createdAt: string;
}
```

## Seed Data (loaded on store init)
3 contacts:
1. id:"c1", name:"Alice Johnson", company:"Acme Corp", email:"alice@acme.com", phone:"555-1001", tags:["investor","mentor"], notes:[{id:"n1",contactId:"c1",content:"Met at React Conf",createdAt:"2024-01-15"}]
2. id:"c2", name:"Bob Smith", company:"Beta Inc", email:"bob@beta.com", phone:"555-1002", tags:["client"], notes:[]
3. id:"c3", name:"Carol White", company:"Gamma Ltd", email:"carol@gamma.com", phone:"555-1003", tags:["mentor"], notes:[{id:"n2",contactId:"c3",content:"Intro via LinkedIn",createdAt:"2024-02-10"}]

## Behaviors

### Dashboard (`/`)
- Shows `data-testid="contact-count"` with total contact count
- Shows `data-testid="recent-contacts"` listing last 5 contacts by createdAt desc
- Quick-add form: fields name, company, email; submit adds contact, clears form
- New contacts get empty tags/notes, createdAt = new Date().toISOString()

### Contacts (`/contacts`)
- Search input `data-testid="search-input"` filters by name or company (case-insensitive)
- Each contact row: `data-testid="contact-row"` with name, company, email, tags
- Delete button per contact removes it from store

### Notes (`/notes`)
- Shows all notes: `data-testid="note-item"` with content and contact name
- Filter dropdown `data-testid="contact-filter"` — "All" or specific contact name
- Add note form: select contact, textarea content, submit adds note

### Tags (`/tags`)
- Lists all unique tags: `data-testid="tag-item"` with tag name and count of contacts
- Click tag shows contacts with that tag

## API Route
`GET /api/contacts` — returns JSON array of all contacts (no notes embedded, just ids)
`POST /api/contacts` — body {name,company,email,phone,tags} creates contact, returns it

## Edge Cases
- Search with no results shows `data-testid="no-results"`
- Empty notes list shows `data-testid="empty-notes"`
- Deleting a contact removes its notes from the notes view
