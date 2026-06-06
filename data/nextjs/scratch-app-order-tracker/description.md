# Order Tracker

A multi-route React application for tracking orders, shipments, and returns.

## Routes
- **Home** (`home`): Dashboard with total orders, in-transit shipments, open returns, and delivered orders count.
- **Orders** (`orders`): List orders with orderNumber, customerName, date, total, and status. Add new orders. Update order status via PATCH.
- **Shipments** (`shipments`): List shipments with orderId (order number shown), carrier, trackingNumber, status (in_transit/delivered), and estimatedDelivery. Add new shipments linked to an order.
- **Returns** (`returns`): List returns with orderId (order number), reason, status (open/processing/completed), and createdAt. Create returns for orders. Update return status.

## Seed Data
### Orders (5)
1. { id: "ord1", orderNumber: "ORD-2001", customerName: "Alice Green", date: "2024-04-10", total: 150.00, status: "processing" }
2. { id: "ord2", orderNumber: "ORD-2002", customerName: "Bob White", date: "2024-04-12", total: 89.50, status: "shipped" }
3. { id: "ord3", orderNumber: "ORD-2003", customerName: "Carol Black", date: "2024-04-15", total: 210.75, status: "delivered" }
4. { id: "ord4", orderNumber: "ORD-2004", customerName: "Dave Gray", date: "2024-05-01", total: 45.00, status: "shipped" }
5. { id: "ord5", orderNumber: "ORD-2005", customerName: "Eve Blue", date: "2024-05-05", total: 320.00, status: "processing" }

### Shipments (3)
1. { id: "sh1", orderId: "ord2", carrier: "FedEx", trackingNumber: "FX123456", status: "in_transit", estimatedDelivery: "2024-04-18" }
2. { id: "sh2", orderId: "ord3", carrier: "UPS", trackingNumber: "UP789012", status: "delivered", estimatedDelivery: "2024-04-20" }
3. { id: "sh3", orderId: "ord4", carrier: "USPS", trackingNumber: "US345678", status: "in_transit", estimatedDelivery: "2024-05-10" }

### Returns (2)
1. { id: "ret1", orderId: "ord3", reason: "Wrong size", status: "open", createdAt: "2024-04-25" }
2. { id: "ret2", orderId: "ord1", reason: "Changed mind", status: "processing", createdAt: "2024-04-11" }

## Behaviors
- Add order: POST /api/orders with { orderNumber, customerName, date, total }. Status defaults to "processing".
- Update order status: PATCH /api/orders/:id with { status }.
- Add shipment: POST /api/shipments with { orderId, carrier, trackingNumber, estimatedDelivery }. Status defaults to "in_transit".
- Create return: POST /api/returns with { orderId, reason }. Status defaults to "open".
- Update return status: PATCH /api/returns/:id with { status }.

## data-testids
- `nav-home`, `nav-orders`, `nav-shipments`, `nav-returns`
- `stat-total-orders`, `stat-in-transit`, `stat-open-returns`, `stat-delivered`
- `order-list`, `order-item`, `order-number`, `order-customer`, `order-total`, `order-status`
- `add-order-form`, `input-order-number`, `input-order-customer`, `input-order-date`, `input-order-total`, `btn-add-order`
- `shipment-list`, `shipment-item`, `shipment-order`, `shipment-carrier`, `shipment-tracking`, `shipment-status`
- `add-shipment-form`, `select-shipment-order`, `input-shipment-carrier`, `input-shipment-tracking`, `input-shipment-delivery`, `btn-add-shipment`
- `return-list`, `return-item`, `return-order`, `return-reason`, `return-status`
- `add-return-form`, `select-return-order`, `input-return-reason`, `btn-add-return`
