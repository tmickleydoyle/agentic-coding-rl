# PR Checklist

A single-page app for tracking pull request review checklists. Each PR has a list of checklist items that reviewers must complete before merging.

## Seed Data

Pre-populate with the following PRs and their checklist items:

**PR #101 — "Add user authentication"** (author: alice, status: open)
- [ ] Tests written and passing
- [ ] Security review completed
- [ ] Documentation updated
- [x] Code reviewed by peer

**PR #102 — "Refactor database layer"** (author: bob, status: open)
- [ ] Tests written and passing
- [ ] Migration scripts verified
- [ ] Performance benchmarks run
- [ ] Code reviewed by peer

**PR #103 — "Fix login redirect bug"** (author: carol, status: merged)
- [x] Tests written and passing
- [x] Security review completed
- [x] Code reviewed by peer

## Fields

Each PR has:
- **prNumber** (number): PR identifier
- **title** (string): PR title
- **author** (string): author username
- **status** ("open" | "merged"): current status

Each checklist item has:
- **id** (number): unique identifier
- **label** (string): the checklist item text
- **checked** (boolean): whether the item is complete

## Behaviors

### View PRs
- All PRs are listed. Each shows: PR number (#NNN), title, author, status badge, completion count (e.g. "1/4 items"), and its checklist items.

### Toggle Checklist Item
- Each checklist item has a checkbox. Clicking it toggles the `checked` state.
- The completion count updates immediately (e.g. checking another item changes "1/4" to "2/4").

### Add New PR
- A form at the top has inputs for: PR number (number input), title, author, and status (select: open/merged).
- Clicking "Add PR" validates all fields are non-empty; PR number must be a positive integer.
- If validation fails, show error: "All fields are required." (or "PR number must be a positive integer." if number is invalid).
- On success, the new PR is added to the top of the list with an empty checklist. Form is cleared.

### Add Checklist Item to a PR
- Each PR card has a small form: a text input and an "Add Item" button.
- Typing in the input and clicking "Add Item" appends a new unchecked item to that PR's checklist.
- The item input is cleared after adding.
- If the input is empty/whitespace, do nothing (no error needed).

### Filter by Status
- Two filter buttons: "All" and "Open" and "Merged".
- Clicking a filter shows only PRs with that status; "All" shows all.

### Completion Indicator
- When all items in a PR are checked (and there is at least one item), the PR card shows "Ready to merge!" text.
- When a PR has zero items, show "No items" instead of a fraction.

## Edge Cases
- Toggling an item does not affect other PRs.
- A newly added PR starts with zero items ("No items").
- Filtering does not reset checklist state.
