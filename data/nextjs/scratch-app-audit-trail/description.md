# scratch-app-audit-trail

## Overview
An audit trail application that records immutable events with actor, action, resource, and timestamp. Events can be viewed and filtered but not edited or deleted.

## Seed Data
Four initial events:
1. { id: "1", actor: "alice@example.com", action: "CREATE", resource: "Document #101", timestamp: "2024-01-15T09:00:00Z", details: "Created new contract" }
2. { id: "2", actor: "bob@example.com", action: "UPDATE", resource: "Document #101", timestamp: "2024-01-15T10:30:00Z", details: "Updated contract terms" }
3. { id: "3", actor: "alice@example.com", action: "VIEW", resource: "Report #55", timestamp: "2024-01-16T14:00:00Z", details: "Viewed quarterly report" }
4. { id: "4", actor: "carol@example.com", action: "DELETE", resource: "Draft #7", timestamp: "2024-01-17T11:00:00Z", details: "Deleted stale draft" }

## Routes
- `/` — Dashboard: total events, unique actors, events by action type counts
- `/trail` — Audit trail list with filter by actor and action
- `/trail/[id]` — Event detail (read-only)

Note: No add route — events are append-only via API only.

## Behaviors
- NavBar links to Dashboard and Audit Trail
- Filters on list page filter in real time (AND logic)
- Events shown newest first (by timestamp desc)
- API GET /api/events returns all events
- API POST /api/events appends a new event (actor, action, resource, details required), auto-sets timestamp, returns 201
- Dashboard shows: total, unique actors count, count per action (CREATE/UPDATE/VIEW/DELETE/OTHER)

## Edge Cases
- Filter with no matches shows "No events found"
- POST with missing actor returns 400
- POST with missing action returns 400
