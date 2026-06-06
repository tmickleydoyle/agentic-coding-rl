# scratch-app-movie-club

A movie club app for tracking watchlists, writing reviews, and discovering new films.

## Routes
- `/` — Home: shows watch stats and recent activity
- `/watchlist` — Manage movies (add, mark watched/unwatched, remove, filter by status)
- `/reviews` — Write and view ratings/reviews for watched movies
- `/discover` — Browse curated movie suggestions

## Features
- Add movies with title, director, genre, year, and runtime
- Mark movies as "want-to-watch", "watching", or "watched"
- Write reviews with star rating (1-5) and text
- Discover page shows suggestions not yet in watchlist
- All state managed via AppStateProvider context

## API
- `GET /api/movies` — list all movies
- `POST /api/movies` — add a movie `{ title, director, genre, year, runtime }`
- `PATCH /api/movies` — update movie status or review `{ id, status?, review?, rating? }`
- `DELETE /api/movies` — remove a movie `{ id }`
