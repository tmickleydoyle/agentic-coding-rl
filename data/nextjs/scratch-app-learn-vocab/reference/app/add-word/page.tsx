'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function AddWordPage() {
  const { lists, activeListId, addWord, navigate } = useApp()
  const [listId, setListId] = useState(activeListId ?? lists[0]?.id ?? '')
  const [term, setTerm] = useState('')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (term.trim().length === 0 || answer.trim().length === 0) {
      setError('Both fields are required')
      return
    }
    setError('')
    addWord(listId, { term: term.trim(), answer: answer.trim() })
    setTerm('')
    setAnswer('')
    navigate('lists')
  }

  return (
    <section data-testid="page-add-word">
      <h1>Add Word</h1>
      <form data-testid="add-word-form" onSubmit={onSubmit}>
        <label htmlFor="list">List</label>
        <select
          id="list"
          data-testid="list-select"
          value={listId}
          onChange={(e) => setListId(e.target.value)}
        >
          {lists.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>

        <label htmlFor="term">Term</label>
        <input
          id="term"
          data-testid="term-input"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />

        <label htmlFor="answer">Answer</label>
        <input
          id="answer"
          data-testid="answer-input-new"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-word">
          Add word
        </button>
      </form>
    </section>
  )
}
