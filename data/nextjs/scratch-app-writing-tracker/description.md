# scratch-app-writing-tracker

A writing productivity tracker for authors and content creators. Users can log writing sessions, set word-count goals, and view progress across multiple projects.

## Routes
- `/` — Dashboard: total words written today, active projects, recent entries list
- `/entries` — Writing entries list: add/delete entries with project, word count, date, notes
- `/goals` — Goals: set daily/weekly word-count targets per project; mark complete
- `/settings` — Settings: manage projects (add/rename/delete), set default daily goal

## Data model
### Entry
```ts
{ id: string; projectId: string; date: string; wordCount: number; notes: string; createdAt: number }
```
### Project
```ts
{ id: string; name: string; dailyGoal: number; color: string }
```
### Goal
```ts
{ id: string; projectId: string; type: "daily"|"weekly"; target: number; startDate: string; completed: boolean }
```

## Seed data
Projects: ["Novel Draft" (goal 500, blue), "Blog Posts" (goal 300, green), "Short Stories" (goal 200, red)]
Entries: 3 entries spread across projects with word counts 450, 320, 180
Goals: 2 active goals (1 daily novel 500, 1 weekly blog 2000)

## Behaviors
- Dashboard computes today's total words across all entries for today's date
- Adding an entry requires project, wordCount > 0, date
- Deleting an entry removes it from all views
- Goals page shows progress bar: sum of entry words for the goal period / target
- Settings: cannot delete a project that has entries (show error)
- Word counts are positive integers only; reject 0 or negative
- NavBar shows active route highlighted

## Edge cases
- If no entries today, dashboard shows 0 words today
- Empty goals list shows "No goals set" message
- Empty entries list shows "No entries yet" message
