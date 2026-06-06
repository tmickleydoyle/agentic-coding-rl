# scratch-app-wiki

A collaborative wiki application where users can browse articles, create new ones, edit existing content, and view revision history.

## Routes
- **Home** (`home`) — landing page showing total article count and recent articles list (last 3 by updatedAt)
- **Articles** (`articles`) — searchable list of all articles showing title, author, last-edited date, and tag(s)
- **New Article** (`new-article`) — form: title (required), body (required), tags (comma-separated text input), author (required)
- **History** (`history`) — shows full revision history for the selected article (selectedArticleId in context)

## Seed Data
Three articles pre-loaded:
1. id:"a1", title:"Getting Started", body:"Welcome to the wiki.", author:"alice", tags:["guide"], revisions:[{id:"rev1",body:"Welcome to the wiki.",editedBy:"alice",editedAt:"2024-01-01T09:00:00Z"}], createdAt:"2024-01-01T09:00:00Z", updatedAt:"2024-01-01T09:00:00Z"
2. id:"a2", title:"TypeScript Guide", body:"TypeScript adds types to JS.", author:"bob", tags:["tech","guide"], revisions:[{id:"rev2",body:"TypeScript adds types to JS.",editedBy:"bob",editedAt:"2024-01-02T09:00:00Z"}], createdAt:"2024-01-02T09:00:00Z", updatedAt:"2024-01-02T09:00:00Z"
3. id:"a3", title:"Markdown Tips", body:"Use # for headings.", author:"carol", tags:["tips"], revisions:[{id:"rev3",body:"Use # for headings.",editedBy:"carol",editedAt:"2024-01-03T09:00:00Z"}], createdAt:"2024-01-03T09:00:00Z", updatedAt:"2024-01-03T09:00:00Z"

## Behaviors
- **List articles**: GET /api/articles → 200 [{...articles}] sorted newest updatedAt first
- **Get article**: GET /api/articles/[id] → 200 {article} or 404
- **Create article**: POST /api/articles body {title,body,author,tags:string[]} → 201 {article}; missing fields → 400
- **Edit article**: PUT /api/articles/[id] body {body,editedBy} → 200 {article}; appends new revision; missing fields → 400; unknown id → 404
- Articles page has search input (data-testid="search-input") that filters list by title (case-insensitive)
- New Article form clears after submit and shows "Article created!" success message
- Clicking an article row navigates to the History route and sets selectedArticleId
- NavBar: Home, Articles, New Article
- History page shows article title, current body, and all revisions with editedBy and editedAt

## Edge Cases
- Search with no matches shows "No articles found" (data-testid="no-results")
- Create with missing title or body shows inline error
- Edit with unknown id returns 404 JSON {error:"not found"}
- Each edit appends a revision; original body is always revision 1
