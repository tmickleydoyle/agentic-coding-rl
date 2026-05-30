'use client'
import type { Card } from '../lib/types'

export default function CardTile({
  card,
  onPick,
}: {
  card: Card
  onPick: (id: string) => void
}) {
  // TODO: show the symbol when face up or matched; clicking calls onPick(card.id).
  void onPick
  return <button data-testid={`card-${card.id}`} />
}
