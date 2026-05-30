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
  // TODO: render the prompt and one choice-<qid>-<cid> button per choice, marking the
  // selected one with aria-pressed.
  void selectedId
  void onSelect
  return <div data-testid={`question-${question.id}`} />
}
