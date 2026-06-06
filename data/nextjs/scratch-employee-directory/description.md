# Employee Directory

Build a single-page employee directory app where users can browse, search, and add employees.

## Seed Data

Start with these 5 employees:

```
id: 1, name: "Alice Johnson",   department: "Engineering",  role: "Senior Engineer",  email: "alice@company.com",   phone: "555-0101"
id: 2, name: "Bob Martinez",    department: "Marketing",    role: "Marketing Manager", email: "bob@company.com",    phone: "555-0102"
id: 3, name: "Carol White",     department: "Engineering",  role: "Junior Engineer",  email: "carol@company.com",   phone: "555-0103"
id: 4, name: "David Lee",       department: "HR",           role: "HR Specialist",    email: "david@company.com",   phone: "555-0104"
id: 5, name: "Eva Chen",        department: "Marketing",    role: "Content Writer",   email: "eva@company.com",     phone: "555-0105"
```

## UI Layout

- Page heading: "Employee Directory"
- Search input (aria-label: "Search employees") that filters the employee list in real time
- Department filter dropdown (aria-label: "Filter by department") with options: "All", "Engineering", "Marketing", "HR"
- "Add Employee" button that shows/hides an add-employee form
- Employee list showing each employee as a card
- Each card shows: name, department, role, email, phone
- Count display showing "Showing X of Y employees"

## Add Employee Form

Fields (all required):
- Name (aria-label: "Name")
- Department select (aria-label: "Department") with options: Engineering, Marketing, HR
- Role (aria-label: "Role")
- Email (aria-label: "Email")
- Phone (aria-label: "Phone")

Buttons: "Save Employee" and "Cancel"

On save: validate all fields non-empty, add employee to list, hide form, clear fields.
On cancel: hide form, clear fields.

## Filtering

- Search filters by name, role, and email (case-insensitive substring match)
- Department filter narrows by exact department match ("All" shows all)
- Both filters apply simultaneously
- Count reflects filtered results: "Showing X of Y employees" where Y is total count

## data-testid Attributes

- `employee-card` — each employee card
- `employee-name` — name inside each card
- `employee-department` — department inside each card
- `employee-role` — role inside each card
- `employee-email` — email inside each card
- `employee-phone` — phone inside each card
- `employee-count` — the count display
- `add-form` — the add employee form container
