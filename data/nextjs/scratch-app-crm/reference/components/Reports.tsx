'use client'
import { useCrm } from '../hooks/useCrm'
import type { Stage } from '../lib/types'

export function Reports() {
  const { contacts } = useCrm()
  const total = contacts.length
  const count = (s: Stage) => contacts.filter((c) => c.stage === s).length
  const rate = total === 0 ? 0 : Math.round((count('won') / total) * 100)
  const pipelineValue = contacts.reduce((sum, c) => sum + c.amount, 0)
  const wonValue = contacts.filter((c) => c.stage === 'won').reduce((sum, c) => sum + c.amount, 0)
  return (
    <section aria-label="Reports view">
      <h1>Reports</h1>
      <p>{`Total contacts: ${total}`}</p>
      <p>{`Lead: ${count('lead')}`}</p>
      <p>{`Qualified: ${count('qualified')}`}</p>
      <p>{`Won: ${count('won')}`}</p>
      <p>{`Win rate: ${rate}%`}</p>
      <p>{`Pipeline value: $${pipelineValue}`}</p>
      <p>{`Won value: $${wonValue}`}</p>
    </section>
  )
}
