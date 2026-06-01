'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function CreatePage() {
  const { createPoll, openPoll } = useApp()
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', '', ''])
  const [error, setError] = useState('')

  const setOption = (i: number, val: string) => {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? val : o)))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = createPoll(question, options)
    if (id === null) {
      setError('A question and at least two options are required')
      return
    }
    setError('')
    openPoll(id)
  }

  return (
    <section data-testid="page-create">
      <h1>Create a poll</h1>
      <form data-testid="create-form" onSubmit={onSubmit}>
        <label htmlFor="question">Question</label>
        <input
          id="question"
          data-testid="question-input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        {options.map((val, i) => (
          <input
            key={i}
            data-testid={`option-input-${i}`}
            value={val}
            onChange={(e) => setOption(i, e.target.value)}
          />
        ))}
        {error ? <p data-testid="create-error">{error}</p> : null}
        <button type="submit" data-testid="submit-poll">
          Create poll
        </button>
      </form>
    </section>
  )
}
