'use client'
import { useApp } from '../../components/AppStateProvider'
import KeyRow from '../../components/KeyRow'

export default function KeysPage() {
  const { keys, selectKey } = useApp()
  return (
    <section data-testid="page-keys">
      <h1>API Keys</h1>
      <ul data-testid="key-list">
        {keys.map((k) => (
          <KeyRow key={k.id} apiKey={k} onView={selectKey} />
        ))}
      </ul>
    </section>
  )
}
