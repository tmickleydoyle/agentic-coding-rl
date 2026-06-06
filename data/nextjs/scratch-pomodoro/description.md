# Pomodoro Timer

A single-page Pomodoro productivity timer with work/break sessions and a task list.

## Timer Modes

- **Work**: 25 minutes (1500 seconds)
- **Short Break**: 5 minutes (300 seconds)
- **Long Break**: 15 minutes (900 seconds)

## Timer Controls

- Display shows time remaining as "MM:SS" (data-testid="timer-display")
- "Start" button begins countdown; label changes to "Pause" while running
- "Pause" button pauses the countdown; label reverts to "Start"
- "Reset" button stops the timer and resets to the current mode's full duration
- Mode buttons: "Work", "Short Break", "Long Break" — clicking one resets the timer to that mode's duration and stops any running countdown
- Current mode shown as data-testid="current-mode"

## Pomodoro Count

- A completed Pomodoro is counted when a Work session timer reaches 00:00
- Count displayed as data-testid="pomodoro-count" with text "Pomodoros: X"
- Completing a Work session does NOT auto-switch modes; it just increments the count and stops at 00:00

## Task List

- Text input (aria-label="New task") and "Add Task" button
- Tasks added with non-empty input; input clears after adding
- Each task row has data-testid="task-row"
- Each task has a checkbox; checking it marks it as done (strike-through via data attribute data-done="true")
- Each task has a "Remove" button to delete it

## Notes

- Timer uses real time via setInterval (1-second tick)
- Tests will mock/fake timers via vitest fake timers — the component must use window.setInterval / window.clearInterval so they can be controlled
- Starting from a fresh render the timer shows "25:00" in Work mode
