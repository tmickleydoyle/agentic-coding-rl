# scratch-app-policy-manager

## Overview
A policy management application for maintaining organizational policies with versioning, ownership, and review schedules.

## Seed Data
Three initial policies:
1. { id: "1", title: "Acceptable Use Policy", department: "IT", version: "2.1", status: "Active", owner: "IT Director", reviewDate: "2024-12-01", summary: "Guidelines for acceptable use of company IT resources" }
2. { id: "2", title: "Remote Work Policy", department: "HR", version: "1.0", status: "Draft", owner: "HR Manager", reviewDate: "2024-06-15", summary: "Rules and guidelines for remote work arrangements" }
3. { id: "3", title: "Data Retention Policy", department: "Legal", version: "3.0", status: "Active", owner: "General Counsel", reviewDate: "2024-09-30", summary: "Requirements for data retention and disposal" }

## Routes
- `/` — Dashboard: total policies, active count, draft count, departments with active policies
- `/policies` — Policy list with filter by department and status
- `/policies/add` — Add new policy form
- `/policies/[id]` — Policy detail

## Behaviors
- NavBar links to Dashboard and Policies
- Filters on list page filter in real time (AND logic)
- Add form: title (required), department (IT/HR/Legal/Finance/Operations/Other), version (required), status (Draft/Active/Archived), owner, reviewDate, summary
- Title and version required; version must be non-empty
- API GET /api/policies returns all policies
- API POST /api/policies adds policy, returns 201

## Edge Cases
- Empty title shows "Title is required"
- Empty version shows "Version is required"
- Filter with no matches shows "No policies found"
