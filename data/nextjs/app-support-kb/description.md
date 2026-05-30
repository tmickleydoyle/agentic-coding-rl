# Support Knowledge Base app

Build a small multi-route helpdesk knowledge-base app. Routing is **in-app** (React state —
no `next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Category = 'account' | 'billing' | 'technical' | 'general'`
- `Article = { id: string; title: string; body: string; category: Category; helpful: number; notHelpful: number }`
- `CategoryFilter = 'all' | Category`
- `Route = 'articles' | 'article-detail' | 'categories' | 'search'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws if used outside the provider:

- `articles: Article[]`, `theme: Theme`, `route: Route`, `selectedArticleId: string | null`
- `categoryFilter: CategoryFilter`, `query: string`
- `voteHelpful(id)` / `voteNotHelpful(id)` — increment the matching counter
- `selectArticle(id)` — sets `selectedArticleId` and navigates to `article-detail`
- `setCategoryFilter` / `setQuery` / `setTheme` / `navigate`

## Routes
- `articles` — list of all articles (title + category) filtered by `categoryFilter`, Open buttons.
- `article-detail` — selected article: title, category, body, helpful/not-helpful counts + vote buttons.
- `categories` — counts of articles per category.
- `search` — text input that matches title/body case-insensitively, shows matching results.

## API — `app/api/articles/route.ts`
Web `Request`/`Response` handlers backed by `lib/store.ts` (seeded, with `__reset()`):
GET (list + `?category=`/`?q=` filters), POST (create, 400 if blank title),
PUT (`?id=` with `{ vote: 'helpful' | 'notHelpful' }` or field updates, 404 if missing),
DELETE (`?id=`, 404 if missing).
