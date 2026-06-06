# scratch-app-sign-off-tracker

## Overview
A sign-off tracker for managing required sign-offs on deliverables, milestones, or documents. Each sign-off item has multiple required signers; the item is "Complete" only when all required signers have signed.

## Seed Data
Three initial sign-off items:
1. { id: "1", title: "Q1 Financial Report", signers: ["CFO", "CEO", "Auditor"], signed: ["CFO"], dueDate: "2024-03-31", status: "In Progress" }
2. { id: "2", title: "Product Launch Plan", signers: ["VP Product", "VP Engineering", "CEO"], signed: ["VP Product", "VP Engineering", "CEO"], dueDate: "2024-04-15", status: "Complete" }
3. { id: "3", title: "Security Audit Report", signers: ["CISO", "CTO"], signed: [], dueDate: "2024-05-01", status: "Pending" }

Status rules: If signed.length === 0 -> "Pending"; if signed.length === signers.length -> "Complete"; else -> "In Progress"

## Routes
- `/` — Dashboard: total items, complete count, in-progress count, pending count
- `/signoffs` — Sign-off list with filter by status
- `/signoffs/add` — Create new sign-off item
- `/signoffs/[id]` — Detail: show signers, checkboxes for each; clicking signer name signs them (calls PATCH to add to signed list); cannot unsign

## Behaviors
- NavBar links to Dashboard and Sign-offs
- Add form: title (required), signers (textarea, comma-separated, at least 1 required), dueDate
- On detail: each signer shows a checkbox; checked if in signed array; clicking unchecked signer triggers POST /api/signoffs/sign with { id, signer }
- Status is derived, not stored independently (or can be stored and auto-updated)
- API GET /api/signoffs returns all items
- API POST /api/signoffs creates new item, status auto-computed, returns 201
- API PATCH /api/signoffs with { id, signer } adds signer to signed array, updates status

## Edge Cases
- Empty title shows "Title is required"
- Empty signers shows "At least one signer is required"
- Filter with no match shows "No sign-off items found"
