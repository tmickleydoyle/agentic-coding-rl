'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import type { PostStatus } from '../../lib/types'

export default function EditorPage() {
  const { categories, addPost, navigate } = useApp()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [status, setStatus] = useState<PostStatus>('draft')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim().length === 0) {
      setError('Title is required')
      return
    }
    setError('')
    addPost({ title: title.trim(), body: body.trim(), categoryId, status })
    setTitle('')
    setBody('')
    navigate('posts')
  }

  return (
    <section data-testid="page-editor">
      <h1>Editor</h1>
      <form data-testid="editor-form" onSubmit={onSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          data-testid="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="body">Body</label>
        <textarea
          id="body"
          data-testid="body-input"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <label htmlFor="category">Category</label>
        <select
          id="category"
          data-testid="category-select"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <label htmlFor="status">Status</label>
        <select
          id="status"
          data-testid="status-select"
          value={status}
          onChange={(e) => setStatus(e.target.value as PostStatus)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-post">
          Save post
        </button>
      </form>
    </section>
  )
}
