# Commission Tracker

Build a single-page commission tracker for an artist managing client work orders.

## Seed Data

Start with these 4 commissions pre-loaded:

| id | client       | description              | price | status      | deadline   |
|----|--------------|--------------------------|-------|-------------|------------|
| 1  | Alice Morgan | Portrait painting        | 600   | in-progress | 2024-03-15 |
| 2  | Ben Liu      | Logo illustration        | 250   | pending     | 2024-04-01 |
| 3  | Carol Smith  | Wedding invitation suite | 400   | completed   | 2024-02-28 |
| 4  | David Park   | Book cover design        | 350   | pending     | 2024-05-10 |

## Fields per Commission

- `id` — unique number
- `client` — string
- `description` — string
- `price` — number
- `status` — one of: "pending", "in-progress", "completed"
- `deadline` — string (ISO date YYYY-MM-DD)

## Layout & Components

### Header
- `<h1>` with text "Commission Tracker"
- `data-testid="total-revenue"` — shows total price of completed commissions: "Total Earned: $NNN"
- `data-testid="commission-count"` — shows total count: "{n} commissions"

### Filter Bar
- Select `data-testid="filter-status"` with options: "All", "pending", "in-progress", "completed"
  - Filters commissions by selected status (All shows everything)

### Commission List
- Each commission in a card `data-testid="commission-card"`
  - `data-testid="commission-client"` — client name
  - `data-testid="commission-description"` — description
  - `data-testid="commission-price"` — "$NNN"
  - `data-testid="commission-status"` — current status
  - `data-testid="commission-deadline"` — deadline string
  - Select `data-testid="status-select"` with options "pending", "in-progress", "completed" — changing it updates the commission status immediately
  - Button `data-testid="delete-commission"` — removes the commission

### Add Commission Form
- `data-testid="add-form"`
- Inputs:
  - `data-testid="input-client"` — text, placeholder "Client Name"
  - `data-testid="input-description"` — text, placeholder "Description"
  - `data-testid="input-price"` — number, placeholder "Price"
  - `data-testid="input-deadline"` — date input
  - `data-testid="input-status"` — select with options "pending", "in-progress", "completed"
- Submit button `data-testid="submit-commission"` — "Add Commission"
- On submit: add commission with new unique id, clear form. New commissions default status to "pending" if not changed.
- Validation: if client or description is empty, or price is <= 0, show `data-testid="form-error"` with text "Please provide client, description, and a valid price."

## Behaviors

- total-revenue sums prices of commissions with status "completed" only
- commission-count shows all commissions (not filtered)
- Changing status via select updates total-revenue immediately if the commission becomes completed or un-completed
- Filter applies in real time
