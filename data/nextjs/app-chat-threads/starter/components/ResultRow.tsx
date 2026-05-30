'use client'
import type { Message } from '../lib/types'

export default function ResultRow({
  message,
  onOpen,
}: {
  message: Message
  onOpen: (id: string) => void
}) {
  // TODO: render the search result row with text and an open-result- button.
  void onOpen
  return <li data-testid={`result-${message.id}`} />
}
