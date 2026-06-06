# scratch-app-music-collection

A personal music collection manager for organizing albums, playlists, and exploring artists.

## Routes
- `/` — Home: shows collection summary
- `/library` — Browse and manage albums (add, remove, filter by genre)
- `/playlists` — Create and manage playlists, add albums to playlists
- `/artists` — View artists and their albums in the collection

## Features
- Add albums with title, artist, genre, year, and track count
- Mark albums as "want", "owned", or "streaming"
- Create named playlists and add/remove albums from them
- Artists page groups albums by artist
- All state managed via AppStateProvider context

## API
- `GET /api/tracks` — list all albums
- `POST /api/tracks` — add an album `{ title, artist, genre, year, tracks }`
- `PATCH /api/tracks` — update album ownership `{ id, ownership }`
- `DELETE /api/tracks` — remove an album `{ id }`
