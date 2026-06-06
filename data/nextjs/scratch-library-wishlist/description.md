# Library Wishlist

## Overview
A single-page app to maintain a personal reading wishlist. Each entry has a title, author, genre, priority level, and optional notes.

## Seed Data
The app starts with these wishlist items pre-loaded:

| Title | Author | Genre | Priority | Notes |
|---|---|---|---|---|
| The Road | Cormac McCarthy | Fiction | High | Recommended by a friend. |
| Thinking, Fast and Slow | Daniel Kahneman | Psychology | Medium | Must read for decision making. |
| The Name of the Wind | Patrick Rothfuss | Fantasy | Low | Part of a trilogy. |

## Fields
- **Title** (text, required)
- **Author** (text, required)
- **Genre** (text, required)
- **Priority** (select: "Low", "Medium", "High", required — default "Medium")
- **Notes** (textarea, optional — may be empty)

## Behaviors

### Add an Item
- A form contains inputs for Title, Author, Genre, Priority (select), and Notes.
- Clicking "Add to Wishlist" appends the item to the list.
- Title, Author, and Genre are required; if any is empty the item is NOT added.
- Priority defaults to "Medium" if not changed.
- Notes may be left blank.
- After a successful add, Title, Author, Genre, and Notes fields reset to empty; Priority resets to "Medium".

### Display Items
- Each item is shown in a card displaying: title, author, genre, priority (as "Priority: X"), and notes (if present).
- Items are shown in the order they were added (seed data first).

### Delete an Item
- Each card has a "Delete" button that removes the item immediately.

### Filter by Priority
- A select dropdown labeled "Filter by priority" with options: "All", "Low", "Medium", "High".
- Selecting a priority shows only items matching that priority.
- Selecting "All" shows all items.

### Sort by Priority
- A button labeled "Sort by Priority" reorders the visible list: High first, then Medium, then Low.
- Clicking again does NOT toggle — it always re-applies the High > Medium > Low sort.

## Edge Cases
- Items with blank Title are rejected even if Author and Genre are provided.
- Notes field is optional; items without notes should still display correctly (notes area is empty or absent).
- Filter and sort interact: the sort applies to the filtered list.
