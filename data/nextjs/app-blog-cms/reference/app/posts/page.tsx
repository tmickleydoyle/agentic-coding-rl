'use client'
import { useApp } from '../../components/AppStateProvider'
import { usePosts } from '../../hooks/usePosts'
import Filters from '../../components/Filters'
import PostItem from '../../components/PostItem'

export default function PostsPage() {
  const {
    categories,
    statusFilter,
    categoryFilter,
    setStatusFilter,
    setCategoryFilter,
    togglePublish,
    removePost,
  } = useApp()
  const { filtered } = usePosts()

  const categoryName = (id: string): string =>
    categories.find((c) => c.id === id)?.name ?? 'Uncategorized'

  return (
    <section data-testid="page-posts">
      <h1>Posts</h1>
      <Filters
        categories={categories}
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        onStatusChange={setStatusFilter}
        onCategoryChange={setCategoryFilter}
      />
      {filtered.length === 0 ? (
        <p data-testid="empty-state">No posts match these filters.</p>
      ) : (
        <ul data-testid="post-list">
          {filtered.map((p) => (
            <PostItem
              key={p.id}
              post={p}
              categoryName={categoryName(p.categoryId)}
              onTogglePublish={togglePublish}
              onRemove={removePost}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
