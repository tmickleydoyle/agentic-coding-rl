'use client'
import { useApp } from '../../components/AppStateProvider'
import CannedRow from '../../components/CannedRow'

export default function CannedPage() {
  const { canned, selectedChatId, sendReply } = useApp()

  const onUse = (text: string) => {
    if (selectedChatId) sendReply(selectedChatId, text)
  }

  return (
    <section data-testid="page-canned">
      <h1>Canned replies</h1>
      <ul data-testid="canned-list">
        {canned.map((k) => (
          <CannedRow key={k.id} canned={k} disabled={selectedChatId === null} onUse={onUse} />
        ))}
      </ul>
    </section>
  )
}
