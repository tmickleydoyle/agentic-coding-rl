'use client'
import type { Gig } from '../lib/types'

export default function GigCard(_props: {
  gig: Gig
  onView: (id: string) => void
}) {
  // TODO: render a gig row with title/category/price/average-rating and a view-<id> button.
  return <li data-testid={`gig-${_props.gig.id}`} />
}
