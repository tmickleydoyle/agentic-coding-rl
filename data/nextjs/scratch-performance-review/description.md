# Performance Review

Build a single-page performance review app where managers can rate employees across multiple categories and view aggregate scores.

## Seed Data

Employees:
```
id: 1, name: "Alice Johnson",  department: "Engineering"
id: 2, name: "Bob Martinez",   department: "Marketing"
id: 3, name: "Carol White",    department: "Engineering"
```

Review categories (always in this order): Productivity, Communication, Teamwork, Innovation, Reliability

Rating scale: 1 to 5 (integers only)

Initial reviews: none (all unrated)

## UI Layout

- Page heading: "Performance Review"
- Employee selector: list of employee buttons/tabs. Clicking selects that employee.
- When an employee is selected:
  - Their name and department shown as a subheading
  - A review form showing each category with:
    - Category label
    - Five radio buttons labeled 1–5 (name attribute = category name)
    - Pre-filled with saved rating if one exists
  - A text area for comments (aria-label: "Comments")
  - "Save Review" button
- After save: confirmation message "Review saved for {name}" shown briefly (or persistently until next action)
- Average score display: for each reviewed employee, show their average score (sum of ratings / number of rated categories). Show "Not reviewed" if no ratings.
- Summary table below showing all employees with their average scores

## Review Form Behavior

- Each category must be rated 1–5 using radio buttons.
- Comments are optional.
- Clicking "Save Review" saves all 5 ratings and comments for the selected employee.
- If not all 5 categories rated, do not save (form stays open).
- Switching to another employee loads that employee's existing review (if any).

## data-testid Attributes

- `employee-tab` — each employee selector button
- `review-form` — the review form container
- `category-row` — each category row in the form
- `save-review` — the save review button
- `save-confirmation` — the confirmation message after save
- `summary-row` — each row in the summary table
- `summary-avg` — the average score cell in each summary row
