'use client'
import type { Card, Grade } from '../lib/types'

export default function CardFace({
  card,
  showBack,
  onShowBack,
  onGrade,
}: {
  card: Card
  showBack: boolean
  onShowBack: () => void
  onGrade: (grade: Grade) => void
}) {
  // TODO: render current-card with card-front, an optional card-back (when showBack), a
  // show-back button, and grade-easy / grade-hard buttons.
  void card
  void showBack
  void onShowBack
  void onGrade
  return <div data-testid="current-card" />
}
