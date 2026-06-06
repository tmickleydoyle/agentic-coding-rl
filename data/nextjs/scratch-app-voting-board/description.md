# scratch-app-voting-board

A voting board where community members submit proposals, vote for or against them, and track a leaderboard of top proposals.

## Routes
- **Home** (`home`) — stats: total proposals, total votes, top proposal title
- **Proposals** (`proposals`) — list of all proposals sorted by score (upvotes - downvotes) descending; shows title, author, score, vote counts, category, status
- **Submit** (`submit`) — form: title (required), description (required), author (required), category (select: Feature / Bug Fix / Improvement / Other)
- **Leaderboard** (`leaderboard`) — top 5 proposals by score with rank, title, author, and score

## Seed Data
1. id:"pr1", title:"Add dark mode", description:"Support dark theme", author:"alice", category:"Feature", upvotes:15, downvotes:2, status:"open", createdAt:"2024-01-01T09:00:00Z"
2. id:"pr2", title:"Fix login bug", description:"Login fails on mobile", author:"bob", category:"Bug Fix", upvotes:20, downvotes:1, status:"open", createdAt:"2024-01-02T09:00:00Z"
3. id:"pr3", title:"Improve performance", description:"Reduce load time", author:"carol", category:"Improvement", upvotes:8, downvotes:5, status:"closed", createdAt:"2024-01-03T09:00:00Z"
4. id:"pr4", title:"Add notifications", description:"Push notifications", author:"alice", category:"Feature", upvotes:12, downvotes:3, status:"open", createdAt:"2024-01-04T09:00:00Z"

## Behaviors
- **List proposals**: GET /api/proposals → 200 [{...proposals}] sorted by (upvotes - downvotes) desc
- **Get proposal**: GET /api/proposals/[id] → 200 {proposal} or 404
- **Submit proposal**: POST /api/proposals body {title,description,author,category} → 201 {proposal}; missing fields → 400
- **Upvote**: POST /api/proposals/[id]/upvote → 200 {upvotes,score}; closed → 400; unknown → 404
- **Downvote**: POST /api/proposals/[id]/downvote → 200 {downvotes,score}; closed → 400; unknown → 404
- Score = upvotes - downvotes shown in data-testid="score-{id}"
- Proposals list shows vote buttons (data-testid="upvote-{id}", data-testid="downvote-{id}") for open proposals
- Leaderboard shows only top 5 by score
- Submit form clears + shows success on success

## Edge Cases
- Voting on closed proposal returns 400 {error:"Proposal is closed"}
- Submit with missing fields shows inline error
- Leaderboard shows at most 5 entries even if more exist
