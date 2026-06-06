# Lesson Plan Builder

Build a single-page React app for building and managing a weekly lesson plan with activities.

## Seed Data

Start with these activities pre-loaded:

```
[
  { id: 1, day: "Monday", title: "Introduction to Fractions", subject: "Math", duration: 30, completed: false },
  { id: 2, day: "Monday", title: "Reading Comprehension", subject: "English", duration: 45, completed: true },
  { id: 3, day: "Wednesday", title: "States of Matter", subject: "Science", duration: 40, completed: false },
  { id: 4, day: "Friday", title: "Ancient Rome", subject: "History", duration: 35, completed: false },
]
```

## Fields

Each activity has:
- `id`: unique number
- `day`: one of "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
- `title`: activity title (string)
- `subject`: one of "Math", "Science", "English", "History"
- `duration`: number of minutes
- `completed`: boolean

## UI Components

### Header
- `data-testid="app-title"`: shows "Lesson Plan"

### Add Activity Form
- `data-testid="add-form"` wraps the form
- Text input `data-testid="input-title"` for activity title
- Select `data-testid="select-day"` with options: Monday, Tuesday, Wednesday, Thursday, Friday
- Select `data-testid="select-subject"` with options: Math, Science, English, History
- Number input `data-testid="input-duration"` for minutes
- Submit button `data-testid="btn-add"` labeled "Add Activity"

### Day Filter
- Select `data-testid="filter-day"` with options: "All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"

### Activity List
- `data-testid="activity-list"` wraps the list
- Each activity item: `data-testid="activity-item-{id}"`
- Title: `data-testid="activity-title-{id}"`
- Day: `data-testid="activity-day-{id}"`
- Subject: `data-testid="activity-subject-{id}"`
- Duration: `data-testid="activity-duration-{id}"` shown as "{N} min"
- Complete button `data-testid="btn-complete-{id}"`: shows "Mark Done" if not completed, "Done" if completed
- Delete button `data-testid="btn-delete-{id}"`

### Summary
- `data-testid="total-activities"`: shows "Total: X activities"
- `data-testid="total-minutes"`: shows "Total: X min" — sum of durations of currently visible activities
- `data-testid="completed-count"`: shows "X completed" — count of visible completed activities

## Behaviors

1. **Add Activity**: fills form and submits. Activity added with `completed: false`. Form resets. id = max + 1.
2. **Filter by Day**: shows only activities for selected day. "All" shows everything.
3. **Mark Done**: toggles `completed` to true. Button changes to "Done" and stays there.
4. **Delete**: removes activity from list.
5. **Empty validation**: if title is empty, do nothing on submit.
6. **Totals update**: total activities, total minutes, and completed count all reflect current filter.
7. **Seed data**: four activities on initial render.

## Edge Cases
- total-minutes is sum only of visible (filtered) activities.
- completed-count is count of visible completed activities only.
- Default filter is "All".
- Duration defaults to 30 if input is blank/zero.
