'use client'
import type { Quiz } from '../lib/types'

export default function QuizCard({
  quiz,
  onStart,
}: {
  quiz: Quiz
  onStart: (id: string) => void
}) {
  return (
    <li data-testid={`quiz-${quiz.id}`}>
      <span data-testid={`quiz-${quiz.id}-title`}>{quiz.title}</span>
      <span data-testid={`quiz-${quiz.id}-count`}>{quiz.questions.length}</span>
      <button data-testid={`start-${quiz.id}`} onClick={() => onStart(quiz.id)}>
        Start
      </button>
    </li>
  )
}
