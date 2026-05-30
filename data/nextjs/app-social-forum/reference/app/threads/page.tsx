'use client'
import { useApp } from '../../components/AppStateProvider'
import { useThreads } from '../../hooks/useThreads'
import SortBar from '../../components/SortBar'
import ThreadRow from '../../components/ThreadRow'

export default function ThreadsPage() {
  const { categories, sort, categoryFilter, setSort, setCategoryFilter, upvoteThread, openThread } =
    useApp()
  const { visibleThreads } = useThreads()

  return (
    <section data-testid="page-threads">
      <h1>Threads</h1>
      <SortBar
        categories={categories}
        sort={sort}
        categoryFilter={categoryFilter}
        onSortChange={setSort}
        onCategoryChange={setCategoryFilter}
      />
      {visibleThreads.length === 0 ? (
        <p data-testid="empty-threads">No threads here yet.</p>
      ) : (
        <ul data-testid="thread-list">
          {visibleThreads.map((t) => (
            <ThreadRow key={t.id} thread={t} onUpvote={upvoteThread} onOpen={openThread} />
          ))}
        </ul>
      )}
    </section>
  )
}
