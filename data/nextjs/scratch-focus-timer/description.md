# Focus Timer

A single-page React app for managing focus sessions (Pomodoro-style) with a session log.

## Seed Data

Preset durations (in minutes): 25, 10, 5

Session log starts empty.

## UI Elements

- Page heading: "Focus Timer"
- Timer display: `data-testid="timer-display"` showing remaining time as "MM:SS" (e.g. "25:00")
- Three preset buttons labeled "25 min", "10 min", "5 min" — clicking them sets the timer duration
- A number input (aria-label: "Custom minutes") for setting a custom duration (integer minutes)
- "Set Custom" button that applies the custom minutes value
- "Start" button — starts the countdown (changes to "Pause" while running)
- "Pause" button (same button, toggles) — pauses the countdown
- "Reset" button — resets timer to current selected duration, stops the countdown
- `data-testid="session-status"` showing "Running" when counting down, "Paused" when paused, "Ready" when stopped/not started
- A session log section:
  - When a session completes (reaches 00:00), a log entry is added automatically
  - Each log entry has `data-testid="session-log-item"` and shows the duration in minutes (e.g. "25 min session")
  - `data-testid="session-count"` showing "Sessions: {n}"
- "Clear Log" button removes all log entries

## Behaviors

1. **Preset selection**: Clicking a preset button sets the selected duration and resets the timer display. Stops any running timer.
2. **Custom duration**: Typing a positive integer and clicking "Set Custom" sets the duration. Ignores zero/negative/non-numeric. Resets the display and stops any running timer.
3. **Start/Pause**: "Start" begins countdown by decrementing seconds each second. "Pause" halts it. Clicking Start again resumes.
4. **Reset**: Stops the timer and resets display to the current duration.
5. **Completion**: When timer hits 00:00, it stops, adds a session log entry, and status shows "Ready".
6. **Session count**: Updates after each completed session.

## Implementation note

Use `setInterval` inside a `useEffect` with proper cleanup. The timer decrements by 1 second per tick.
