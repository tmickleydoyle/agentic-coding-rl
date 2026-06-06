# Customer Portal

A multi-route React application for managing customer support tickets, order history, and profile settings.

## Routes
- **Home** (`home`): Dashboard showing open tickets, total orders, resolved tickets, and pending orders.
- **Tickets** (`tickets`): List support tickets with subject, priority, status, and createdAt. Add new tickets. Close a ticket (status: "closed").
- **Orders** (`orders`): List orders with orderNumber, date, total, and status. Add new orders.
- **Profile** (`profile`): Display/edit profile with name, email, phone, and address. Save updates via PATCH.

## Seed Data
### Tickets (4)
1. { id: "t1", subject: "Login issue", priority: "high", status: "open", createdAt: "2024-05-01" }
2. { id: "t2", subject: "Payment failed", priority: "urgent", status: "open", createdAt: "2024-05-10" }
3. { id: "t3", subject: "Delivery delay", priority: "medium", status: "resolved", createdAt: "2024-04-20" }
4. { id: "t4", subject: "Wrong item received", priority: "high", status: "open", createdAt: "2024-05-15" }

### Orders (4)
1. { id: "o1", orderNumber: "ORD-001", date: "2024-04-01", total: 89.99, status: "delivered" }
2. { id: "o2", orderNumber: "ORD-002", date: "2024-04-15", total: 249.00, status: "shipped" }
3. { id: "o3", orderNumber: "ORD-003", date: "2024-05-01", total: 34.50, status: "pending" }
4. { id: "o4", orderNumber: "ORD-004", date: "2024-05-10", total: 120.00, status: "pending" }

### Profile (1)
{ id: "p1", name: "Alex Customer", email: "alex@example.com", phone: "555-1234", address: "123 Main St" }

## Behaviors
- Add ticket: POST /api/tickets with { subject, priority }. Status defaults to "open", createdAt to today.
- Close ticket: PATCH /api/tickets/:id with { status: "closed" }. Button only on open/resolved tickets.
- Add order: POST /api/orders with { orderNumber, date, total }. Status defaults to "pending".
- Update profile: PATCH /api/profile with { name, email, phone, address }.
- Dashboard open tickets = tickets with status "open". Pending orders = status "pending".

## data-testids
- `nav-home`, `nav-tickets`, `nav-orders`, `nav-profile`
- `stat-open-tickets`, `stat-total-orders`, `stat-resolved-tickets`, `stat-pending-orders`
- `ticket-list`, `ticket-item`, `ticket-subject`, `ticket-priority`, `ticket-status`, `btn-close-ticket`
- `add-ticket-form`, `input-ticket-subject`, `select-ticket-priority`, `btn-add-ticket`
- `order-list`, `order-item`, `order-number`, `order-total`, `order-status`
- `add-order-form`, `input-order-number`, `input-order-date`, `input-order-total`, `btn-add-order`
- `profile-form`, `input-profile-name`, `input-profile-email`, `input-profile-phone`, `input-profile-address`, `btn-save-profile`
