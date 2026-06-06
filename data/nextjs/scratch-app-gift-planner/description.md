# Gift Planner

Plan gifts for people across occasions with budget tracking and gift idea management.

## Routes
- **/** — Dashboard with upcoming occasions and total budget usage
- **/gifts** — All gift ideas with status and assignment to recipients/occasions
- **/occasions** — Manage occasions (birthdays, holidays, etc.)
- **/budget** — Budget overview per occasion with spent vs allocated
- **/ideas** — Brainstorm gift ideas without assigning them yet

## Features
- Add/remove occasions (name, date, type, recipientId)
- Add/remove gift ideas (title, description, price, occasionId, recipientId, status: idea|purchased|given)
- Add/remove recipients (name, relation)
- Track budget per occasion (allocated amount vs sum of purchased gifts)
- Ideas page shows unassigned brainstorm items

## Data Model
- Recipient: id, name, relation
- Occasion: id, name, date, type (birthday|holiday|anniversary|other), recipientId
- Gift: id, title, description, price, occasionId, recipientId, status (idea|purchased|given)
