# Warehouse Stock Manager

A multi-route React application for tracking warehouse inventory, storage locations, and stock movements.

## Routes
- **Home** (`home`): Dashboard with total items, total locations, low stock items (quantity < 10), and total movements today.
- **Inventory** (`inventory`): List inventory items with name, sku, quantity, locationId (location name shown), and category. Add new items. Adjust quantity via PATCH.
- **Locations** (`locations`): List warehouse locations with code, zone, and capacity. Add new locations.
- **Movements** (`movements`): List stock movements with itemId (item name), type (inbound/outbound), quantity, date, and notes. Record new movements — inbound increases item quantity, outbound decreases it.

## Seed Data
### Locations (4)
1. { id: "loc1", code: "A1-01", zone: "Zone A", capacity: 500 }
2. { id: "loc2", code: "A1-02", zone: "Zone A", capacity: 300 }
3. { id: "loc3", code: "B2-01", zone: "Zone B", capacity: 1000 }
4. { id: "loc4", code: "B2-02", zone: "Zone B", capacity: 750 }

### Inventory (5)
1. { id: "inv1", name: "Widget A", sku: "WGT-001", quantity: 150, locationId: "loc1", category: "Widgets" }
2. { id: "inv2", name: "Gadget B", sku: "GDG-002", quantity: 8, locationId: "loc2", category: "Gadgets" }
3. { id: "inv3", name: "Part C", sku: "PRT-003", quantity: 500, locationId: "loc3", category: "Parts" }
4. { id: "inv4", name: "Tool D", sku: "TL-004", quantity: 3, locationId: "loc4", category: "Tools" }
5. { id: "inv5", name: "Component E", sku: "CMP-005", quantity: 75, locationId: "loc1", category: "Components" }

### Movements (3)
1. { id: "mv1", itemId: "inv1", type: "inbound", quantity: 50, date: "2024-05-01", notes: "Restocking" }
2. { id: "mv2", itemId: "inv2", type: "outbound", quantity: 5, date: "2024-05-02", notes: "Order fulfillment" }
3. { id: "mv3", itemId: "inv3", type: "inbound", quantity: 200, date: "2024-05-03", notes: "Bulk purchase" }

## Behaviors
- Add inventory item: POST /api/inventory with { name, sku, quantity, locationId, category }.
- Adjust quantity: PATCH /api/inventory/:id with { quantity }.
- Add location: POST /api/locations with { code, zone, capacity }.
- Record movement: POST /api/movements with { itemId, type, quantity, notes }. Automatically adjusts inventory quantity (+/- depending on type).
- Low stock threshold: quantity < 10.

## data-testids
- `nav-home`, `nav-inventory`, `nav-locations`, `nav-movements`
- `stat-total-items`, `stat-total-locations`, `stat-low-stock`, `stat-total-movements`
- `inventory-list`, `inventory-item`, `item-name`, `item-sku`, `item-quantity`, `item-category`
- `add-inventory-form`, `input-item-name`, `input-item-sku`, `input-item-quantity`, `select-item-location`, `input-item-category`, `btn-add-item`
- `location-list`, `location-item`, `location-code`, `location-zone`, `location-capacity`
- `add-location-form`, `input-location-code`, `input-location-zone`, `input-location-capacity`, `btn-add-location`
- `movement-list`, `movement-item`, `movement-item-name`, `movement-type`, `movement-quantity`, `movement-date`
- `add-movement-form`, `select-movement-item`, `select-movement-type`, `input-movement-quantity`, `input-movement-notes`, `btn-add-movement`
