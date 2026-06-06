# scratch-app-investor-crm

An investor CRM for startups to track investors, interactions, and fundraising pipeline status.

## Routes
- `/` — Dashboard: total investors, pipeline stage breakdown, recent interactions
- `/investors` — List/add/edit/delete investors. Fields: name, firm, email, stage (Lead/Contacted/Meeting/Term Sheet/Closed/Pass)
- `/interactions` — Log interactions (call, email, meeting) for investors. Fields: investorId, type (Call/Email/Meeting), notes, date
- `/pipeline` — Kanban-style pipeline view grouped by stage showing investor cards

## Seed Data
Investors:
1. { id: "1", name: "Alice Chen", firm: "Accel", email: "alice@accel.com", stage: "Meeting" }
2. { id: "2", name: "Bob Patel", firm: "Sequoia", email: "bob@sequoia.com", stage: "Term Sheet" }
3. { id: "3", name: "Carol Wu", firm: "Andreessen", email: "carol@a16z.com", stage: "Lead" }
4. { id: "4", name: "Dan Kim", firm: "Benchmark", email: "dan@benchmark.com", stage: "Contacted" }

Interactions:
1. { id: "1", investorId: "1", type: "Meeting", notes: "Intro call went well", date: "2024-01-15" }
2. { id: "2", investorId: "2", type: "Email", notes: "Sent deck", date: "2024-01-20" }

## Behaviors
- Dashboard counts: total investors, investors by stage
- Interactions list shows investor name (looked up from investors)
- Pipeline groups investors into stage columns
- Adding investor requires name, firm, email (valid format), stage
- Adding interaction requires investor selection, type, notes, date
- Editing investor stage updates pipeline view

## Edge Cases
- Email must contain "@" — show error otherwise
- Investors with stage "Pass" are shown in pipeline but greyed out
- If no interactions exist for an investor, pipeline card shows "No interactions"
