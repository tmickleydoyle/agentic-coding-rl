# Study Log

A single-page React app for logging study sessions with duration tracking and subject summaries.

## Seed Data

6 study sessions:

| ID | Subject    | Topic                        | Date       | Duration (minutes) | Rating (1-5) |
|----|------------|------------------------------|------------|--------------------|--------------|
| 1  | Math       | Derivatives                  | 2024-02-05 | 45                 | 4            |
| 2  | Science    | Newton's Laws                | 2024-02-05 | 60                 | 5            |
| 3  | English    | Shakespeare Sonnets          | 2024-02-06 | 30                 | 3            |
| 4  | Math       | Integrals                    | 2024-02-06 | 90                 | 5            |
| 5  | History    | The Renaissance              | 2024-02-07 | 50                 | 3            |
| 6  | Science    | Thermodynamics               | 2024-02-07 | 75                 | 4            |

## UI Layout

### Heading
`<h1>Study Log</h1>`

### Add Session Form
- Text input labeled **"Subject"**
- Text input labeled **"Topic"**
- Date input labeled **"Date"**
- Number input labeled **"Duration (minutes)"** (min 1)
- Number input labeled **"Rating"** (min 1, max 5)
- Button **"Log Session"** — adds session; does nothing if subject or topic is blank; clears inputs after adding

### Session List
All sessions, most recent first (sorted by date descending, then by id descending for same date).

Each session item (`data-testid="session-item"`):
- `data-testid="session-subject"` — subject
- `data-testid="session-topic"` — topic
- `data-testid="session-date"` — date string as stored
- `data-testid="session-duration"` — duration in minutes as number string, e.g. `45`
- `data-testid="session-rating"` — rating as number string, e.g. `4`
- A button **"Delete"** that removes the session

### Subject Summary Table
A table showing per-subject stats. Columns: **Subject**, **Sessions**, **Total Minutes**, **Avg Rating**.

Each row (`data-testid="subject-row"`):
- `data-testid="subject-name"` — subject name
- `data-testid="subject-sessions"` — number of sessions for this subject
- `data-testid="subject-minutes"` — total minutes for this subject
- `data-testid="subject-avg-rating"` — average rating rounded to 1 decimal place

Subjects should appear in the table in alphabetical order.

### Overall Stats
- `data-testid="total-sessions"` — total number of sessions
- `data-testid="total-minutes"` — total minutes across all sessions
- `data-testid="avg-rating"` — overall average rating rounded to 1 decimal place

## Edge Cases
- Deleting a session updates the subject summary and overall stats.
- Adding a session immediately appears at the top of the list (most recent by id).
- Do not add session if subject or topic is empty/whitespace-only.
- Rating and duration are stored as numbers.
