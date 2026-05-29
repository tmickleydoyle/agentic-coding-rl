# Fix: Stale search response overwrites a newer one (race condition)

`hooks/useSearch.ts` exports `useSearch(fetcher)` where
`fetcher: (query: string) => Promise<string[]>`. It returns `{ query, setQuery, results,
loading }`. Each call to `setQuery` kicks off `fetcher(query)` and, when it resolves,
stores the array in `results` and clears `loading`.

`components/SearchBox.tsx` uses it: an input (`data-testid="query"`) drives `setQuery`,
results render as `data-testid={`result-${i}`}`, and `data-testid="loading"` shows
`"loading"` while a request is in flight (empty otherwise).

**Bug:** responses are applied unconditionally in resolution order. When the user types
quickly, an EARLIER (slower) request can resolve AFTER a later (faster) one and overwrite
the newer, correct results — a classic out-of-order race. The displayed results then
correspond to a stale query.

Fix `hooks/useSearch.ts` so only the response for the MOST RECENT query is applied: track
a request sequence (or generation id) and ignore any response whose request is no longer
the latest. `loading` must be false once the latest request settles, even if older
in-flight requests resolve afterward. Keep the return shape and `data-testid`
attributes. Default export for the component; named export `useSearch` for the hook.
