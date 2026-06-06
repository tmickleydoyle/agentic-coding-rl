# Campaign Journal

A single-page React app for tracking a tabletop RPG campaign. Users manage session entries (with summaries and XP gained) and a quest board with completion tracking.

## Seed Data

### Sessions (3 pre-loaded)
1. id: 1, Title: "The Dark Forest", Date: "2024-01-10", Summary: "Party entered the cursed forest and fought a wraith", XP: 300, Characters: ["Aria", "Brom"]
2. id: 2, Title: "City of Shadows", Date: "2024-02-14", Summary: "Infiltrated the thieves guild headquarters", XP: 450, Characters: ["Aria", "Brom", "Corvus"]
3. id: 3, Title: "Dragon's Lair", Date: "2024-03-20", Summary: "Defeated the ancient dragon Xaroth", XP: 1200, Characters: ["Aria", "Brom", "Corvus"]

### Quests (3 pre-loaded)
1. id: 1, Name: "Find the Lost Artifact", Status: "active", Reward: "500 gold"
2. id: 2, Name: "Defeat the Lich King", Status: "completed", Reward: "Legendary sword"
3. id: 3, Name: "Rescue the Village Elder", Status: "failed", Reward: "100 gold"

## Fields

### Session
- `id`: unique number
- `title`: string
- `date`: string (YYYY-MM-DD)
- `summary`: string
- `xp`: number
- `characters`: string[]

### Quest
- `id`: unique number
- `name`: string
- `status`: "active" | "completed" | "failed"
- `reward`: string

## UI Layout

### Header
- `<h1>` with text "Campaign Journal"
- Stats: total sessions (`data-testid="total-sessions"`), total XP across all sessions (`data-testid="total-xp"`), active quests count (`data-testid="active-quests"`)

### Session Section

#### Add Session Form
- Text input for title (`data-testid="session-title-input"`)
- Date input (`data-testid="session-date-input"`)
- Textarea for summary (`data-testid="session-summary-input"`)
- Number input for XP (`data-testid="session-xp-input"`, min=0)
- Submit "Add Session" (`data-testid="add-session-btn"`)
- Validation: title, date, and summary required; XP defaults to 0 if empty
- All fields clear after successful submission

#### Session List
- Each session: `data-testid="session-card-{id}"`
- Title: `data-testid="session-title-{id}"`
- Date: `data-testid="session-date-{id}"`
- Summary: `data-testid="session-summary-{id}"`
- XP display: `data-testid="session-xp-{id}"` shows "{N} XP"
- Characters list joined by ", ": `data-testid="session-characters-{id}"`
- Delete button: `data-testid="delete-session-{id}"`

### Quest Section

#### Add Quest Form
- Text input for quest name (`data-testid="quest-name-input"`)
- Text input for reward (`data-testid="quest-reward-input"`)
- Submit "Add Quest" (`data-testid="add-quest-btn"`)
- Validation: name required; reward optional
- Fields clear after submission

#### Quest List
- Each quest: `data-testid="quest-card-{id}"`
- Name: `data-testid="quest-name-{id}"`
- Status badge: `data-testid="quest-status-{id}"` — "active", "completed", or "failed"
- Reward: `data-testid="quest-reward-{id}"`
- "Complete" button (only if status is "active"): `data-testid="complete-quest-{id}"`
- "Fail" button (only if status is "active"): `data-testid="fail-quest-{id}"`
- "Remove" button: `data-testid="remove-quest-{id}"`

## Behaviors

- Adding session increments total sessions and total XP; stats update immediately
- Deleting session decrements stats
- New quests start as "active"
- Completing a quest: status changes to "completed"; Complete and Fail buttons disappear
- Failing a quest: status changes to "failed"; Complete and Fail buttons disappear
- active-quests count reflects only quests with status "active"
- total-xp is sum of xp across all sessions

## Edge Cases
- XP input empty: treat as 0
- XP negative: treat as 0
- Empty quest name: do not add
- Completed/failed quests cannot be toggled back to active
