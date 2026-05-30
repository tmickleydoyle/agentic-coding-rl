'use client'
import type { Card, Column as Col } from '../lib/types'

export default function Column({
  column,
  cards,
  overLimit,
  onForward,
  onBack,
  onArchive,
  onDelete,
}: {
  column: Col
  cards: Card[]
  overLimit: boolean
  onForward: (id: string) => void
  onBack: (id: string) => void
  onArchive: (id: string) => void
  onDelete: (id: string) => void
}) {
  // TODO: render <section data-testid="column-<col>"> with count-<col>, an optional
  // warning-<col> when overLimit, and a list of CardItems.
  void cards
  void overLimit
  void onForward
  void onBack
  void onArchive
  void onDelete
  return <section data-testid={`column-${column}`} />
}
