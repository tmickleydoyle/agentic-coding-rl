# scratch-app-forum

A multi-route discussion forum application where users can browse threads, post replies, upvote content, and view user profiles.

## Routes
- **Home** (`home`) — landing page with stats (total threads, total replies, active users)
- **Threads** (`threads`) — paginated list of all threads sorted by newest; each row shows title, author, reply count, upvote count, category tag
- **New Thread** (`new-thread`) — form to create a thread: title (required), body (required), category (select: General / Tech / Off-Topic)
- **Profile** (`profile`) — shows selected user's threads and reply count

## Seed Data
Three threads pre-loaded in the store:
1. id:"t1", title:"Welcome to the Forum", body:"Hello everyone!", author:"alice", category:"General", upvotes:5, replies:[{id:"r1",author:"bob",body:"Hi Alice!",upvotes:2}], createdAt: fixed ISO string
2. id:"t2", title:"Best TypeScript tips", body:"Share your tips here.", author:"bob", category:"Tech", upvotes:12, replies:[], createdAt: fixed ISO string
3. id:"t3", title:"Random thoughts", body:"Just chatting.", author:"carol", category:"Off-Topic", upvotes:1, replies:[{id:"r2",author:"alice",body:"Nice!",upvotes:0}], createdAt: fixed ISO string

## Behaviors
- **Create thread**: POST /api/threads body {title,body,author,category} → 201 {thread}; missing fields → 400
- **List threads**: GET /api/threads → 200 [{...threads}] sorted newest first
- **Get thread**: GET /api/threads/[id] → 200 {thread} or 404
- **Reply to thread**: POST /api/threads/[id]/reply body {author,body} → 201 {reply}; missing fields → 400
- **Upvote thread**: POST /api/threads/[id]/upvote → 200 {upvotes: N}
- **Upvote reply**: POST /api/threads/[id]/replies/[rid]/upvote → 200 {upvotes: N}
- Home stats: thread count, total reply count across all threads, distinct author count
- New Thread form clears after successful submit and shows success message
- Threads list shows category badge with data-testid="category-badge-{id}"
- Thread detail is shown by clicking a thread row (sets selectedThreadId in context)
- NavBar links: Home, Threads, New Thread; active link highlighted

## Edge Cases
- Creating thread with empty title or body shows inline validation error
- Replying with empty body shows validation error
- GET /api/threads/[id] with unknown id returns 404 JSON {error:"not found"}
- Upvote increments by exactly 1 each call
