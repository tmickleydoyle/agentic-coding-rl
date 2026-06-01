'use client'
import { useApp } from '../../components/AppStateProvider'

export default function ApprovalsPage() {
  const { entries, projects, submitEntry, submitAll } = useApp()
  const projectName = (id: string): string => projects.find((p) => p.id === id)?.name ?? 'Unknown'
  const submitted = entries.filter((e) => e.submitted).length
  const pending = entries.length - submitted

  return (
    <section data-testid="page-approvals">
      <h1>Approvals</h1>
      <span data-testid="submitted-count">{submitted}</span>
      <span data-testid="pending-count">{pending}</span>
      <button data-testid="submit-all" onClick={() => submitAll()}>
        Submit all
      </button>
      <ul data-testid="approvals-list">
        {entries.map((e) => (
          <li key={e.id} data-testid={`approval-${e.id}`} data-submitted={e.submitted ? 'true' : 'false'}>
            <span data-testid={`approval-${e.id}-project`}>{projectName(e.projectId)}</span>
            <span data-testid={`approval-${e.id}-hours`}>{e.hours}</span>
            {!e.submitted ? (
              <button data-testid={`submit-${e.id}`} onClick={() => submitEntry(e.id)}>
                Submit
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
