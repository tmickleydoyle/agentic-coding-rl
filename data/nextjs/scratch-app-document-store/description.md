# Document Store

A personal document management app to organize files in folders, share documents, and search by title or tag.

## Routes
- **/** — Dashboard with document count and recent activity
- **/documents** — Browse and manage all documents
- **/folders** — Create and manage folders
- **/shared** — View documents shared with others
- **/search** — Search documents by title or tag

## Features
- Add/remove documents (title, description, url, folderId, tags, shared)
- Create/remove folders (name, color)
- Mark documents as shared/unshared
- Search by title or tag match
- Dashboard shows total document and folder counts

## Data Model
- Document: id, title, description, url, folderId, tags (string[]), shared, createdAt
- Folder: id, name, color
