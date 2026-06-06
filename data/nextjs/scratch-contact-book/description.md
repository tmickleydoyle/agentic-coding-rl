# Contact Book

A single-page contact manager with search, add, and delete functionality.

## Seed Data (4 contacts, hardcoded)

| id | name           | email                   | phone        |
|----|----------------|-------------------------|--------------|
| 1  | Alice Johnson  | alice@example.com       | 555-0101     |
| 2  | Bob Smith      | bob@example.com         | 555-0102     |
| 3  | Carol White    | carol@example.com       | 555-0103     |
| 4  | David Brown    | david@example.com       | 555-0104     |

## Form Fields

- Name (text input, aria-label="Name")
- Email (text input, aria-label="Email")
- Phone (text input, aria-label="Phone")
- "Add Contact" button

## Interactions

- "Add Contact": validates name is non-empty AND email is non-empty; if valid appends to list and clears all three fields
- Invalid (empty name or empty email) does nothing
- Each contact row has a "Delete" button that removes it
- Search input (aria-label="Search") filters contacts in real time by name or email (case-insensitive substring match)
- Search does not affect stored contacts — clearing the search restores all contacts
- Contacts are displayed sorted alphabetically by name (A-Z) at all times

## Display

- Each contact row has data-testid="contact-row"
- Each row shows the contact's name, email, and phone
- Contact count shown as data-testid="count" with text "X contacts"
  - Count reflects the number of currently visible (filtered) contacts
