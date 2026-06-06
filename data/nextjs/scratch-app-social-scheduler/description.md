# scratch-app-social-scheduler

A social media scheduling tool to compose posts, manage a publishing queue, and connect accounts.

## Routes
- `/` — Feed: list of all scheduled/posted items sorted by scheduledAt
- `/compose` — Compose: write a post, select accounts, set scheduledAt datetime
- `/queue` — Queue: pending posts (status=scheduled); cancel or reschedule
- `/accounts` — Accounts: manage connected social accounts (add/remove)

## Data model
### SocialAccount
```ts
{ id: string; platform: "twitter"|"instagram"|"linkedin"|"facebook"; handle: string; connected: boolean }
```
### SocialPost
```ts
{ id: string; body: string; accountIds: string[]; status: "draft"|"scheduled"|"posted"|"cancelled"; scheduledAt: string; createdAt: number }
```

## Seed data
Accounts: [@devnews (twitter), @devlife (instagram), @developer (linkedin)]
Posts:
- "Excited to share our new release!" (twitter+linkedin, scheduled, 2030-06-01T10:00)
- "Behind the scenes look at our office" (instagram, posted, 2030-05-20T14:00)
- "Join our upcoming webinar" (all accounts, scheduled, 2030-06-15T09:00)

## Behaviors
- Feed shows all posts sorted by scheduledAt descending
- Compose: body required, at least one account required, scheduledAt required
- Queue shows only scheduled posts; cancel sets status to cancelled
- Accounts page: add account (platform + handle), remove account (if no posts reference it)
- Post body max 280 chars; show char count
- NavBar highlights active route

## Edge cases
- Empty queue shows "Queue is empty"
- Compose with no accounts selected shows error
