# scratch-app-copywriting

A copywriting workspace for managing projects, creative briefs, copy variations, and review workflows.

## Routes
- `/` — Projects: list of copywriting projects with client, status, deadline
- `/briefs` — Briefs: creative briefs linked to projects (audience, tone, goal, key messages)
- `/copies` — Copies: copy variations per brief (headline, body, CTA); rate and select winner
- `/review` — Review: copies needing review (status=review); approve or request revision

## Data model
### CopyProject
```ts
{ id: string; name: string; client: string; status: "active"|"completed"|"archived"; deadline: string; createdAt: number }
```
### Brief
```ts
{ id: string; projectId: string; audience: string; tone: string; goal: string; keyMessages: string; createdAt: number }
```
### Copy
```ts
{ id: string; briefId: string; headline: string; body: string; cta: string; status: "draft"|"review"|"approved"|"revision"; rating: number; createdAt: number }
```

## Seed data
Projects: ["Nike Campaign" (active, SportsCo, 2030-06-30), "SaaS Onboarding" (active, TechCorp, 2030-07-15), "Holiday Promo" (completed, RetailCo, 2029-12-25)]
Briefs: [brief for Nike (audience: "athletes 18-35", tone: "motivational", goal: "brand awareness"), brief for SaaS (audience: "B2B decision makers", tone: "professional", goal: "trial signups")]
Copies: ["Just Do It Again" (Nike brief, draft, rating:0), "Start Free Today" (SaaS brief, review, rating:4), "Win This Season" (Nike brief, review, rating:3)]

## Behaviors
- Projects: add requires name and client; archive doesn't delete
- Briefs: add requires projectId; one brief per project enforced
- Copies: add requires briefId, headline, body; rating 0-5
- Review page shows only review-status copies; approve sets status to approved
- NavBar highlights active route

## Edge cases
- No copies in review shows "Nothing in review"
- Empty projects shows "No projects"
