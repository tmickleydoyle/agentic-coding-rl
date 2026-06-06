# 3D Print Queue Manager

A single-page app for managing a 3D printer job queue. Users can add new print jobs, reorder them, mark them as printing or done, and remove completed jobs.

## Seed Data

Start with these 3 jobs in the queue (in order):

| id | name                  | material | duration (min) | status  |
|----|-----------------------|----------|----------------|---------|
| 1  | Benchy Boat           | PLA      | 45             | waiting |
| 2  | Phone Stand           | PETG     | 120            | waiting |
| 3  | Cable Clip x10        | PLA      | 30             | waiting |

## Fields

- **name** (string, required) — model name
- **material** (string, required) — filament material (e.g. PLA, PETG, ABS)
- **duration** (number, required) — estimated print time in minutes (positive integer)
- **status** — one of: `waiting`, `printing`, `done`

## UI Layout

- Heading: "3D Print Queue"
- Form with inputs: name (text), material (text), duration (number), and an "Add Job" button
- Ordered list of jobs. Each job shows:
  - `data-testid="job-name-{id}"` — job name
  - `data-testid="job-material-{id}"` — material
  - `data-testid="job-duration-{id}"` — duration in minutes (just the number)
  - `data-testid="job-status-{id}"` — current status
  - "Start" button (only visible when status is `waiting`) — sets status to `printing`
  - "Done" button (only visible when status is `printing`) — sets status to `done`
  - "Remove" button (visible for all statuses) — removes the job from the list
  - "Move Up" button — moves job one position up (disabled/hidden for first job)
  - "Move Down" button — moves job one position down (disabled/hidden for last job)
- A summary line: `data-testid="queue-summary"` showing "X waiting, Y printing, Z done"

## Behaviors

1. **Add Job**: Fill in name, material, duration and click "Add Job". The job is appended to the end of the queue with status `waiting`. Form resets after adding. If any field is empty or duration is not a positive number, do nothing.
2. **Start**: Clicking "Start" on a waiting job changes its status to `printing`. Only one job can have status `printing` at a time — if another job is already printing, "Start" should still work (allow multiple printing jobs is acceptable, but at minimum the clicked job becomes `printing`).
3. **Done**: Clicking "Done" on a printing job changes its status to `done`.
4. **Remove**: Removes the job from the list entirely.
5. **Move Up / Move Down**: Swaps the job with the adjacent one in the queue. The first job has no "Move Up" button. The last job has no "Move Down" button.
6. **Summary**: Always reflects the current counts of waiting, printing, and done jobs.

## Edge Cases

- Adding a job with empty name, empty material, or duration <= 0 should do nothing (form stays filled or empty as-is).
- Removing all jobs leaves an empty list; summary reads "0 waiting, 0 printing, 0 done".
- Newly added jobs get a unique id that does not conflict with existing ids (use incrementing counter or Date.now()).
