# Sponsor Tracker

A single-page app to manage conference sponsors including tier, booth, contact, and benefit checklist.

## Seed Data

Five pre-loaded sponsors:

| id | name | tier | booth | contactName | contactEmail | logoUrl | benefits |
|----|------|------|-------|-------------|--------------|---------|----------|
| 1 | "TechCorp" | "platinum" | "B1" | "Sarah Lee" | "sarah@techcorp.com" | "" | { "logo on website": true, "speaking slot": true, "banner": true, "swag table": false } |
| 2 | "StartupX" | "gold" | "B4" | "Ben Okafor" | "ben@startupx.io" | "" | { "logo on website": true, "speaking slot": false, "banner": true, "swag table": false } |
| 3 | "DesignLab" | "silver" | "B7" | "Cara White" | "cara@designlab.co" | "" | { "logo on website": true, "speaking slot": false, "banner": false, "swag table": false } |
| 4 | "CloudBase" | "gold" | "B5" | "David Kim" | "david@cloudbase.dev" | "" | { "logo on website": true, "speaking slot": false, "banner": true, "swag table": true } |
| 5 | "DataFlow" | "bronze" | "B12" | "Eva Russo" | "eva@dataflow.ai" | "" | { "logo on website": false, "speaking slot": false, "banner": false, "swag table": false } |

Benefits keys (always present): "logo on website", "speaking slot", "banner", "swag table".

## Fields Displayed

Each sponsor card shows: name, tier badge, booth number, contact name, contact email (mailto link), and a checklist of 4 benefits with checkboxes.

## Behaviors

### Add Sponsor
- Form with: Name, Tier (select: platinum/gold/silver/bronze), Booth, Contact Name, Contact Email
- "Add Sponsor" button submits; all fields required
- New sponsor starts with all 4 benefits set to false
- Form clears after add

### Edit Sponsor
- Each card has an "Edit" button
- Opens inline edit form pre-filled with name, tier, booth, contact name, contact email
- "Save" updates; "Cancel" discards
- Benefits checkboxes are editable directly on the card (not in edit form)

### Delete Sponsor
- Each card has a "Delete" button — removes immediately

### Benefit Checkbox Toggle
- Each benefit checkbox on a card is directly toggleable
- Toggling updates that sponsor's benefit status in state

### Tier Filter
- Buttons: "All", "Platinum", "Gold", "Silver", "Bronze"
- Filters displayed cards; default "All"

### Sponsor Count
- "X sponsors" text updates with filter

## Edge Cases
- Tier filter is case-insensitive match against stored tier value
- "No sponsors found" when filter yields zero results
- Benefits persist through edit (edit form does not reset benefits)
