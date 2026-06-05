'use client'
import { useFlags } from '../../components/AppStateProvider'

export default function AuditPage() {
  const { audit, flags } = useFlags()
  const ordered = audit.slice().sort((a, b) => b.createdAt - a.createdAt)
  const flagKey = (flagId: string): string => flags.find((f) => f.id === flagId)?.key ?? flagId

  return (
    <section data-testid="page-audit">
      <h1>Audit log</h1>
      {ordered.length === 0 ? (
        <p data-testid="audit-empty">No audit entries yet.</p>
      ) : (
        <ul data-testid="audit-list">
          {ordered.map((a) => (
            <li key={a.id} data-testid={`audit-${a.id}`}>
              <span data-testid={`audit-${a.id}-action`}>{a.action}</span>
              <span data-testid={`audit-${a.id}-flag`}>{flagKey(a.flagId)}</span>
              {a.env ? <span data-testid={`audit-${a.id}-env`}>{a.env}</span> : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
