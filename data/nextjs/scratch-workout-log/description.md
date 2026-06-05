# Build a Workout Log

Build a single-page React application for logging a workout session.

## Layout

The page has a heading **Workout Log**.

## Adding an exercise

At the top there is a form with four fields and a button:

- **Exercise name** – text input
- **Sets** – number input
- **Reps** – number input
- **Weight (kg)** – number input
- A button labeled **Add exercise**

Clicking **Add exercise** appends the exercise to the log. If the exercise name is blank/whitespace, or any of sets/reps/weight is not a positive number (≤ 0 or empty), the entry must **not** be added. After a successful add the form fields reset to empty.

## Exercise list

Each exercise is displayed as a row (list item) showing:

- The exercise name
- The sets × reps × weight summary in the exact format `3 x 10 x 60 kg`
- The per-exercise volume in the exact format `Volume: 1800 kg` (volume = sets × reps × weight, no decimals)
- A **Remove** button that deletes that exercise

## Session totals

Below the list, always visible, show:

- `Total exercises: 3`
- `Total session volume: 5400 kg`

Both update immediately as exercises are added or removed. When the list is empty the totals show `Total exercises: 0` and `Total session volume: 0 kg`.

State is kept in memory only — no backend, no persistence.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
