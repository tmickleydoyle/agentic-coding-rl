# Community Board

A neighborhood community board app with 4 routes: Posts, Members, Events, and a REST API.

## Routes
- `/` — Shell, renders active route
- `/posts` — community posts (title, author, category: News/Question/Offer, content, timestamp), add post form
- `/members` — registered members (name, role: Admin/Member, joined date), admin can promote Member→Admin
- `/events` — upcoming community events (title, date, location, attendee count), RSVP button increments attendee count

## Data / Seed
### Posts
```
{ id: "p1", title: "Park cleanup this Saturday", author: "Alice", category: "News", content: "Meet at 9am near the fountain.", timestamp: "2024-06-01" }
{ id: "p2", title: "Lost cat on Elm St", author: "Bob", category: "News", content: "Orange tabby, answers to Mochi.", timestamp: "2024-06-02" }
{ id: "p3", title: "Anyone know a good plumber?", author: "Carol", category: "Question", content: "Need help with leaky pipe.", timestamp: "2024-06-03" }
```

### Members
```
{ id: "m1", name: "Alice", role: "Admin", joined: "2023-01-15" }
{ id: "m2", name: "Bob", role: "Member", joined: "2023-03-20" }
{ id: "m3", name: "Carol", role: "Member", joined: "2023-05-10" }
```

### Events
```
{ id: "e1", title: "Block Party", date: "2024-07-04", location: "Main St", attendees: 12 }
{ id: "e2", title: "Town Hall Meeting", date: "2024-07-15", location: "Community Center", attendees: 5 }
```

## Behaviors
- Posts page: form with Title, Author, Category (select), Content — adds post with current date
- Members page: "Promote to Admin" button on Member rows changes role to Admin
- Events page: "RSVP" button increments attendees count by 1
- API GET /api/posts returns all posts
- API POST /api/posts adds a post (body: {title, author, category, content})

## Edge Cases
- Posts form: all fields required, no empty title allowed
- Empty state: "No posts yet" when list empty
- Category filter: posts page shows all categories by default
