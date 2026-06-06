# scratch-app-tv-tracker

A TV show tracker for managing watchlists, tracking episode progress, and marking favorite shows.

## Routes
- `/` — Home: shows watch stats
- `/watchlist` — Manage TV shows (add, remove, filter by status)
- `/progress` — Track episode progress per show (current season/episode)
- `/favorites` — View and manage favorited shows

## Features
- Add shows with title, network, genre, and total seasons
- Status: "want-to-watch", "watching", "completed", "dropped"
- Track current season and episode per show
- Favorite/unfavorite shows
- All state managed via AppStateProvider context

## API
- `GET /api/shows` — list all shows
- `POST /api/shows` — add a show `{ title, network, genre, totalSeasons }`
- `PATCH /api/shows` — update show `{ id, status?, currentSeason?, currentEpisode?, favorite? }`
- `DELETE /api/shows` — remove a show `{ id }`
