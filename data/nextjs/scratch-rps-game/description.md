# Rock Paper Scissors Game

A playable Rock Paper Scissors game where the user plays against the computer.

## Layout
- Page title: "Rock Paper Scissors"
- Three choice buttons: "Rock", "Paper", "Scissors"
  - Each button has `data-testid="choice-rock"`, `data-testid="choice-paper"`, `data-testid="choice-scissors"` respectively
- After a round, show:
  - `data-testid="player-choice"` — the player's choice (e.g., "Rock")
  - `data-testid="computer-choice"` — the computer's random choice (e.g., "Scissors")
  - `data-testid="round-result"` — result text: "You win!", "Computer wins!", or "It's a tie!"
- Score display:
  - `data-testid="score-player"` — player's total wins (starts at 0)
  - `data-testid="score-computer"` — computer's total wins (starts at 0)
  - `data-testid="score-ties"` — total ties (starts at 0)
- A "Reset" button that resets all scores to 0 and clears the round result

## Game Rules
- Rock beats Scissors
- Scissors beats Paper
- Paper beats Rock
- Same choice = tie

## Computer Choice
- The computer choice is random: pick uniformly from ["Rock", "Paper", "Scissors"]
- Use Math.random() to generate the computer's pick on each click

## Interactions
1. User clicks one of the three choice buttons.
2. Computer picks randomly.
3. Round result is determined and displayed.
4. Scores update: player wins increment score-player, computer wins increment score-computer, ties increment score-ties.
5. On next click, the previous round result is replaced.
6. "Reset" clears all scores to 0 and removes the round display (or shows empty strings).

## Initial State
- Scores all at 0
- No round result shown yet (player-choice, computer-choice, round-result are empty or absent)

## Data-testids Summary
- `choice-rock`, `choice-paper`, `choice-scissors` — the three choice buttons
- `player-choice` — shows player's last pick
- `computer-choice` — shows computer's last pick
- `round-result` — shows "You win!", "Computer wins!", or "It's a tie!"
- `score-player`, `score-computer`, `score-ties` — current score counts
- `reset-btn` — the Reset button
