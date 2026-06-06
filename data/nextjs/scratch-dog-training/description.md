# Dog Training Session Tracker

A single-page React app for tracking dog training sessions and command mastery progress.

## Seed Data

Three dogs pre-loaded:
- **Buddy** (Golden Retriever, 2 years old)
- **Luna** (Border Collie, 1 year old)
- **Max** (German Shepherd, 3 years old)

Each dog starts with these commands and mastery levels (0–100):
- Buddy: Sit=90, Stay=75, Shake=60, Heel=40
- Luna: Sit=85, Stay=50, Shake=30, Heel=20
- Max: Sit=95, Stay=88, Shake=70, Heel=65

## UI Layout

### Dog Selector
- A row of buttons, one per dog, labeled with the dog's name.
- Clicking a dog button selects that dog and shows their details.
- The active dog button should be visually distinct (e.g., different style).
- Show the selected dog's name, breed, and age below the selector.

### Command Progress Table
- Display a table with columns: Command | Mastery | Progress Bar | Actions
- Each row shows one command for the selected dog.
- Mastery is shown as a percentage (e.g., "75%").
- Progress bar: a div with data-testid="progress-bar-<command-lowercase>" whose width style reflects mastery percentage.
- Actions: two buttons per row — "+" (increments mastery by 5, max 100) and "−" (decrements mastery by 5, min 0).

### Log Session
- A form with:
  - A text input labeled "Command" (for command name, data-testid="session-command-input")
  - A number input labeled "Duration (min)" (data-testid="session-duration-input")
  - A textarea labeled "Notes" (data-testid="session-notes-input")
  - A submit button labeled "Log Session"
- On submit: add a new session entry to the log below. Clear the form.
- Sessions are per-dog (switching dogs shows that dog's sessions).

### Session Log
- List of logged sessions shown below the form.
- Each entry shows: command name, duration, notes (data-testid="session-entry-<index>").
- If no sessions, show "No sessions logged yet" (data-testid="no-sessions-msg").

## Behaviors & Edge Cases

- Mastery cannot exceed 100 or go below 0.
- If the command input is empty on submit, do not add the session.
- Switching dogs resets the form and shows that dog's own sessions and command mastery.
- All state managed with useState; no external libraries.
