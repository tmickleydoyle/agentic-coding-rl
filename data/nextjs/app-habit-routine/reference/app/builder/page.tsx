'use client'
import { useState } from 'react'
import { useRoutine } from '../../components/RoutineProvider'
import type { RoutineKind } from '../../lib/types'

export default function BuilderPage() {
  const { addRoutine, navigate } = useRoutine()
  const [name, setName] = useState('')
  const [kind, setKind] = useState<RoutineKind>('morning')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length === 0) {
      setError('Name is required')
      return
    }
    setError('')
    addRoutine({ name, kind })
    setName('')
    setKind('morning')
    navigate('routines')
  }

  return (
    <section data-testid="page-builder">
      <h1>Routine Builder</h1>
      <form data-testid="routine-form" onSubmit={onSubmit}>
        <input
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          data-testid="kind-select"
          value={kind}
          onChange={(e) => setKind(e.target.value as RoutineKind)}
        >
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
        </select>
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-routine">
          Add routine
        </button>
      </form>
    </section>
  )
}
