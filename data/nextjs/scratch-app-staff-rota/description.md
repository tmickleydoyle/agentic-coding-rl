# Staff Rota

A multi-route React application for managing staff schedules, shifts, and time-off requests.

## Routes
- **Home** (`home`): Dashboard showing total staff, scheduled shifts this week, pending requests, and total hours this week.
- **Shifts** (`shifts`): List all shifts with staffName, date, startTime, endTime, and role. Add new shifts via form.
- **Staff** (`staff`): List staff members with name, email, role, and department. Add new staff members.
- **Requests** (`requests`): List time-off requests with staffName, startDate, endDate, reason, and status (pending/approved/denied). Approve or deny pending requests.

## Seed Data
### Staff (5)
1. { id: "st1", name: "Emma Wilson", email: "emma@company.com", role: "Manager", department: "Operations" }
2. { id: "st2", name: "Liam Johnson", email: "liam@company.com", role: "Associate", department: "Sales" }
3. { id: "st3", name: "Olivia Brown", email: "olivia@company.com", role: "Associate", department: "Support" }
4. { id: "st4", name: "Noah Davis", email: "noah@company.com", role: "Senior", department: "Operations" }
5. { id: "st5", name: "Ava Martinez", email: "ava@company.com", role: "Associate", department: "Sales" }

### Shifts (6)
1. { id: "sh1", staffId: "st1", date: "2024-06-10", startTime: "09:00", endTime: "17:00", role: "Manager" }
2. { id: "sh2", staffId: "st2", date: "2024-06-10", startTime: "08:00", endTime: "16:00", role: "Associate" }
3. { id: "sh3", staffId: "st3", date: "2024-06-11", startTime: "12:00", endTime: "20:00", role: "Associate" }
4. { id: "sh4", staffId: "st4", date: "2024-06-11", startTime: "09:00", endTime: "17:00", role: "Senior" }
5. { id: "sh5", staffId: "st1", date: "2024-06-12", startTime: "09:00", endTime: "17:00", role: "Manager" }
6. { id: "sh6", staffId: "st5", date: "2024-06-12", startTime: "14:00", endTime: "22:00", role: "Associate" }

### Requests (3)
1. { id: "r1", staffId: "st2", startDate: "2024-06-20", endDate: "2024-06-21", reason: "Family event", status: "pending" }
2. { id: "r2", staffId: "st3", startDate: "2024-07-01", endDate: "2024-07-05", reason: "Holiday", status: "approved" }
3. { id: "r3", staffId: "st5", startDate: "2024-06-15", endDate: "2024-06-15", reason: "Medical", status: "pending" }

## Behaviors
- Add shift: POST /api/shifts with { staffId, date, startTime, endTime, role }.
- Add staff: POST /api/staff with { name, email, role, department }.
- Submit request: POST /api/requests with { staffId, startDate, endDate, reason }. Status defaults to "pending".
- Approve/deny: PATCH /api/requests/:id with { status: "approved" | "denied" }.
- Dashboard counts should reflect current data.

## data-testids
- `nav-home`, `nav-shifts`, `nav-staff`, `nav-requests`
- `stat-total-staff`, `stat-scheduled-shifts`, `stat-pending-requests`, `stat-total-hours`
- `shift-list`, `shift-item`, `shift-staff`, `shift-date`, `shift-time`, `shift-role`
- `add-shift-form`, `select-shift-staff`, `input-shift-date`, `input-shift-start`, `input-shift-end`, `input-shift-role`, `btn-add-shift`
- `staff-list`, `staff-item`, `staff-name`, `staff-role`, `staff-department`
- `add-staff-form`, `input-staff-name`, `input-staff-email`, `input-staff-role`, `input-staff-department`, `btn-add-staff`
- `request-list`, `request-item`, `request-staff`, `request-dates`, `request-status`, `btn-approve`, `btn-deny`
- `add-request-form`, `select-request-staff`, `input-request-start`, `input-request-end`, `input-request-reason`, `btn-submit-request`
