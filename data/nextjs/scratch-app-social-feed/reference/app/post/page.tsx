'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import CommentItem from '../../components/CommentItem'

export default function PostPage() {
  const { posts, comments, users, selectedPostId, toggleLike, addComment } = useApp()
  const [text, setText] = useState('')

  const post = posts.find((p) => p.id === selectedPostId)
  if (!post) {
    return (
      <section data-testid="page-post">
        <p data-testid="no-post-selected">No post selected.</p>
      </section>
    )
  }

  const handle = (id: string): string =>
    users.find((u) => u.id === id)?.handle ?? '@unknown'

  const postComments = comments.filter((c) => c.postId === post.id)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim().length === 0) return
    addComment(post.id, text)
    setText('')
  }

  return (
    <section data-testid="page-post">
      <h1>Post</h1>
      <span data-testid="detail-author">{handle(post.authorId)}</span>
      <p data-testid="detail-text">{post.text}</p>
      <span data-testid="detail-likes">{post.likes}</span>
      <button data-testid="detail-like" onClick={() => toggleLike(post.id)}>
        {post.likedByMe ? 'Unlike' : 'Like'}
      </button>
      <ul data-testid="comment-list">
        {postComments.map((c) => (
          <CommentItem key={c.id} comment={c} authorHandle={handle(c.authorId)} />
        ))}
      </ul>
      <form data-testid="comment-form" onSubmit={onSubmit}>
        <input
          data-testid="comment-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" data-testid="comment-submit">
          Comment
        </button>
      </form>
    </section>
  )
}
