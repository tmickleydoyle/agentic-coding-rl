'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { isOnTrack } from '../../hooks/useKpis'

export default function TargetsPage() {
  const { kpis, setTarget } = useApp()
  const [edits, setEdits] = useState<Record<string, string>>({})

  const onSave = (id: string) => {
    const raw = edits[id]
    if (raw === undefined) return
    const n = Number(raw)
    if (raw.trim().length === 0 || Number.isNaN(n)) return
    setTarget(id, n)
  }

  return (
    <section data-testid="page-targets">
      <h1>Targets</h1>
      <ul data-testid="target-list">
        {kpis.map((k) => (
          <li key={k.id} data-testid={`target-${k.id}`} data-ontrack={isOnTrack(k) ? 'true' : 'false'}>
            <span data-testid={`target-${k.id}-name`}>{k.name}</span>
            <span data-testid={`target-${k.id}-value`}>{k.target}</span>
            <input
              data-testid={`target-${k.id}-input`}
              value={edits[k.id] ?? ''}
              onChange={(e) => setEdits((prev) => ({ ...prev, [k.id]: e.target.value }))}
            />
            <button data-testid={`target-${k.id}-save`} onClick={() => onSave(k.id)}>
              Save
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
