# Shot List Planner

A single-page app to plan and track shots for a photography session.

## Seed Data

Start with these four shots pre-loaded:

| id | subject           | type      | priority | done  |
|----|-------------------|-----------|----------|-------|
| 1  | Bride entrance    | Portrait  | High     | false |
| 2  | Wedding cake      | Detail    | Medium   | false |
| 3  | First dance       | Candid    | High     | true  |
| 4  | Venue exterior    | Wide      | Low      | false |

## Fields

- **Subject** (text input, required)
- **Type** (select: "Portrait" | "Detail" | "Candid" | "Wide" | "Macro")
- **Priority** (select: "High" | "Medium" | "Low")

## Behaviors

1. The page renders a heading "Shot List".
2. All seed shots are shown in a list on load.
3. Each shot shows its subject, type, priority, and a checkbox for done status.
4. A form at the top allows adding new shots.
5. Submitting a valid form adds the shot (done defaults to false) and clears subject input.
6. Subject is required and must not be empty/whitespace.
7. Each shot has a Delete button.
8. Toggling the checkbox marks a shot done or not done.
9. A summary line shows "X of Y completed" where X is done count and Y is total.
10. A "Show completed" / "Hide completed" toggle button filters the visible list.

## Edge Cases

- When all shots are deleted, shows "0 of 0 completed".
- Hiding completed shots does not delete them — toggling back shows them.
- The counter always reflects all shots (not just visible ones).
