# Org Chart

Build a single-page organizational chart app where users can view the company hierarchy, add new members, and expand/collapse subtrees.

## Seed Data

Use this tree structure (managerId null = root):

```
id: 1, name: "Sandra Hill",   title: "CEO",               managerId: null
id: 2, name: "Tom Baker",     title: "VP Engineering",    managerId: 1
id: 3, name: "Lisa Park",     title: "VP Marketing",      managerId: 1
id: 4, name: "James Wu",      title: "Lead Engineer",     managerId: 2
id: 5, name: "Mia Torres",    title: "Frontend Dev",      managerId: 4
id: 6, name: "Nina Scott",    title: "Backend Dev",       managerId: 4
id: 7, name: "Oliver Reyes",  title: "Marketing Analyst", managerId: 3
```

## UI Layout

- Page heading: "Org Chart"
- Tree display: render the hierarchy as a nested list/tree
  - Root node shown at top
  - Each node shows: name and title
  - Nodes with children have a toggle button (expand/collapse) labeled "+" when collapsed, "-" when expanded
  - Children are visible by default (all expanded at start)
- "Add Member" button that shows/hides an add form
- Total member count display

## Add Member Form

Fields:
- Name input (aria-label: "Name")
- Title input (aria-label: "Title")
- Manager select (aria-label: "Manager") — options: all current members by name
- Buttons: "Add" and "Cancel"

Validation: name and title required. Manager is required (must select a manager).

On add: new member appears as child of selected manager. Form hides and fields clear.

## Expand/Collapse

- Each node that has children shows a toggle button.
- Clicking "-" (expanded) collapses that subtree (hides all descendants).
- Clicking "+" (collapsed) expands that node (shows immediate children; their own collapse state is preserved).
- The toggle button label switches between "+" and "-".

## data-testid Attributes

- `org-node` — every visible node in the tree
- `org-name` — the name span inside each node
- `org-title` — the title span inside each node
- `org-toggle` — the expand/collapse button for nodes that have children
- `member-count` — the total member count
- `add-form` — the add member form
