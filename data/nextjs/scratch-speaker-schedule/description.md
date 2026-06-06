# Speaker Schedule Manager

Build a single-page React app for managing conference speaker schedules with time slot assignments and topic tracking.

## Seed Data

Speakers:
```
id: 1, name: "Dr. Alice Chen", topic: "Machine Learning Trends", duration: 45, track: "AI"
id: 2, name: "Bob Martinez", topic: "Scaling Microservices", duration: 30, track: "Engineering"
id: 3, name: "Carol White", topic: "UX Research Methods", duration: 60, track: "Design"
id: 4, name: "Dave Kim", topic: "Cloud Security", duration: 45, track: "Security"
id: 5, name: "Eve Johnson", topic: "React Performance", duration: 30, track: "Engineering"
```

Time slots (fixed list, not editable):
```
"09:00", "09:30", "10:00", "10:30", "11:00", "11:15", "14:00", "14:45", "15:00", "15:30"
```

Initial assignments (speakerId -> timeSlot):
```
1 -> "09:00"
3 -> "14:00"
```
(speakers 2, 4, 5 are unassigned initially)

## UI Layout

- `<h1>` "Speaker Schedule"
- Summary stats
- Track filter
- Speaker list
- Unassigned speakers section

## Summary Stats

- "Total Speakers: X" (data-testid="total-speakers") — always all 5
- "Assigned: X" (data-testid="assigned-count") — speakers with a time slot
- "Unassigned: X" (data-testid="unassigned-count") — speakers without a time slot

## Track Filter

- Select (aria-label="Filter by track") with options: "all", "AI", "Engineering", "Design", "Security"
- Filters the speaker list (both assigned and unassigned sections)

## Speaker List (Assigned Speakers)

Show only speakers who have a time slot assigned. Each row (data-testid="speaker-{id}"):
- Speaker name
- Topic
- Duration in minutes: "Xm" (data-testid="duration-{id}")
- Track badge (data-testid="track-{id}")
- Time slot display (data-testid="slot-{id}") showing assigned time
- A select to reassign time slot (aria-label="Time slot for {name}") — shows all time slots as options
  - Changing this select updates the assignment immediately
- "Unassign" button — removes the speaker's time slot assignment

## Unassigned Speakers Section

Show only speakers without a time slot. Each row (data-testid="unassigned-{id}"):
- Speaker name
- Topic
- Track badge
- A select to assign a time slot (aria-label="Assign slot for {name}") with all time slots as options; default/placeholder option value "" with text "-- select slot --"
- "Assign" button — assigns the selected slot (if a non-empty slot is selected)
  - If the time slot is already assigned to another speaker, do nothing (each slot can only have one speaker)
  - If no slot selected (value is ""), do nothing

## Derived Values

After filtering: "Showing X speakers" (data-testid="showing-count") — count of speakers matching filter (both assigned and unassigned).
