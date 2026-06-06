# Project Sprint App

Manage software development sprints, tickets, and team members.

## Routes
- **Home** (`home`): Dashboard with active sprints count (status=active), open tickets count (status=open), and team member count.
- **Sprints** (`sprints`): List sprints with name, startDate, endDate, status (planning/active/completed). Add new sprint. Mark sprint active or completed.
- **Tickets** (`tickets`): List tickets with title, sprintId (resolved to sprint name), assigneeId (resolved to team member name), status (open/in-progress/done), priority (low/medium/high). Add new ticket. Update status.
- **Team** (`team`): List team members with name, role, email. Add new team member.

## Seed Data
Two sprints:
1. "Sprint 1", 2024-06-01, 2024-06-14, active
2. "Sprint 2", 2024-06-15, 2024-06-28, planning

Three team members:
1. Dev Dan, Developer, dan@team.com
2. PM Paula, Product Manager, paula@team.com
3. QA Quinn, QA Engineer, quinn@team.com

Three tickets:
1. "Fix login bug", Sprint 1, Dev Dan, open, high
2. "Add dark mode", Sprint 1, Dev Dan, in-progress, medium
3. "Write test plan", Sprint 2, QA Quinn, open, medium

## Fields & Validation
- Sprint: name (required), startDate (required), endDate (required), status defaults to planning
- Ticket: title (required), sprintId (required), assigneeId (required), status defaults to open, priority (low/medium/high)
- Team member: name (required), role (required), email (required)

## Behaviors
- Sprints page: clicking "Start" sets status to active, "Complete" sets to completed
- Tickets page: filter by status; clicking status buttons updates ticket status
- Team page: shows each member with their in-progress ticket count
- API returns 400 for missing required fields

## API
- GET/POST /api/sprints — list / create sprint
- PATCH /api/sprints — update status `{ id, status }`
- GET/POST /api/tickets — list / create ticket
- PATCH /api/tickets — update status `{ id, status }`
- GET/POST /api/team — list / create team member

## data-testid Requirements
- nav-home, nav-sprints, nav-tickets, nav-team
- dashboard-active-sprints, dashboard-open-tickets, dashboard-team-count
- sprint-list, sprint-item, add-sprint-form, sprint-name-input, sprint-start-input, sprint-end-input, submit-sprint, start-sprint, complete-sprint
- ticket-list, ticket-item, ticket-status-filter, add-ticket-form, ticket-title-input, ticket-sprint-select, ticket-assignee-select, ticket-priority-select, submit-ticket, ticket-status-select
- team-list, team-item, add-team-form, team-name-input, team-role-input, team-email-input, submit-team
