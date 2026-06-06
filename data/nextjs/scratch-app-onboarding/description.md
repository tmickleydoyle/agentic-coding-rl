# scratch-app-onboarding

An employee onboarding app that tracks new hires, onboarding tasks, and completion progress.

## Routes
- `/` — Dashboard: new hires this month, overall completion rate, overdue tasks
- `/employees` — List/add new employees. Fields: name, email, department, startDate, managerId (optional)
- `/tasks` — Define onboarding task templates. Fields: title, description, dueOffset (days after start), category (HR/IT/Legal/Culture)
- `/checklist` — View/complete onboarding checklists per employee. Shows tasks with completion status

## Seed Data
Employees:
1. { id: "1", name: "Eve Torres", email: "eve@co.com", department: "Engineering", startDate: "2024-02-01", managerId: "" }
2. { id: "2", name: "Frank Liu", email: "frank@co.com", department: "Marketing", startDate: "2024-02-05", managerId: "" }

Task Templates:
1. { id: "1", title: "Sign offer letter", description: "DocuSign the offer", dueOffset: 1, category: "HR" }
2. { id: "2", title: "Setup laptop", description: "IT setup and config", dueOffset: 1, category: "IT" }
3. { id: "3", title: "Complete I-9", description: "Fill out I-9 form", dueOffset: 3, category: "Legal" }
4. { id: "4", title: "Team intro meeting", description: "Meet the team", dueOffset: 5, category: "Culture" }

Checklist Items (auto-generated per employee × template):
- All items for both employees start as incomplete

## Behaviors
- When a new employee is added, checklist items are auto-generated from all templates
- Completion rate = completed items / total items * 100%
- Dashboard shows employees with <100% completion
- Due date for each checklist item = employee.startDate + template.dueOffset days
- Overdue: items where due date < today and not completed
- Checklist page: filter by employee, show all tasks with checkbox to toggle completion

## Edge Cases
- Email must contain "@"
- Templates can be added/deleted; deleting a template removes associated checklist items
- startDate must be a valid date
