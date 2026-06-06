# Donation Drive

A charitable donation campaign management app with Campaigns, Donors, Leaderboard, and a REST API.

## Routes
- `/` — Shell
- `/campaigns` — fundraising campaigns (name, goal amount, raised amount, status: Active/Closed, end date); donate button opens inline form
- `/donors` — donor records (name, email, total donated, campaign count), add donor
- `/leaderboard` — top donors sorted by total donated descending; shows rank, name, total donated

## Data / Seed
### Campaigns
```
{ id: "c1", name: "Winter Shelter Fund", goal: 5000, raised: 3200, status: "Active", endDate: "2024-12-31" }
{ id: "c2", name: "School Supplies Drive", goal: 1000, raised: 1000, status: "Closed", endDate: "2024-08-01" }
{ id: "c3", name: "Food Pantry Restock", goal: 2000, raised: 750, status: "Active", endDate: "2024-11-30" }
```

### Donors
```
{ id: "d1", name: "Alice Wong", email: "alice@example.com", totalDonated: 500, campaignCount: 2 }
{ id: "d2", name: "Bob Garcia", email: "bob@example.com", totalDonated: 300, campaignCount: 1 }
{ id: "d3", name: "Carol Smith", email: "carol@example.com", totalDonated: 750, campaignCount: 3 }
```

## Behaviors
- Campaigns: "Donate" button on Active campaigns shows inline form (donor name select, amount input); submitting adds to raised total
- Campaigns: progress percentage shown as raised/goal * 100 (integer)
- Donors: add donor form (name, email); new donors start with totalDonated=0, campaignCount=0
- Leaderboard: sorted by totalDonated descending; rank numbers 1, 2, 3...
- API GET /api/campaigns returns all campaigns
- API POST /api/campaigns creates a campaign (body: {name, goal, endDate})

## Edge Cases
- Donate button disabled / hidden on Closed campaigns
- Amount must be positive number; invalid input rejected
- Leaderboard updates when donations are made
- Empty donors state: "No donors yet"
