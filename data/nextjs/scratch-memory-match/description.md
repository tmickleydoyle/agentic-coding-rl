# Memory Match Game

A card-flipping memory match game with an 4x4 grid of cards (8 pairs).

## Layout
- Page title: "Memory Match"
- A 4x4 grid of 16 cards (8 emoji pairs)
- Each card: `data-testid="card-{index}"` where index is 0–15
- When face-down, each card shows "?" or a blank face
- When face-up, each card shows its emoji symbol
- A moves counter: `data-testid="moves"` — number of pairs attempted (increments by 1 each time the user flips a second card)
- A matches counter: `data-testid="matches"` — number of matched pairs found (starts at 0)
- A "New Game" button: resets the board with newly shuffled cards, resets moves and matches to 0
- A win message: `data-testid="win-message"` showing "You win!" when all 8 pairs are matched; not shown until game is won

## Card Symbols (8 pairs = 16 cards)
Use these 8 emojis, each appearing twice:
"🍎", "🍌", "🍇", "🍓", "🍑", "🍒", "🥝", "🍋"

## Shuffle
On component mount and "New Game", shuffle the 16 cards randomly (Fisher-Yates or Math.random sort).

## Interaction Rules
1. All cards start face-down.
2. User clicks a face-down card → it flips face-up (shows emoji).
3. User clicks a second face-down card → it flips face-up.
   - If the two face-up cards match: both stay face-up permanently (matched state). Increment matches.
   - If they do not match: after a brief delay (300ms minimum), both flip back face-down.
   - Increment moves counter after checking the pair.
4. While two unmatched cards are face-up (before they flip back), clicking other cards does nothing.
5. Already-matched cards cannot be flipped again.
6. When all 8 pairs are matched, show the win message.

## Data-testids
- `data-testid="card-{index}"` — each card (0-indexed, 0 through 15)
- `data-testid="moves"` — current move count
- `data-testid="matches"` — current matched pairs count
- `data-testid="win-message"` — shown only when game is complete
- `data-testid="new-game-btn"` — the New Game button

## Card State Encoding
Each card has:
- `symbol`: the emoji string
- `flipped`: boolean (currently face-up, not yet resolved)
- `matched`: boolean (permanently revealed)

Cards that are `matched` or `flipped` show their symbol. Cards that are neither show "?".
