# scratch-app-blog-planner

A blog planning tool for writers to manage post ideas, drafts, and publication schedules.

## Routes
- `/` — Dashboard: counts of ideas/drafts/published, upcoming scheduled posts
- `/posts` — Posts list: add/edit status/delete posts with title, status, category, scheduledDate
- `/ideas` — Ideas backlog: capture raw ideas with title and notes; promote to post
- `/schedule` — Schedule view: posts with scheduledDate sorted chronologically

## Data model
### Post
```ts
{ id: string; title: string; status: "idea"|"draft"|"scheduled"|"published"; category: string; scheduledDate: string; notes: string; createdAt: number }
```

## Seed data
Posts: ["How to Write Better Headlines" (draft, SEO), "10 Productivity Hacks" (scheduled, 2030-01-15, Productivity), "My Year in Books" (published, Personal)]
Ideas: ["AI in Content Marketing" (notes: "explore use cases"), "Remote Work Tips" (notes: "interviews needed")]

## Behaviors
- Dashboard shows counts by status
- Posts page: filter by status (all/draft/scheduled/published)
- Adding a post requires title; status defaults to "draft"
- Promoting an idea creates a post with status "draft"
- Schedule page only shows scheduled/published posts sorted by scheduledDate
- Cannot delete a published post (show error)
- NavBar highlights active route

## Edge cases
- Empty ideas shows "No ideas yet"
- Empty schedule shows "Nothing scheduled"
