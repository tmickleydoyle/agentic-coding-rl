# Goal Tracker

A single-page React app for tracking personal goals with progress percentages.

## Seed Data

Start with these 3 goals:

```
[
  { id: 1, title: "Learn TypeScript", target: 100, progress: 45, category: "Learning" },
  { id: 2, title: "Run a 5K", target: 5, progress: 2, category: "Fitness" },
  { id: 3, title: "Save $1000", target: 1000, progress: 300, category: "Finance" }
]
```

## UI Elements

- Page heading: "Goal Tracker"
- A list of goals. Each goal displays:
  - The goal title
  - Category label
  - Progress bar: a div with `data-testid="progress-bar"` whose width style is set to the percentage complete (e.g. `style={{ width: "45%" }}`)
  - Progress text: `data-testid="progress-text"` showing "{progress} / {target}" (e.g. "45 / 100")
  - Percentage text: `data-testid="progress-pct"` showing the integer percentage (e.g. "45%")
  - An "Update Progress" button and a number input (aria-label: "Progress for {title}") to set the new progress value
  - `data-testid="goal-item"` on the goal row
- A form to add new goals with:
  - Text input: aria-label "Goal title"
  - Number input: aria-label "Target value"
  - Text input: aria-label "Category"
  - "Add Goal" button
- `data-testid="goal-count"` showing total goals (e.g. "Goals: 3")
- `data-testid="completed-goals"` showing goals at 100% or more (e.g. "Completed: 0")

## Behaviors

1. **Add goal**: Adds a new goal with progress=0. Ignores empty title. Clears inputs.
2. **Update progress**: Clicking "Update Progress" sets the goal's progress to the value in its input. Clamps to [0, target] — never below 0 or above target.
3. **Progress percentage**: Computed as Math.floor(progress / target * 100). Shown in progress-pct and used for progress-bar width.
4. **Completed count**: A goal is complete when progress >= target. completed-goals updates reactively.
5. **goal-count** updates when goals are added.
