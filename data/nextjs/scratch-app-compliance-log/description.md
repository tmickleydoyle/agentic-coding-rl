# scratch-app-compliance-log

## Overview
A compliance log application for recording and reviewing compliance events/activities within an organization.

## Seed Data
Three compliance log entries:
1. { id: "1", title: "GDPR Data Audit", regulation: "GDPR", severity: "High", status: "Resolved", date: "2024-01-20", notes: "Annual audit completed" }
2. { id: "2", title: "SOX Financial Control Review", regulation: "SOX", severity: "Critical", status: "Open", date: "2024-02-15", notes: "Under review" }
3. { id: "3", title: "HIPAA Security Assessment", regulation: "HIPAA", severity: "Medium", status: "Open", date: "2024-03-05", notes: "Initial assessment" }

## Routes
- `/` — Dashboard: total entries, open count, resolved count, critical count
- `/logs` — Log list with filter by regulation and severity
- `/logs/add` — Add new log entry form
- `/logs/[id]` — Log entry detail

## Behaviors
- NavBar links to Dashboard and Compliance Logs
- Filters on list page work in real time (AND logic)
- Add form: title (required), regulation (GDPR/SOX/HIPAA/PCI/Other), severity (Low/Medium/High/Critical), status (Open/Resolved), date, notes (optional)
- Title required validation
- API GET /api/logs returns all entries
- API POST /api/logs adds entry, returns 201
- Dashboard stats: total, open count, resolved count, critical count

## Edge Cases
- Empty title shows "Title is required"
- Combined regulation + severity filter with no matches shows "No log entries found"
