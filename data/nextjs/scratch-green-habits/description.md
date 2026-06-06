# Green Habits Tracker

A single-page app for tracking eco-friendly habits and logging completions.

## Seed Data

Pre-load these 4 habits on mount:

| Name                  | Category   | Target (days/week) | Completed This Week |
|-----------------------|------------|-------------------|---------------------|
| Bring reusable bag    | Shopping   | 3                 | 2                   |
| Bike instead of drive | Transport  | 5                 | 3                   |
| Meatless Monday       | Food       | 1                 | 1                   |
| Shorter showers       | Home       | 7                 | 4                   |

## Fields (for adding a new habit)

- **Name** (text input, required)
- **Category** (select: "Shopping" | "Transport" | "Food" | "Home" | "Energy" | "Other", required)
- **Target days/week** (number input, required, integer 1–7)

## Behaviors

### Add Habit
- Form with Name, Category, Target and "Add Habit" button.
- On submit: validate Name and Target are provided; if missing show "Name and target are required".
- Target must be an integer between 1 and 7 inclusive; if outside range show "Target must be between 1 and 7".
- On valid submit: add habit with completions=0 for the week, clear form (Category resets to "Shopping").

### Habit List
- Display all habits.
- Each row shows: name, category, completed count, target.
- Progress indicator: show "On Track" if completed >= target, otherwise "Behind".
- Each habit has a "+" button (data-testid `increment-{id}`) that increments completions (max = target, cannot exceed target).
- Each habit has a "Delete" button.

### Summary Panel
- Total habits count.
- Count of habits that are "On Track" (completed >= target).
- Overall completion percentage: (sum of completed) / (sum of targets) * 100, formatted as "XX%" rounded to nearest integer. Show "0%" if no habits.

### Category Filter
- Select dropdown with "All" + category options to filter displayed habits.
- Stats always reflect all habits.

## Edge Cases
- Incrementing a completed habit at target does nothing (stays at target).
- Deleting the only on-track habit updates the on-track count to 0.
- A habit added with target=7 and completions=0 shows "Behind".
