'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { useRentals } from '../../hooks/useRentals'

export default function UnitDetailPage() {
  const { units, currentUnitId, addApplication } = useApp()
  const { applicationsFor } = useRentals()
  const [applicant, setApplicant] = useState('')
  const [error, setError] = useState('')

  const current = units.find((u) => u.id === currentUnitId)
  if (!current) {
    return (
      <section data-testid="page-unit-detail">
        <p data-testid="no-unit">No unit selected.</p>
      </section>
    )
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (applicant.trim().length === 0) {
      setError('Applicant is required')
      return
    }
    setError('')
    addApplication({ unitId: current.id, applicant: applicant.trim() })
    setApplicant('')
  }

  return (
    <section data-testid="page-unit-detail">
      <h1 data-testid="detail-label">{current.label}</h1>
      <p data-testid="detail-rent">{current.rent}</p>
      <p data-testid="detail-occupied">{current.occupied ? 'Occupied' : 'Vacant'}</p>
      <ul data-testid="unit-app-list">
        {applicationsFor(current.id).map((a) => (
          <li key={a.id} data-testid={`unit-app-${a.id}`} data-status={a.status}>
            {a.applicant}
          </li>
        ))}
      </ul>
      <form data-testid="apply-form" onSubmit={onSubmit}>
        <label htmlFor="applicant">Applicant</label>
        <input
          id="applicant"
          data-testid="applicant-input"
          value={applicant}
          onChange={(e) => setApplicant(e.target.value)}
        />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-application">
          Apply
        </button>
      </form>
    </section>
  )
}
