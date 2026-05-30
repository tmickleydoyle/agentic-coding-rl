'use client'
import type { Feedback } from '../lib/types'

export default function FeedbackItem(_props: { item: Feedback; onOpen: (id: string) => void }) {
  // TODO: render fb-<id> with data-status/data-sentiment and -author/-category/-sentiment/
  // -status spans + an open-<id> button.
  return <li data-testid={`fb-${_props.item.id}`} />
}
