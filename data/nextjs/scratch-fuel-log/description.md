# Fuel Log

A single-page React app to track vehicle fuel fill-ups. Users log each fill-up with date, gallons, price per gallon, and odometer reading.

## Seed Data

Start with these 3 fill-up records pre-loaded:

```
id: 1, date: "2024-01-05", gallons: 12.5, pricePerGallon: 3.45, odometer: 15200, station: "Shell"
id: 2, date: "2024-01-18", gallons: 11.0, pricePerGallon: 3.52, odometer: 15580, station: "BP"
id: 3, date: "2024-02-01", gallons: 13.2, pricePerGallon: 3.38, odometer: 15930, station: "Shell"
```

## Fields

- **date** (date, required): Date of fill-up
- **gallons** (number, required): Gallons pumped (positive)
- **pricePerGallon** (number, required): Price per gallon in dollars (positive)
- **odometer** (number, required): Odometer reading at fill-up (positive integer)
- **station** (text, optional): Gas station name

## Behaviors

### Add Fill-Up
- A form with inputs for all fields (station optional).
- Clicking "Add Fill-Up" validates required fields.
- If any required field is missing or invalid (non-positive), show "Please fill in all required fields".
- On success, append the record and clear the form.
- New records get auto-incremented ids.

### Display List
- Show all fill-ups in a table/list with columns: date, gallons, price/gal, total cost, odometer, station.
- Total cost per fill-up = gallons * pricePerGallon, displayed as "$X.XX".
- Rows have data-testid="fillup-row".

### Delete Fill-Up
- Each row has a "Delete" button with data-testid="delete-btn-{id}".
- Clicking removes that record.

### Summary Stats
- Total fill-ups count: data-testid="total-fillups"
- Total gallons: data-testid="total-gallons" formatted to 1 decimal (e.g., "36.7")
- Total spent: data-testid="total-spent" formatted as "$X.XX"
- Average MPG between consecutive fill-ups: data-testid="avg-mpg"
  - Computed as: sum of miles driven / sum of gallons for each consecutive pair
  - Miles driven between fill-ups = odometer[i] - odometer[i-1]
  - Only count pairs where both records exist and odometer increases
  - If fewer than 2 records, show "N/A"
  - Format to 1 decimal place (e.g., "32.5 mpg")

### Sort
- A dropdown (data-testid="sort-select") with options: "Date (newest)", "Date (oldest)", "Cost (highest)", "Cost (lowest)"
- Default sort: "Date (newest)"
- Sorting changes display order but not stats.

## Edge Cases
- Deleting a record recalculates all stats.
- With 0 records: total-fillups = 0, total-gallons = "0.0", total-spent = "$0.00", avg-mpg = "N/A".
- Cost per fill-up = gallons * pricePerGallon rounded to 2 decimals.
