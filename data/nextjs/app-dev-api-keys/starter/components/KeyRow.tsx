'use client'
import type { ApiKey } from '../lib/types'

export default function KeyRow({
  apiKey,
  onView,
}: {
  apiKey: ApiKey
  onView: (id: string) => void
}) {
  // TODO: render <li data-testid="key-<id>" data-active> with name, masked secret
  // (maskSecret), and a view-<id> button that calls onView(apiKey.id).
  void onView
  return <li data-testid={`key-${apiKey.id}`} />
}
