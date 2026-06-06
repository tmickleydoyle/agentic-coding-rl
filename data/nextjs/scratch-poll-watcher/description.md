# Poll Watcher Dashboard

A single-page polling station monitoring dashboard for field observers to log station status updates and flag issues.

## Seed Data

Start with the following polling stations pre-loaded:

| ID | Station Name         | District | Status  | Issue            |
|----|----------------------|----------|---------|------------------|
| 1  | Lincoln Elementary   | North    | Open    |                  |
| 2  | City Hall Annex      | Central  | Issue   | Long lines       |
| 3  | Riverside Community  | South    | Open    |                  |
| 4  | Westpark Rec Center  | West     | Closed  |                  |

Status values are exactly: "Open", "Closed", "Issue".

## UI Layout

- Page heading: "Poll Watcher Dashboard"
- A summary row showing counts: Open stations, Closed stations, stations with Issues
- A list of station cards, each showing:
  - Station name
  - District
  - Current status (displayed as a colored label or text)
  - Issue description (only shown when status is "Issue" and issue text is non-empty)
  - A status dropdown to change the station's status (values: Open, Closed, Issue)
  - An issue text input (only enabled/shown when status is "Issue")
  - An "Update" button to save the status change
- An "Add Station" form at the bottom with:
  - Text input for Station Name
  - Text input for District
  - A submit button "Add Station"
  - New stations start with status "Open" and no issue

## Behaviors

### Status Updates
- Selecting a new status from the dropdown and clicking "Update" changes that station's status.
- If changing to "Issue", the issue text input must be non-empty to save; otherwise do nothing.
- If changing away from "Issue", the issue text for that station is cleared.
- The summary counts update after every "Update" click.

### Issue Text
- The issue input is shown and enabled only when the dropdown is set to "Issue".
- When the dropdown is not set to "Issue", the issue input is hidden or disabled.

### Adding a Station
- Both Station Name and District are required; if either is blank, do nothing.
- New station appended to list with status "Open".
- Both inputs clear on successful add.

## data-testid Attributes

- `"open-count"` — count of Open stations
- `"closed-count"` — count of Closed stations
- `"issue-count"` — count of Issue stations
- `"station-card"` — each station card
- `"station-name"` — station name inside a card
- `"station-district"` — district inside a card
- `"station-status"` — current status label inside a card
- `"status-select"` — the status dropdown inside a card
- `"issue-input"` — the issue text input inside a card (present in DOM when status is Issue)
- `"update-btn"` — the Update button inside a card
- `"station-name-input"` — Add Station name input
- `"station-district-input"` — Add Station district input
- `"add-station-btn"` — Add Station submit button

## Edge Cases

- A station in "Issue" status with no issue text: the "Update" click should be ignored.
- Changing status from "Issue" to "Open" clears the stored issue description.
- The summary row must reflect the current state after every update.
- Duplicate station names are allowed.
