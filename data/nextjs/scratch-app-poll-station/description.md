# scratch-app-poll-station

A polling station where users create polls with multiple options, cast votes, and view live results with percentages.

## Routes
- **Home** (`home`) — stats: total polls, total votes cast, most-voted poll title
- **Polls** (`polls`) — list of all polls with question, creator, total votes, status (open/closed)
- **Create** (`create`) — form: question (required), creator (required), options (at least 2, each a text input; "Add Option" button adds more)
- **Results** (`results`) — selected poll's options with vote counts and percentages; "Vote" button for each option (if open)

## Seed Data
1. id:"p1", question:"Favorite color?", creator:"alice", status:"open", options:[{id:"o1",text:"Red",votes:5},{id:"o2",text:"Blue",votes:3},{id:"o3",text:"Green",votes:2}], createdAt:"2024-01-01T09:00:00Z"
2. id:"p2", question:"Best JS framework?", creator:"bob", status:"open", options:[{id:"o4",text:"React",votes:10},{id:"o5",text:"Vue",votes:4},{id:"o6",text:"Angular",votes:2}], createdAt:"2024-01-02T09:00:00Z"
3. id:"p3", question:"Morning or night?", creator:"carol", status:"closed", options:[{id:"o7",text:"Morning",votes:7},{id:"o8",text:"Night",votes:7}], createdAt:"2024-01-03T09:00:00Z"

## Behaviors
- **List polls**: GET /api/polls → 200 [{...polls}] newest first
- **Get poll**: GET /api/polls/[id] → 200 {poll} or 404
- **Create poll**: POST /api/polls body {question,creator,options:string[]} → 201 {poll}; requires ≥2 options; missing fields → 400
- **Vote**: POST /api/polls/[id]/vote body {optionId} → 200 {poll}; unknown poll/option → 404; closed poll → 400
- **Close poll**: POST /api/polls/[id]/close → 200 {poll}
- Results page shows percentage per option: votes / totalVotes * 100, rounded to 1 decimal; shows "N/A" if totalVotes=0
- Clicking poll row navigates to results and sets selectedPollId in context
- Create form clears and shows success after submit

## Edge Cases
- Voting on closed poll returns 400 {error:"Poll is closed"}
- Create with fewer than 2 options returns 400
- Unknown option id in vote returns 404
- Results show "Closed" badge if status is closed (data-testid="closed-badge")
