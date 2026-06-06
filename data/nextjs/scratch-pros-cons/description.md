# Pros and Cons List

Build an interactive pros and cons list tool where users can evaluate multiple topics/options.

## Seed Data

### Topics
1. **Remote Work** — pros: ["Flexible schedule", "No commute"], cons: ["Isolation", "Home distractions"]
2. **Office Work** — pros: ["Team collaboration", "Structured environment"], cons: ["Commute time", "Less flexibility"]

## Layout

- Page heading: "Pros & Cons"
- A selector (label "Select Topic") showing all topic names — selecting one switches the active topic
- For the active topic display:
  - Sub-heading showing the topic name with data-testid="topic-title"
  - Two columns: Pros | Cons
  - List of pros with data-testid="pro-item" on each item
  - List of cons with data-testid="con-item" on each item
  - Count summary: "Pros: N | Cons: M" with data-testid="pro-count" and data-testid="con-count"
  - Score: "Score: +N" or "Score: -N" or "Score: 0" (pros count minus cons count) with data-testid="score"
- Add Pro form: text input (label "New Pro") + "Add Pro" button
- Add Con form: text input (label "New Con") + "Add Con" button
- Remove buttons: each pro/con item has a "Remove" button next to it (aria-label "Remove pro: [text]" or "Remove con: [text]")
- Add Topic form: text input (label "New Topic") + "Add Topic" button

## Behaviors

- Selecting a topic from the dropdown immediately shows that topic's pros/cons
- "Add Pro" appends a new pro to the active topic; input must be non-empty; clears input after add
- "Add Con" appends a new con to the active topic; input must be non-empty; clears input after add
- "Remove" buttons remove the specific pro/con from the active topic
- "Add Topic" creates a new topic with empty pros/cons and switches to it; topic name must be non-empty
- Counts and score update reactively whenever items change
- Score prefix: show "+" if positive, "-" if negative (already in the number for negative), "0" if zero — e.g. "+2", "-1", "0"

## Edge Cases

- Each topic maintains its own independent list of pros/cons
- Switching topics shows the correct list for that topic
- Score = pros.length - cons.length; show as "+N" if > 0, "N" if < 0 (the minus is part of the number), "0" if 0
