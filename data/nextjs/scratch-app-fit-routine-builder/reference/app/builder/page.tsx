'use client'
import { useState } from 'react'
import { useRoutine } from '../../components/RoutineProvider'

export default function BuilderPage() {
  const { library, addRoutine, navigate } = useRoutine()
  const [name, setName] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [error, setError] = useState('')

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.indexOf(id) === -1 ? [...prev, id] : prev.filter((x) => x !== id),
    )
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length === 0) {
      setError('Name is required')
      return
    }
    if (selected.length === 0) {
      setError('Pick at least one exercise')
      return
    }
    setError('')
    addRoutine({ name: name.trim(), exerciseIds: selected })
    setName('')
    setSelected([])
    navigate('routines')
  }

  return (
    <section data-testid="page-builder">
      <h1>Builder</h1>
      <form data-testid="builder-form" onSubmit={onSubmit}>
        <input
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <ul data-testid="pick-list">
          {library.map((ex) => (
            <li key={ex.id} data-testid={`pick-${ex.id}`} data-selected={selected.indexOf(ex.id) !== -1 ? 'true' : 'false'}>
              <span data-testid={`pick-${ex.id}-name`}>{ex.name}</span>
              <button
                type="button"
                data-testid={`toggle-${ex.id}`}
                onClick={() => toggle(ex.id)}
              >
                {selected.indexOf(ex.id) !== -1 ? 'Remove' : 'Add'}
              </button>
            </li>
          ))}
        </ul>
        <span data-testid="selected-count">{selected.length}</span>
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-routine">
          Save routine
        </button>
      </form>
    </section>
  )
}
