# Infinite feed (Load more)

A feed that loads pages of items on demand via an injectable, promise-based loader. It dedupes by
`id`, shows a loading state while a page is in flight, appends new results, and shows a terminal
"No more" state once exhausted. This task spans **4 files**.

A `Post` is `{ id: number; title: string }`. A loader is
`type Loader = (page: number) => Promise<{ items: Post[]; hasMore: boolean }>` (pages are 0-based).

- `components/types.ts` — exports `type Post = { id: number; title: string }` and the `Loader` type.

- `hooks/useFeed.ts` — exports `useFeed(load: Loader)` returning
  `{ items, loading, hasMore, error, loadMore }`:
  - `items: Post[]` (starts `[]`), accumulated across pages, **deduped by id** (an incoming item whose
    id already exists is dropped; existing order is preserved, new unique items appended in order).
  - `loading: boolean` (starts `false`); `hasMore: boolean` (starts `true`); `error: string | null` (starts `null`).
  - `loadMore()` — if `loading` is true or `hasMore` is false, do nothing. Otherwise set `loading`,
    call `load(nextPage)` (the first call uses page `0`, then `1`, ...), and on resolve: append the
    deduped items, set `hasMore` from the result, advance the page counter, clear `loading`. On reject,
    set `error` to the rejection's message and clear `loading` (do not advance the page).

- `components/PostView.tsx` — accepts `{ post: Post }`; renders `<li data-testid={`post-${post.id}`}>{post.title}</li>`.

- `components/Feed.tsx` (entry, default export) — accepts `{ load: Loader }`. Uses `useFeed` and renders:
  - a `<ul data-testid="feed">` of `<PostView>` for each item.
  - a `<button data-testid="load-more">Load more</button>` that calls `loadMore`; it is `disabled`
    while `loading` or when `!hasMore`.
  - `<span data-testid="loading">Loading…</span>` only while `loading`.
  - `<span data-testid="end">No more</span>` only when `!hasMore`.
  - `<span data-testid="error">{error}</span>` only when `error` is non-null.
