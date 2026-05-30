'use client'
import type { Quiz } from '../lib/types'

export default function QuizCard({
  quiz,
  onStart,
}: {
  quiz: Quiz
  onStart: (id: string) => void
}) {
  // TODO: render quiz-<id> row with title, question count, and a start-<id> button.
  void onStart
  return <li data-testid={`quiz-${quiz.id}`} />
}
