# Toll Calculator

A single-page React app to track toll road charges on trips. Users log toll payments by road/plaza, vehicle class, and payment method, and see totals.

## Seed Data

Start with these 4 toll records pre-loaded:

```
id: 1, date: "2024-01-10", road: "I-95 North", plaza: "Exit 12", amount: 3.50, vehicleClass: "Car", paymentMethod: "EZPass"
id: 2, date: "2024-01-10", road: "Turnpike", plaza: "Interchange 6", amount: 5.75, vehicleClass: "Car", paymentMethod: "Cash"
id: 3, date: "2024-01-15", road: "I-95 North", plaza: "Exit 22", amount: 4.00, vehicleClass: "Car", paymentMethod: "EZPass"
id: 4, date: "2024-01-20", road: "Garden State Pkwy", plaza: "Exit 100", amount: 1.25, vehicleClass: "Motorcycle", paymentMethod: "EZPass"
```

## Fields

- **date** (date, required): Date toll was paid
- **road** (text, required): Road or highway name
- **plaza** (text, required): Toll plaza or exit identifier
- **amount** (number, required): Toll amount in dollars (positive)
- **vehicleClass** (select, required): One of: Car, Motorcycle, Truck, RV
- **paymentMethod** (select, required): One of: EZPass, Cash, Credit Card

## Behaviors

### Add Toll
- A form with all fields.
- Clicking "Add Toll" validates all fields. Amount must be > 0.
- If invalid, show "Please fill in all required fields".
- On success, append record and clear form.
- Auto-increment ids.

### Display List
- Show tolls in a table with columns: date, road, plaza, amount, vehicle class, payment method.
- Rows have data-testid="toll-row".
- Amount displayed as "$X.XX".

### Delete Toll
- Each row has data-testid="delete-btn-{id}".

### Filter by Payment Method
- A dropdown (data-testid="payment-filter") with options: "All", "EZPass", "Cash", "Credit Card".
- Default: "All".
- Filtering changes visible rows but NOT summary stats.

### Filter by Vehicle Class
- A dropdown (data-testid="vehicle-filter") with options: "All", "Car", "Motorcycle", "Truck", "RV".
- Default: "All".
- Both filters can be active simultaneously (rows must match both).

### Summary Stats
- Total tolls count: data-testid="total-tolls"
- Total amount paid: data-testid="total-amount" as "$X.XX"
- EZPass total: data-testid="ezpass-total" as "$X.XX"
- Cash total: data-testid="cash-total" as "$X.XX"
- Most expensive toll road: data-testid="top-road" — road name with highest total amount across all its tolls.
  If no tolls, show "N/A".

## Edge Cases
- Filters apply together (AND logic).
- With 0 records: all totals "$0.00", top-road "N/A", total-tolls 0.
- If tie for top road, show either (consistent is fine).
