'use client'
import { useState } from 'react'
import { useSplit } from '../../components/SplitProvider'

export default function PeoplePage() {
  const { people, addPerson } = useSplit()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length === 0) {
      setError('Name is required')
      return
    }
    setError('')
    addPerson(name.trim())
    setName('')
  }

  return (
    <section data-testid="page-people">
      <h1>People</h1>
      <form data-testid="person-form" onSubmit={onSubmit}>
        <input
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-person">
          Add person
        </button>
      </form>
      <ul data-testid="people-list">
        {people.map((p) => (
          <li key={p.id} data-testid={`person-${p.id}`}>
            <span data-testid={`person-${p.id}-name`}>{p.name}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
