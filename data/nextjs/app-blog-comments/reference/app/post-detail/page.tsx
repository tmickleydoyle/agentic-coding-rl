'use client'
import { useApp } from '../../components/AppStateProvider'
import CommentItem from '../../components/CommentItem'

export default function PostDetailPage() {
  const { posts, comments, selectedPostId, setStatus, removeComment } = useApp()
  const post = posts.find((p) => p.id === selectedPostId) ?? null
  const postComments = comments.filter((c) => c.postId === selectedPostId)

  if (!post) {
    return (
      <section data-testid="page-post-detail">
        <p data-testid="no-post">No post selected.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-post-detail">
      <h1 data-testid="detail-title">{post.title}</h1>
      {postComments.length === 0 ? (
        <p data-testid="detail-empty">No comments on this post.</p>
      ) : (
        <ul data-testid="detail-comment-list">
          {postComments.map((c) => (
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
