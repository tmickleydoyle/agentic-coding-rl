# Standup Notes

Build a single-page React app for tracking daily standup notes per team member. Each member records what they did yesterday, what they plan today, and any blockers.

## Seed Data

Team members:
| id | name    |
|----|---------|
| 1  | Alice   |
| 2  | Bob     |
| 3  | Carol   |

Each member starts with empty yesterday/today/blockers strings.

## Layout

- Heading: "Standup Notes"
- A date input labelled "Date" (type="date"), defaulting to today's date in ISO format (YYYY-MM-DD). Use a hardcoded seed date of `2024-01-15` for the initial value.
- For each team member, a section with `data-testid="member-section"`:
  - The member's name as a subheading
  - Textarea labelled `"<name> - Yesterday"` for what they did yesterday
  - Textarea labelled `"<name> - Today"` for what they plan today
  - Textarea labelled `"<name> - Blockers"` for blockers (may be empty)
- A "Generate" button that produces formatted output
- A "Clear All" button that resets all textarea values to empty (keeps names and date)
- Output area (`data-testid="output"`) shown only after Generate is clicked, containing pre-formatted text

## Generated Output Format

```
Standup Notes - 2024-01-15

Alice
  Yesterday: <alice-yesterday>
  Today: <alice-today>
  Blockers: <alice-blockers or "None">

Bob
  Yesterday: <bob-yesterday>
  Today: <bob-today>
  Blockers: <bob-blockers or "None">

Carol
  Yesterday: <carol-yesterday>
  Today: <carol-today>
  Blockers: <carol-blockers or "None">
```

- If blockers is empty/whitespace, display `None`.
- Each member block separated by a blank line.
- Output displayed in a `<pre>` element inside the output area.

## Member Count

Show `data-testid="member-count"` with the number of members (always 3 for seed, but could change if add/remove were implemented — for this task it's fixed at 3).

## Add Member Form

Below the member sections, provide:
- Text input labelled "New Member Name"
- "Add Member" button — adds a new member with empty notes; does nothing if name is empty

## Remove

Each member section has a "Remove" button (aria-label `"Remove <name>"`). Clicking it removes that member. The member-count updates.

## Clear All

Resets all textarea values to empty string. Does not remove members or change the date.
