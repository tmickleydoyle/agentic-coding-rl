# Team Roster

A single-page React app for managing a sports team roster. Displays all players with the ability to search by name, filter by position, add new players, and remove existing ones.

## Seed Data

Seven players pre-loaded:

| Jersey | Name             | Position   | Age |
|--------|------------------|------------|-----|
| 1      | Alex Rivera      | Goalkeeper | 28  |
| 5      | Priya Sharma     | Defender   | 24  |
| 8      | James O'Brien    | Midfielder | 26  |
| 10     | Sofia Martinez   | Forward    | 22  |
| 14     | Kevin Park       | Defender   | 27  |
| 17     | Dana Lee         | Midfielder | 23  |
| 23     | Carlos Mendes    | Forward    | 25  |

## Fields

- **Jersey**: positive integer (jersey number)
- **Name**: full name (string)
- **Position**: Goalkeeper | Defender | Midfielder | Forward
- **Age**: integer (years)

## UI Elements

- Page heading: "Team Roster"
- A player count indicator: "X players" where X updates dynamically — `data-testid="player-count"`
- A search text input with placeholder "Search by name" — `data-testid="search-input"`
- A `<select>` with label "Position" and options: All, Goalkeeper, Defender, Midfielder, Forward — `data-testid="position-filter"`
- An "Add Player" form with:
  - Jersey number input `data-testid="input-jersey"`
  - Name text input `data-testid="input-name"`
  - Position select `data-testid="input-position"` (options: Goalkeeper, Defender, Midfielder, Forward)
  - Age number input `data-testid="input-age"`
  - Submit button "Add Player" `data-testid="btn-add-player"`
- A list of player cards; each has `data-testid="player-card"`
- Within each card: `data-testid="card-jersey"`, `"card-name"`, `"card-position"`, `"card-age"`
- Each card has a remove button `data-testid="btn-remove"` that removes that player

## Behaviors

1. **Initial render**: 7 seed players displayed. Player count shows "7 players".
2. **Search**: typing in the search input filters displayed players by name (case-insensitive, partial match). Player count reflects the filtered count.
3. **Position filter**: selects only matching position. Combines with search.
4. **Add player**: valid form submission appends a new player card (new entries appear at the top). Count updates.
5. **Remove**: clicking "Remove" on a card deletes that player permanently.
6. **Validation**: if name is empty or jersey is 0/empty, Add Player does nothing.
7. **Search + filter combine**: both active simultaneously narrow the displayed list.

## Edge Cases

- After removing a player, count decreases by 1.
- Search is case-insensitive ("sofia" matches "Sofia Martinez").
- Position filter "All" shows all positions.
- Player count shows the count of currently visible (filtered) players.
