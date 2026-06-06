# scratch-app-game-library

A personal game library app for managing game collection, wishlist, and gaming statistics.

## Routes
- `/` — Home: shows collection summary
- `/collection` — Browse and manage owned/played games (add, filter by status/platform)
- `/wishlist` — Games you want to buy or try
- `/stats` — Gaming stats: total games, hours played, favorite genre

## Features
- Add games with title, developer, genre, platform, and estimated hours
- Status: "wishlist", "owned", "playing", "completed", "dropped"
- Track hours played per game
- Stats page shows totals and breakdowns
- All state managed via AppStateProvider context

## API
- `GET /api/games` — list all games
- `POST /api/games` — add a game `{ title, developer, genre, platform, estimatedHours }`
- `PATCH /api/games` — update game `{ id, status?, hoursPlayed? }`
- `DELETE /api/games` — remove a game `{ id }`
