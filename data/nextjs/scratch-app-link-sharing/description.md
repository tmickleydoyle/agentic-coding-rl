# scratch-app-link-sharing

A link-sharing platform where users submit URLs with titles, upvote links, leave comments, and view submitter profiles.

## Routes
- **Home** (`home`) — stats: total links, total comments, top-upvoted link title
- **Links** (`links`) — list of all links sorted by upvotes descending; each row shows rank, title, url, submitter, upvote count, comment count, category
- **Submit** (`submit`) — form: title (required), url (required), category (select: News / Tech / Fun / Other), submitter (required)
- **Profile** (`profile`) — selected user's submitted links

## Seed Data
1. id:"l1", title:"OpenAI launches GPT-5", url:"https://openai.com", submitter:"alice", category:"Tech", upvotes:20, comments:[{id:"c1",author:"bob",body:"Impressive!",createdAt:"2024-01-01T10:00:00Z"}], createdAt:"2024-01-01T09:00:00Z"
2. id:"l2", title:"Funny cat video", url:"https://cats.example.com", submitter:"bob", category:"Fun", upvotes:8, comments:[], createdAt:"2024-01-02T09:00:00Z"
3. id:"l3", title:"Breaking news", url:"https://news.example.com", submitter:"carol", category:"News", upvotes:15, comments:[{id:"c2",author:"alice",body:"Big story!",createdAt:"2024-01-03T10:00:00Z"},{id:"c3",author:"carol",body:"Indeed.",createdAt:"2024-01-03T11:00:00Z"}], createdAt:"2024-01-03T09:00:00Z"

## Behaviors
- **List links**: GET /api/links → 200 [{...links}] sorted by upvotes desc
- **Get link**: GET /api/links/[id] → 200 {link} or 404
- **Submit link**: POST /api/links body {title,url,submitter,category} → 201 {link}; missing fields → 400
- **Upvote**: POST /api/links/[id]/upvote → 200 {upvotes:N}; unknown id → 404
- **Add comment**: POST /api/links/[id]/comments body {author,body} → 201 {comment}; missing fields → 400
- Links list shows rank (1-based position) in data-testid="rank-{id}"
- Clicking link title opens detail view (same page, show comments + add comment form)
- Submit form clears and shows success message on success
- Clicking submitter name goes to profile route and sets selectedUser

## Edge Cases
- Submit with missing title/url/submitter shows inline error
- Comment with empty body shows validation error (data-testid="comment-error")
- Upvote increments by exactly 1
