# scratch-app-reading-club

A personal reading club tracker where users can manage their reading list, track reading stats, and discover new books.

## Routes
- `/` — Home: shows current reading status and quick stats
- `/reading-list` — Manage books (add, mark read/unread, remove, filter by status)
- `/stats` — Reading statistics (books read, pages, genres breakdown)
- `/discover` — Browse and add suggested books to reading list

## Features
- Add books with title, author, genre, and page count
- Mark books as "reading", "read", or "want-to-read"
- View stats: total books, total pages read, favorite genre
- Discover page shows curated suggestions not yet in list
- All state managed via AppStateProvider context

## API
- `GET /api/books` — list all books
- `POST /api/books` — add a book `{ title, author, genre, pages }`
- `PATCH /api/books` — update book status `{ id, status }`
- `DELETE /api/books` — remove a book `{ id }`
