'use client'
import { useCrm } from '../hooks/useCrm'
import type { Stage } from '../lib/types'

const COLUMNS: [Stage, string][] = [
  ['lead', 'Lead'],
  ['qualified', 'Qualified'],
  ['won', 'Won'],
]

export function Pipeline() {
  const { contacts, moveStage, showWon } = useCrm()
  return (
    <section aria-label="Pipeline view">
      <h1>Pipeline</h1>
      {COLUMNS.map(([stage, label]) => {
        const count = contacts.filter((c) => c.stage === stage).length
        const cards = contacts.filter((c) => c.stage === stage && (showWon || stage !== 'won'))
        return (
          <section key={stage} aria-label={label}>
            <h2>{`${label} (${count})`}</h2>
            <ul>
              {cards.map((c) => (
                <li key={c.id}>
                  <span>{c.name}</span>
                  <button
                    aria-label={`Regress ${c.name}`}
                    disabled={stage === 'lead'}
                    onClick={() => moveStage(c.id, -1)}
                  >
                    Regress
                  </button>
                  <button
                    aria-label={`Advance ${c.name}`}
                    disabled={stage === 'won'}
                    onClick={() => moveStage(c.id, 1)}
                  >
                    Advance
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </section>
  )
}
