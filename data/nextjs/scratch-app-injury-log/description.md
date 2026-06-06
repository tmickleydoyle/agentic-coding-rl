# scratch-app-injury-log

A multi-route athlete injury tracking app. Users log injuries, track treatments, view a timeline, and add recovery notes.

## Routes
- `/` — Injuries: add/delete injuries (body part, type: strain/sprain/fracture/bruise, severity: mild/moderate/severe, date)
- `/treatment` — Treatment: add treatments to a selected injury (type: ice/physio/rest/medication, date, duration minutes)
- `/timeline` — Timeline: all injuries sorted by date descending
- `/notes` — Notes: add/view recovery notes per injury (text, date)

## Seed Data
Two injuries:
1. { id: "i1", bodyPart: "Left Knee", type: "strain", severity: "moderate", date: "2024-03-10", treatments: [{ id: "t1", type: "ice", date: "2024-03-10", duration: 20 }], notes: [] }
2. { id: "i2", bodyPart: "Right Shoulder", type: "sprain", severity: "mild", date: "2024-03-15", treatments: [], notes: [{ id: "n1", text: "Feeling better after rest", date: "2024-03-17" }] }

## Behaviors
- Injuries page: add injury (bodyPart text, type select, severity select, date); delete by id; click to select active
- Treatment page: show "No active injury" if none selected; add treatment to active injury
- Timeline: list injuries sorted by date descending showing bodyPart, type, severity
- Notes page: add text note to active injury; list notes for active injury

## API
POST /api/injuries — body { bodyPart, type, severity, date } → adds injury, returns injury
GET /api/injuries — returns all injuries

## Edge Cases
- bodyPart must be non-empty
- Treatment duration must be > 0
- Note text must be non-empty
