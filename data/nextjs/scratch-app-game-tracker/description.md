# Game Tracker App

Track your video game library, play sessions, and achievements.

## Routes
- **Home** (`home`): Dashboard with total games count, total play hours (sum of all session durations), and achievements count.
- **Games** (`games`): List all games with title, platform, genre, status (not started/playing/completed/dropped). Add new game. Delete game.
- **Sessions** (`sessions`): List play sessions with game title, date, duration (hours), notes. Add new session (select game, date, duration, notes).
- **Achievements** (`achievements`): List achievements with game title, name, description, unlockedDate. Add new achievement (select game, name, description, unlockedDate).

## Seed Data
Three games:
1. The Legend of Zelda, Nintendo Switch, Action-Adventure, playing
2. Elden Ring, PC, RPG, completed
3. Minecraft, PC, Sandbox, not started

Two sessions:
1. The Legend of Zelda, 2024-06-01, 2.5 hours, "Explored Hyrule"
2. Elden Ring, 2024-05-20, 3 hours, "Beat final boss"

Two achievements:
1. Elden Ring, "Elden Lord", "Complete the main story", 2024-05-20
2. The Legend of Zelda, "First Shrine", "Complete first shrine", 2024-06-01

## Fields & Validation
- Game: title (required), platform (required), genre (required), status (not started/playing/completed/dropped)
- Session: gameId (required), date (required), duration (required number, hours), notes (optional)
- Achievement: gameId (required), name (required), description (required), unlockedDate (required)

## Behaviors
- Games page: filter by status
- Sessions show game title resolved from gameId
- Total hours = sum of all session durations
- API returns 400 for missing required fields

## API
- GET/POST /api/games — list / create game
- DELETE /api/games — delete `{ id }`
- GET/POST /api/sessions — list / create session
- GET/POST /api/achievements — list / create achievement

## data-testid Requirements
- nav-home, nav-games, nav-sessions, nav-achievements
- dashboard-game-count, dashboard-total-hours, dashboard-achievement-count
- game-list, game-item, game-status-filter, add-game-form, game-title-input, game-platform-input, game-genre-input, game-status-select, submit-game, delete-game
- session-list, session-item, add-session-form, session-game-select, session-date-input, session-duration-input, session-notes-input, submit-session
- achievement-list, achievement-item, add-achievement-form, achievement-game-select, achievement-name-input, achievement-description-input, achievement-date-input, submit-achievement
