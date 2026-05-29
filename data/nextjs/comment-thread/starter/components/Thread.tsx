'use client'
import type { Comment as CommentType } from './types'
import { useThread } from '../hooks/useThread'
import Comment from './Comment'

// TODO: use useThread. Render <ul data-testid="thread"> of root Comments, plus a root reply box
// (<input data-testid="root-input"> + <button data-testid="root-btn">Add</button>) that calls
// addRoot(text) for non-empty input and clears the field.
export default function Thread({ initial = [] }: { initial?: CommentType[] }) {
  const { comments, addReply, addRoot } = useThread(initial)
  return (
    <div>
      <ul data-testid="thread" />
    </div>
  )
}
