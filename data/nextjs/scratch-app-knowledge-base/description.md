# Knowledge Base App

A multi-route knowledge base for managing articles, categories, and searching content.

## Routes
- **Home** (`home`): Dashboard showing total articles, total categories, and published articles count.
- **Articles** (`articles`): List articles with title, categoryId (resolved to category name), author, status (draft/published), createdDate. Add new article (title, category, author, content, status). Delete article.
- **Categories** (`categories`): List categories with name, description, article count. Add new category (name, description). Delete category.
- **Search** (`search`): Text input to search articles by title or content (case-insensitive). Show matching articles with title, author, and excerpt (first 100 chars of content).

## Seed Data
Three categories:
1. Technology, "Tech articles and tutorials"
2. Science, "Scientific discoveries"
3. Business, "Business and finance"

Three articles:
1. "Getting Started with React", Technology, Jane Doe, published, 2024-01-10, content: "React is a JavaScript library for building user interfaces..."
2. "The Future of AI", Technology, John Smith, published, 2024-02-15, content: "Artificial intelligence is transforming every industry..."
3. "Climate Change Solutions", Science, Jane Doe, draft, 2024-03-20, content: "Scientists are working on innovative solutions to combat climate change..."

## Fields & Validation
- Article: title (required), categoryId (required), author (required), content (required), status (draft/published)
- Category: name (required), description (optional)

## Behaviors
- Articles page: filter by status (all/draft/published)
- Categories page: shows article count per category
- Search page: real-time filter as user types (no submit button needed, filter on input change)
- API returns 400 for missing required fields

## API
- GET/POST /api/articles — list / create article
- DELETE /api/articles — delete `{ id }`
- GET/POST /api/categories — list / create category
- DELETE /api/categories — delete `{ id }`

## data-testid Requirements
- nav-home, nav-articles, nav-categories, nav-search
- dashboard-article-count, dashboard-category-count, dashboard-published-count
- article-list, article-item, article-status-filter, add-article-form, article-title-input, article-category-select, article-author-input, article-content-input, article-status-select, submit-article, delete-article
- category-list, category-item, add-category-form, category-name-input, category-description-input, submit-category, delete-category
- search-input, search-results, search-result-item
