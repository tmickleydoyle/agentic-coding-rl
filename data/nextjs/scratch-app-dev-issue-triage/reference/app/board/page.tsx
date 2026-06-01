'use client'
import { useApp } from '../../components/AppStateProvider'
import type { Issue, IssueStatus } from '../../lib/types'

const COLUMNS: IssueStatus[] = ['open', 'in-progress', 'closed']

function nextStatus(status: IssueStatus): IssueStatus {
  if (status === 'open') return 'in-progress'
  if (status === 'in-progress') return 'closed'
  return 'closed'
}

export default function BoardPage() {
  const { issues, setStatus } = useApp()

  const column = (status: IssueStatus): Issue[] => issues.filter((i) => i.status === status)

  return (
    <section data-testid="page-board">
      <h1>Board</h1>
      {COLUMNS.map((status) => {
        const cards = column(status)
        return (
          <div key={status} data-testid={`col-${status}`}>
            <h2 data-testid={`col-${status}-count`}>{cards.length}</h2>
            {cards.map((i) => (
              <div key={i.id} data-testid={`card-${i.id}`} data-status={i.status}>
                <span data-testid={`card-${i.id}-title`}>{i.title}</span>
                <button
                  data-testid={`next-${i.id}`}
                  onClick={() => setStatus(i.id, nextStatus(i.status))}
                >
                  Advance
                </button>
              </div>
            ))}
          </div>
        )
      })}
    </section>
  )
}
