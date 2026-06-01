'use client'
import type { Question } from '../lib/types'

export default function QuestionBlock({
  question,
  selectedId,
  onSelect,
}: {
  question: Question
  selectedId: string | undefined
  onSelect: (questionId: string, choiceId: string) => void
}) {
  return (
    <div data-testid={`question-${question.id}`}>
      <p data-testid={`question-${question.id}-prompt`}>{question.prompt}</p>
      {question.choices.map((c) => (
        <button
          key={c.id}
          data-testid={`choice-${question.id}-${c.id}`}
          aria-pressed={selectedId === c.id ? 'true' : undefined}
          onClick={() => onSelect(question.id, c.id)}
        >
          {c.text}
        </button>
      ))}
    </div>
  )
}
