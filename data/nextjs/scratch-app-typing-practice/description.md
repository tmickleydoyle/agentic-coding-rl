# Typing Practice App

A multi-route typing practice application for improving typing speed and accuracy.

## Routes
- **Home** (`/`): Shows personal best WPM, total tests taken, and "Start Practice" button.
- **Practice** (`/practice`): Displays a random text passage. User types in a textarea. On submit, calculate WPM (words/time in minutes) and accuracy (correct chars / total chars * 100). Save the result.
- **Leaderboard** (`/leaderboard`): Ranked list of all scores by WPM descending, showing: rank, name, wpm, accuracy, date.
- **Settings** (`/settings`): User can set their display name (used when saving scores) and choose test duration (15s, 30s, 60s).

## Seed Data
Texts: `["The quick brown fox jumps over the lazy dog", "Pack my box with five dozen liquor jugs", "How vexingly quick daft zebras jump"]`
Scores: `[{ id: "sc1", name: "Alice", wpm: 72, accuracy: 98, date: "2024-01-10" }, { id: "sc2", name: "Bob", wpm: 55, accuracy: 94, date: "2024-01-11" }]`

## Behaviors
- WPM = (number of words typed correctly) / (elapsed seconds / 60). Words split by space.
- Accuracy = (number of correctly typed characters) / (length of prompt) * 100, rounded to 1 decimal.
- Score is only saved if user typed at least 1 word.
- Leaderboard sorted by WPM descending.
- Settings: name defaults to "Anonymous"; duration defaults to 30.
- Practice page shows the selected text and a text area for input.

## API
`GET /api/scores` → returns `{ scores: Score[] }` sorted by wpm desc
`POST /api/scores` body `{ name, wpm, accuracy, date }` → returns `{ score: Score }`

## Edge Cases
- Empty input on practice: show error "Type something first".
- Leaderboard with no scores: show "No scores yet".
- WPM of 0 if no complete words typed.
