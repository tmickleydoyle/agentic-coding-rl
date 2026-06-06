# Allergy Log App

Build an allergy tracking application where users can record known allergies, log allergic reactions, and identify top triggers.

## Data Model

### Allergy
- `id`, `name`, `type` (food/medication/environmental/insect/other)
- `severity` (mild/moderate/severe), `symptoms` (string[]), `notes`, `createdAt`

### ReactionLog
- `id`, `allergyId`, `allergyName`, `date` (YYYY-MM-DD)
- `symptoms` (string[]), `severity`, `treatment`, `createdAt`

## Routes
1. **Home** — allergy count, reaction count, severe allergy count, allergy list summary
2. **Add** — form: name (required), type, severity, symptoms (comma separated), notes
3. **Reactions** — form to log a reaction (select allergy, date, symptoms, severity, treatment) + reactions list
4. **Triggers** — top triggers sorted by reaction count

## API
- `GET /api/allergies` — all allergies + reactions + trigger counts
- `POST /api/allergies` — add allergy (name required)
- `DELETE /api/allergies?id=<id>` — delete allergy
- `PUT /api/allergies` — log a reaction (allergyId + date required)
