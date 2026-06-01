'use client'
import { useApp } from '../../components/AppStateProvider'
import { useAppointments } from '../../hooks/useAppointments'
import ProviderCard from '../../components/ProviderCard'

export default function ProvidersPage() {
  const { providers, selectProvider } = useApp()
  const { freeSlots } = useAppointments()
  return (
    <section data-testid="page-providers">
      <h1>Providers</h1>
      <ul data-testid="providers-list">
        {providers.map((p) => (
          <ProviderCard
            key={p.id}
            provider={p}
            openCount={freeSlots(p.id).length}
            onSelect={selectProvider}
          />
        ))}
      </ul>
    </section>
  )
}
