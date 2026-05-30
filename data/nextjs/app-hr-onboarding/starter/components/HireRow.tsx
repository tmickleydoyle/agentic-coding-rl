'use client'
import type { Hire } from '../lib/types'

export default function HireRow({
  hire,
  percent,
  onOpen,
}: {
  hire: Hire
  percent: number
  onOpen: (id: string) => void
}) {
  // TODO: render <li data-testid="hire-<id>"> with name, role, percent, and an open-<id>
  // button.
  void percent
  void onOpen
  return <li data-testid={`hire-${hire.id}`} />
}
