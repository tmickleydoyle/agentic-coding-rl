# scratch-app-podcast-tracker

A podcast tracker for managing subscriptions, tracking episodes, and browsing listen history.

## Routes
- `/` — Home: shows subscription count and unplayed episodes
- `/subscriptions` — Manage podcast subscriptions (add, remove)
- `/episodes` — Browse episodes, mark as played/unplayed
- `/history` — View recently played episodes

## Features
- Subscribe to podcasts with title, host, category, and description
- Episodes belong to a podcast and have title, duration, and played status
- Mark episodes as played or unplayed
- History shows played episodes sorted by most recent
- All state managed via AppStateProvider context

## API
- `GET /api/podcasts` — list all podcasts and episodes
- `POST /api/podcasts` — add a podcast `{ title, host, category, description }`
- `PATCH /api/podcasts` — mark episode played `{ episodeId, played }`
- `DELETE /api/podcasts` — unsubscribe `{ id }`
