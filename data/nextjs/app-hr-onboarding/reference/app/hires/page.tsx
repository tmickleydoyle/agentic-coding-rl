'use client'
import { useApp } from '../../components/AppStateProvider'
import { percentComplete } from '../../hooks/useOnboarding'
import HireRow from '../../components/HireRow'

export default function HiresPage() {
  const { hires, tasks, selectHire } = useApp()
  return (
    <section data-testid="page-hires">
      <h1>Hires</h1>
      <ul data-testid="hire-list">
        {hires.map((h) => (
          <HireRow
            key={h.id}
            hire={h}
            percent={percentComplete(tasks, h.id)}
            onOpen={selectHire}
          />
        ))}
      </ul>
    </section>
  )
}
