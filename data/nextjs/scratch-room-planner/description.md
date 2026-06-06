# Room Planner

A single-page React app to plan and manage rooms in a home with dimensions and usage notes.

## Seed Data

Start with these rooms pre-loaded:

| Name | Type | Width (ft) | Length (ft) | Floor | Notes |
|------|------|-----------|------------|-------|-------|
| Master Bedroom | Bedroom | 14 | 16 | 2 | Has walk-in closet |
| Living Room | Living | 18 | 22 | 1 | Open plan with dining |
| Kitchen | Kitchen | 12 | 14 | 1 | Galley style |
| Home Office | Office | 10 | 12 | 2 | North-facing window |
| Guest Bedroom | Bedroom | 11 | 13 | 2 | |

## Fields

Each room has:
- **Name** (text, required)
- **Type** (select: Bedroom, Living, Kitchen, Bathroom, Dining, Office, Storage, Other)
- **Width** (number in feet, min 1)
- **Length** (number in feet, min 1)
- **Floor** (number, 1 or higher)
- **Notes** (text, optional)

## Behaviors

### Add Room
- A form with inputs for all fields
- "Add Room" button submits the form
- New room appears in the list
- Form clears after successful submission
- Name is required; do not add if empty

### Display
- Show all rooms in a table or card list
- Each row shows: Name, Type, Width x Length (as "WxL ft"), Area (Width * Length as "X sq ft"), Floor, Notes
- Each room has a "Remove" button to delete it

### Filter by Type
- Dropdown filter defaulting to "All Types"
- Options: All Types, Bedroom, Living, Kitchen, Bathroom, Dining, Office, Storage, Other
- Only matching rooms are shown

### Filter by Floor
- Dropdown filter defaulting to "All Floors"
- Populates dynamically with floor numbers from the current list
- Only matching rooms are shown when a floor is selected

### Summary
- Total room count (all rooms, not filtered)
- Total area (sum of Width * Length for all rooms, not filtered) displayed as "X sq ft"

## Edge Cases
- Deleting removes the room immediately
- Both filters can be active simultaneously (AND logic)
- Summary is never affected by filters
- Width and Length default to 1 if not entered or below 1
- Floor defaults to 1
- Notes can be blank
