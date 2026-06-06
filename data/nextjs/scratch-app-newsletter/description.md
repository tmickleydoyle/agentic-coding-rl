# scratch-app-newsletter

A newsletter management app for creating campaigns, managing subscribers, and tracking send stats.

## Routes
- `/` — Campaigns: list campaigns with subject, status, sent count; create new campaigns
- `/subscribers` — Subscribers: list/add/remove subscribers with email, name, tags
- `/templates` — Templates: create/edit reusable email templates with subject and body
- `/stats` — Stats: open rates, click rates, subscriber growth over campaigns

## Data model
### Campaign
```ts
{ id: string; subject: string; templateId: string; status: "draft"|"scheduled"|"sent"; scheduledAt: string; sentCount: number; openCount: number; clickCount: number; createdAt: number }
```
### Subscriber
```ts
{ id: string; email: string; name: string; tags: string[]; active: boolean; createdAt: number }
```
### Template
```ts
{ id: string; name: string; subject: string; body: string; createdAt: number }
```

## Seed data
Templates: ["Welcome Email" (subject: "Welcome!", body: "Hello {name}"), "Monthly Update" (subject: "This Month in Tech", body: "Hi there")]
Subscribers: [alice@example.com (Alice, tags:["vip"]), bob@example.com (Bob, tags:[]), carol@example.com (Carol, tags:["vip","developer"])]
Campaigns: ["April Newsletter" (sent, sentCount:3, openCount:2, clickCount:1), "May Update" (draft, 0/0/0)]

## Behaviors
- Campaigns page: create campaign requires subject; delete draft campaigns only
- Subscribers: add requires valid email; cannot add duplicate email; deactivate instead of hard-delete
- Templates: add/edit/delete; cannot delete template used by a scheduled/sent campaign
- Stats page shows: total subscribers, active subscribers, avg open rate across sent campaigns
- NavBar highlights active route

## Edge cases
- No subscribers shows "No subscribers"
- No campaigns shows "No campaigns yet"
