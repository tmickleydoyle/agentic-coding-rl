# scratch-app-risk-register

## Overview
A risk register application for identifying, categorizing, and tracking organizational risks with likelihood and impact scores.

## Seed Data
Three initial risks:
1. { id: "1", title: "Data Breach", category: "Security", likelihood: 3, impact: 5, status: "Open", owner: "Security Team", description: "Unauthorized access to sensitive data" }
2. { id: "2", title: "Vendor Failure", category: "Operational", likelihood: 2, impact: 4, status: "Mitigated", owner: "Procurement", description: "Key vendor goes out of business" }
3. { id: "3", title: "Regulatory Non-Compliance", category: "Legal", likelihood: 2, impact: 5, status: "Open", owner: "Legal Team", description: "Failure to meet regulatory requirements" }

## Risk Score
risk_score = likelihood * impact (1-5 each)

## Routes
- `/` — Dashboard: total risks, open count, avg risk score of open risks, highest risk item
- `/risks` — Risk list with filter by category and status
- `/risks/add` — Add new risk form
- `/risks/[id]` — Risk detail

## Behaviors
- NavBar links to Dashboard and Risk Register
- Filters on list page work in real time
- Add form: title (required), category (Security/Operational/Legal/Financial/Other), likelihood (1-5), impact (1-5), status (Open/Mitigated/Closed), owner, description
- Title required validation
- Computed risk score displayed on list and detail
- API GET /api/risks returns all risks
- API POST /api/risks adds risk, returns 201

## Edge Cases
- Empty title shows "Title is required"
- No results after filter shows "No risks found"
