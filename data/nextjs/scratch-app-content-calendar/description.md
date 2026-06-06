# scratch-app-content-calendar

A content calendar for marketing teams to plan, draft, and publish content across channels.

## Routes
- `/` — Calendar view: monthly grid showing content items by date
- `/drafts` — Drafts list: content items in draft/review state; edit title/body/channel
- `/publish` — Publish queue: approve and mark items as published
- `/analytics` — Analytics: counts by channel, status, and total items

## Data model
### ContentItem
```ts
{ id: string; title: string; body: string; channel: "blog"|"twitter"|"linkedin"|"email"; status: "draft"|"review"|"approved"|"published"; scheduledDate: string; createdAt: number }
```

## Seed data
Items: 
- "Q1 Product Launch" (blog, approved, 2030-03-01)
- "Feature Spotlight Tweet" (twitter, draft, 2030-03-05)
- "LinkedIn Thought Leadership" (linkedin, review, 2030-03-10)
- "Monthly Newsletter" (email, approved, 2030-03-15)
- "Release Notes Post" (blog, published, 2030-02-28)

## Behaviors
- Calendar shows items grouped by scheduledDate
- Drafts page shows draft+review items; allows editing title/channel/status
- Publish queue shows approved items; clicking "Publish" sets status to published
- Analytics counts per channel and per status
- Adding a content item requires title and scheduledDate
- Cannot publish an item that is not approved (show error)
- NavBar highlights active route

## Edge cases
- Empty publish queue shows "Nothing to publish"
- Empty drafts shows "No drafts"
