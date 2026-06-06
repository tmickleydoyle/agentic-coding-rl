# Will Notes App

A multi-route React application for drafting and managing a last will and testament. Users can manage clauses, witnesses, and view a summary.

## Routes
- `/` (Clauses): List all will clauses with title and body text. Allow adding a new clause (title + body). Allow deleting a clause.
- `/witnesses`: List witnesses with name and signature status (Signed | Pending). Allow adding a witness. Allow toggling signature status.
- `/summary`: Shows total clause count, signed witness count, pending witness count, and a "Will Complete" badge if there are at least 2 clauses and 2 signed witnesses.

## Seed Data
Clauses:
- { id: "c1", title: "Executor Appointment", body: "I appoint Alice as executor of my estate." }
- { id: "c2", title: "Asset Distribution", body: "All assets shall be distributed equally among my children." }

Witnesses:
- { id: "w1", name: "John Smith", status: "Signed" }
- { id: "w2", name: "Mary Jones", status: "Pending" }

## Behaviors
- Adding a clause: title (required) + body (required); new clause appended.
- Adding a witness: name (required); defaults to "Pending".
- Toggling a witness status: Pending -> Signed, Signed -> Pending.
- NavBar: Clauses, Witnesses, Summary.
- "Will Complete" shown only when clauses >= 2 AND signed witnesses >= 2.

## API
`GET /api/will` returns `{ clauseCount: number, signedCount: number, pendingCount: number, complete: boolean }`.

## Edge Cases
- Empty clause list shows "No clauses yet."
- Empty witness list shows "No witnesses yet."
- Adding clause with empty title or body is ignored.
