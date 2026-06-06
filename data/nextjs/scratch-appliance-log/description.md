# Appliance Log

A single-page React app to log and manage home appliances with their purchase details and status.

## Seed Data

Start with these appliances pre-loaded:

| Name | Brand | Type | Purchase Date | Purchase Price ($) | Status |
|------|-------|------|---------------|--------------------|--------|
| French Door Fridge | Samsung | Refrigerator | 2021-03-15 | 1400 | Active |
| Front Load Washer | LG | Washer | 2020-07-22 | 900 | Active |
| Gas Range | GE | Oven | 2019-11-10 | 750 | Active |
| Dishwasher | Bosch | Dishwasher | 2022-01-05 | 650 | Active |
| Chest Freezer | Frigidaire | Freezer | 2018-06-30 | 400 | Retired |

## Fields

Each appliance has:
- **Name** (text, required)
- **Brand** (text, required)
- **Type** (select: Refrigerator, Washer, Dryer, Oven, Dishwasher, Freezer, Microwave, Other)
- **Purchase Date** (date input)
- **Purchase Price** (number in dollars, min 0)
- **Status** (select: Active, Needs Repair, Retired)

## Behaviors

### Add Appliance
- A form with inputs for all fields
- "Add Appliance" button submits the form
- New appliance appears in the list
- Form clears after successful submission
- Both Name and Brand are required; do not add if either is empty

### Display
- Show all appliances in a list or table
- Each row shows: Name, Brand, Type, Purchase Date, Purchase Price as "$X", Status
- Each appliance has a "Remove" button to delete it

### Filter by Status
- Dropdown filter defaulting to "All" to show appliances of a specific status
- Options: All, Active, Needs Repair, Retired
- Only matching appliances are displayed when a filter is active

### Edit Status
- Each appliance row has a status dropdown to change the status in-place
- Changing the dropdown immediately updates the appliance status

### Summary
- Show total count of appliances (all, not filtered)
- Show count of Active appliances

## Edge Cases
- Removing an appliance updates the list immediately
- Filter does not affect total count in summary
- Price defaults to 0 if not entered
- Name and Brand are trimmed before validation
