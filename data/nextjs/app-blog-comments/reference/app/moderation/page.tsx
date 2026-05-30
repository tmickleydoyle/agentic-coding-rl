'use client'
import { useApp } from '../../components/AppStateProvider'
import { useComments } from '../../hooks/useComments'
import CommentItem from '../../components/CommentItem'

export default function ModerationPage() {
  const { statusFilter, setStatusFilter, setStatus, removeComment } = useApp()
  const { filtered } = useComments()

  return (
    <section data-testid="page-moderation">
      <h1>Moderation</h1>
      <label htmlFor="status-filter">Status</label>
      <select
        id="status-filter"
        data-testid="status-filter"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="spam">Spam</option>
      </select>
      {filtered.length === 0 ? (
        <p data-testid="empty-state">No comments match this filter.</p>
      ) : (
        <ul data-testid="comment-list">
          {filtered.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              onSetStatus={setStatus}
              onRemove={removeComment}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
