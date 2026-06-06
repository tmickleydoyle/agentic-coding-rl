# scratch-app-approval-flow

## Overview
An approval workflow application where users submit requests that go through approval stages (Pending -> Approved/Rejected). Approvers can approve or reject pending requests with a comment.

## Seed Data
Three initial requests:
1. { id: "1", title: "Budget Increase Q2", submitter: "alice@example.com", type: "Budget", amount: 15000, status: "Pending", comment: "", submittedAt: "2024-01-10" }
2. { id: "2", title: "New Software License", submitter: "bob@example.com", type: "Software", amount: 2500, status: "Approved", comment: "Approved for team use", submittedAt: "2024-01-12" }
3. { id: "3", title: "Conference Travel", submitter: "carol@example.com", type: "Travel", amount: 3000, status: "Rejected", comment: "Over budget", submittedAt: "2024-01-14" }

## Routes
- `/` — Dashboard: total requests, pending count, approved count, rejected count, total approved amount
- `/requests` — Request list with filter by type and status
- `/requests/add` — Submit new request form
- `/requests/[id]` — Request detail with Approve/Reject action buttons if status is Pending

## Behaviors
- NavBar links to Dashboard and Requests
- Add form: title (required), submitter (required), type (Budget/Software/Travel/Equipment/Other), amount (number > 0), default status Pending
- On detail page: if status is Pending, show "Approve" and "Reject" buttons with a comment input
- Approving calls PATCH /api/requests/[id] with { status: "Approved", comment }
- Rejecting calls PATCH /api/requests/[id] with { status: "Rejected", comment }
- After approve/reject, status updates on page
- API GET /api/requests returns all requests
- API POST /api/requests creates a new request (status always Pending), returns 201
- API PATCH /api/requests with { id, status, comment } updates the request

## Edge Cases
- Empty title shows "Title is required"
- Empty submitter shows "Submitter is required"
- Amount <= 0 shows "Amount must be greater than 0"
- No requests match filter: "No requests found"
