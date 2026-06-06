# Project Hours Logger

A single-page React app for logging and summarising time spent on projects.

## Seed Data

The app starts with these time entries pre-loaded:

| Project         | Date       | Hours | Description              |
|-----------------|------------|-------|--------------------------|
| Website Redesign| 2024-01-15 | 3     | Homepage layout           |
| Mobile App      | 2024-01-15 | 5     | Auth flow implementation  |
| Website Redesign| 2024-01-16 | 2     | Navigation component      |
| API Integration | 2024-01-16 | 4     | REST endpoints            |
| Mobile App      | 2024-01-17 | 6     | Push notifications        |

## Fields

Each time entry has:
- **project** (string, required)
- **date** (string, YYYY-MM-DD, required)
- **hours** (number, required, must be > 0)
- **description** (string, optional)

## UI Layout

- Page heading: "Project Hours"
- Total hours summary: "Total: X hrs" (sum of all entries)
- Project filter: dropdown to filter by project name, plus "All Projects" option
- Log entry form: Project (text input), Date (date input), Hours (number input), Description (textarea), Log button
- Entries list — each row shows: project name, date, hours, description, Delete button
- Per-project totals section: shows each unique project with its total hours

## Behaviors

1. **Log Entry**: Filling the form and clicking Log adds an entry. Project and hours are required; hours must be > 0.
2. **Delete Entry**: Clicking Delete removes that entry from the list and updates totals.
3. **Filter by Project**: Selecting a project in the dropdown filters the entries list to that project only. Totals section always shows all projects regardless of filter.
4. **Total Hours**: Updates in real time as entries are added or deleted (sum of all entries, not filtered).
5. **Per-Project Totals**: Shows each unique project name and its sum of hours. Updates when entries change.
6. **Empty form**: After logging an entry the form fields reset to empty/default.

## Edge Cases

- Submitting with empty project or hours <= 0 does nothing.
- If no entries match the filter, show "No entries found."
- Per-project totals section always lists all projects (even if list is filtered).
