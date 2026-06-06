# Poll Creator

An app for creating polls, voting on them, and viewing results.

## Routes
- `/` → Home: total polls, total votes cast across all polls, most popular poll name
- `/polls` → Polls: list all polls with question and option count; add new poll form
- `/vote` → Vote: select a poll to vote on; cast vote for one option
- `/results` → Results: for each poll show options with vote counts and percentages

## Data Model

### Poll
```ts
interface Poll {
  id: string
  question: string
  options: string[]  // option labels
}
```

### Vote
```ts
interface Vote {
  id: string
  pollId: string
  option: string
}
```

## Seed Data
Polls:
- { id: "p1", question: "Best programming language?", options: ["Python", "TypeScript", "Rust"] }
- { id: "p2", question: "Preferred work style?", options: ["Remote", "Hybrid", "Office"] }
- { id: "p3", question: "Favorite season?", options: ["Spring", "Summer", "Fall", "Winter"] }

Votes:
- { id: "v1", pollId: "p1", option: "TypeScript" }
- { id: "v2", pollId: "p1", option: "Python" }
- { id: "v3", pollId: "p1", option: "TypeScript" }
- { id: "v4", pollId: "p2", option: "Remote" }
- { id: "v5", pollId: "p2", option: "Remote" }
- { id: "v6", pollId: "p2", option: "Hybrid" }

## Behaviors

### Home Page
- data-testid="total-polls": count of polls (3)
- data-testid="total-votes": total vote count (6)
- data-testid="popular-poll": question of poll with most votes (p1 and p2 both have 3, show p1)

### Polls Page
- Each poll: data-testid="poll-item-{id}"
- Shows question and option count (e.g., "3 options")
- Add form: question (text), options (comma-separated)
- Submit: data-testid="add-poll-btn"

### Vote Page
- Poll selector: data-testid="poll-select" (select element with poll ids as values)
- When poll selected, show options as radio buttons: data-testid="option-{optionLabel}" (spaces→hyphens)
- Submit vote button: data-testid="cast-vote-btn"
- Shows "Vote cast!" confirmation: data-testid="vote-confirm"

### Results Page
- For each poll: data-testid="result-poll-{id}"
- For each option: data-testid="result-option-{pollId}-{optionLabel}" (spaces→hyphens)
- Shows vote count and percentage (total votes in poll)

## API Routes
- GET /api/polls → { polls: Poll[] }
- POST /api/polls → body { question, options: string[] } → created Poll
- GET /api/polls/votes → { votes: Vote[] }
- POST /api/polls/votes → body { pollId, option } → created Vote

## Edge Cases
- Missing question on poll POST returns 400
- Voting on a poll with no existing votes shows 0% for all options
- Results page shows 0 votes for options with no votes
- Percentage = (optionVotes / totalPollVotes * 100), show as integer
