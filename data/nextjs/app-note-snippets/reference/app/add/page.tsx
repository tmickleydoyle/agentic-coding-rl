'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function AddPage() {
  const { addSnippet, navigate } = useApp()
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim().length === 0 || language.trim().length === 0) {
      setError('Title and language are required')
      return
    }
    setError('')
    addSnippet({ title: title.trim(), language: language.trim(), code })
    navigate('snippets')
  }

  return (
    <section data-testid="page-add">
      <h1>Add snippet</h1>
      <form data-testid="snippet-form" onSubmit={onSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          data-testid="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="language">Language</label>
        <input
          id="language"
          data-testid="language-input"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />

        <label htmlFor="code">Code</label>
        <textarea
          id="code"
          data-testid="code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="save-snippet">
          Save snippet
        </button>
      </form>
    </section>
  )
}
