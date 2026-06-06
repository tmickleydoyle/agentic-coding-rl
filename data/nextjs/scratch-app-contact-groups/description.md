# Contact Groups

A contact book app to manage people, organize them into groups, favorite contacts, and simulate CSV import.

## Routes
- **/** — All contacts with add/remove
- **/groups** — Create groups and assign contacts to groups
- **/favorites** — View favorited contacts
- **/import** — Simulate CSV import by pasting comma-separated contact data

## Features
- Add/remove contacts (name, email, phone, address, groupId, favorite)
- Create/remove groups (name, color)
- Toggle favorite on any contact
- Filter contacts by group
- Import: parse "name,email,phone" lines and bulk-add contacts

## Data Model
- Contact: id, name, email, phone, address, groupId, favorite
- Group: id, name, color
