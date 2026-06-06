# scratch-app-legal-docs

## Overview
A legal document management app where users can view, add, and categorize legal documents. Documents have a title, category (Contract, Policy, NDA, Other), status (Draft, Active, Archived), and creation date.

## Seed Data
Three initial documents:
1. { id: "1", title: "Employment Agreement", category: "Contract", status: "Active", createdAt: "2024-01-15" }
2. { id: "2", title: "Privacy Policy", category: "Policy", status: "Active", createdAt: "2024-02-01" }
3. { id: "3", title: "NDA Template", category: "NDA", status: "Draft", createdAt: "2024-03-10" }

## Routes
- `/` — Home: summary stats (total docs, active count, draft count)
- `/legal-docs` — Document list with filter by category and status
- `/legal-docs/add` — Form to add a new document
- `/legal-docs/[id]` — Document detail view

## Behaviors
- NavBar shows links to Home and Documents
- Filter dropdowns on list page filter documents in real-time
- Add form requires title; category defaults to "Contract"; status defaults to "Draft"
- Submitting valid form calls POST /api/documents, navigates back to list
- Document count stats on home page update when documents are added
- API GET /api/documents returns all documents
- API POST /api/documents adds a document with a generated id and returns 201

## Edge Cases
- Empty title shows validation error "Title is required"
- Filter with no matches shows "No documents found"
- Unknown document id shows "Document not found"
