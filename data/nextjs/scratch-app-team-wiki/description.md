# scratch-app-team-wiki

A team wiki for startups to document processes, decisions, and knowledge in organized pages.

## Routes
- `/` — Home: recent pages, featured categories, total page count
- `/pages` — List/create/edit/delete wiki pages. Fields: title, content (plain text), category, author, tags (comma-separated)
- `/categories` — Manage categories. Default categories: Engineering, Product, Design, Operations, Culture
- `/search` — Full-text search across page titles and content. Shows matching pages with snippet

## Seed Data
Pages:
1. { id: "1", title: "Engineering Onboarding", content: "Welcome to engineering. Setup your local environment...", category: "Engineering", author: "Alice", tags: ["onboarding", "setup"], createdAt: "2024-01-10" }
2. { id: "2", title: "Product Roadmap Process", content: "How we plan our product roadmap quarterly...", category: "Product", author: "Bob", tags: ["process", "roadmap"], createdAt: "2024-01-12" }
3. { id: "3", title: "Design System Guide", content: "Our design tokens, components, and guidelines...", category: "Design", author: "Carol", tags: ["design", "ui"], createdAt: "2024-01-15" }
4. { id: "4", title: "Team Norms", content: "How we work together, communicate, and make decisions...", category: "Culture", author: "Dan", tags: ["culture", "norms"], createdAt: "2024-01-18" }

Categories (default):
Engineering, Product, Design, Operations, Culture

## Behaviors
- Home shows last 3 pages by createdAt (newest first)
- Pages list shows all pages; clicking title shows full content
- Creating page requires title (non-empty), category, author; content optional
- Tags stored as string array (split by comma on input)
- Editing page updates in place
- Search: case-insensitive match on title OR content; highlights (shows snippet) with query term
- Categories: cannot delete category with pages assigned to it

## Edge Cases
- Title must be unique (show error if duplicate)
- Empty search returns all pages
- Tags are trimmed and de-duplicated on save
