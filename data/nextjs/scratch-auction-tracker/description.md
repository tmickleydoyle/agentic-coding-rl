# Auction Tracker

Build a single-page React app for tracking auction items and bids.

## Seed Data

Start with these auction items pre-loaded:

| id | title | description | startingBid | currentBid | status | bidCount |
|----|-------|-------------|-------------|------------|--------|----------|
| 1 | Antique Pocket Watch | Gold-plated 1890s timepiece | 200 | 200 | open | 0 |
| 2 | Oil Painting Landscape | 18th century pastoral scene | 500 | 650 | open | 3 |
| 3 | Silver Candelabra | Victorian 5-arm candelabra | 150 | 310 | closed | 7 |
| 4 | Ceramic Tea Set | Ming dynasty reproduction | 100 | 100 | open | 0 |
| 5 | Mahogany Writing Desk | Early 1900s roll-top desk | 800 | 950 | open | 4 |

## Fields

Each auction item has:
- `id` (number, auto-increment)
- `title` (string)
- `description` (string)
- `startingBid` (number, USD)
- `currentBid` (number, USD)
- `status` (string: open | closed)
- `bidCount` (number)

## UI Layout

1. **Header**: "Auction Tracker" heading (`data-testid="heading"`)
2. **Add Item Form** (`data-testid="add-form"`):
   - Text input for title (`data-testid="input-title"`)
   - Text input for description (`data-testid="input-description"`)
   - Number input for starting bid (`data-testid="input-starting-bid"`)
   - Submit button labeled "Add Item" (`data-testid="btn-add"`)
3. **Filter Bar**:
   - Select to filter by status (`data-testid="filter-status"`), options: All | open | closed
4. **Item List** (`data-testid="item-list"`):
   - Each item rendered as a row/card with `data-testid="auction-{id}"`
   - Shows title (`data-testid="auction-title-{id}"`), description, starting bid, current bid formatted as "$X"
   - Shows bid count (`data-testid="auction-bid-count-{id}"`)
   - Shows status badge (`data-testid="auction-status-{id}"`) with text "OPEN" or "CLOSED"
   - **Place Bid** section (only when status=open):
     - Number input for bid amount (`data-testid="bid-input-{id}"`)
     - "Place Bid" button (`data-testid="btn-bid-{id}"`)
   - "Close Auction" button (`data-testid="btn-close-{id}"`) — only when status=open
   - "Remove" button (`data-testid="btn-remove-{id}"`)
5. **Summary** (`data-testid="summary"`):
   - Count of open auctions (`data-testid="count-open"`)
   - Count of closed auctions (`data-testid="count-closed"`)
   - Highest single current bid across all items (`data-testid="highest-bid"`) formatted as "$X"

## Behaviors

- **Add Item**: filling form and clicking "Add Item" appends item with status=open, bidCount=0, currentBid=startingBid; form clears; id auto-increments.
- **Validation**: title must be non-empty; starting bid must be > 0. Show error (`data-testid="form-error"`) on violation.
- **Place Bid**: new bid must be strictly greater than currentBid; if valid, update currentBid to new value and increment bidCount by 1. If bid <= currentBid, show inline error (`data-testid="bid-error-{id}"`) "Bid must exceed current bid".
- **Close Auction**: sets status=closed; bid input and "Close Auction" button disappear.
- **Remove**: removes item permanently.
- **Filter by Status**: "All" shows all; "open" shows only open; "closed" shows only closed.
- **Summary**: always reflects ALL items regardless of filter.

## Edge Cases

- Empty title shows error "Title is required".
- Starting bid of 0 or negative shows error "Starting bid must be greater than 0".
- Bidding exactly equal to currentBid shows bid error (must be strictly greater).
- A closed auction shows no bid input and no "Close Auction" button.
- Highest bid updates immediately after a successful bid placement.
