'use client'
import { useApp } from '../../components/AppStateProvider'
import { useActiveQuiz } from '../../hooks/useQuiz'

export default function ReviewPage() {
  const { submitted, answers } = useApp()
  const { quiz } = useActiveQuiz()

  if (!submitted || !quiz) {
    return (
      <section data-testid="page-review">
        <p data-testid="no-review">Nothing to review.</p>
      </section>
    )
  }

  const choiceText = (qid: string, cid: string | undefined): string => {
    if (!cid) return '—'
    const q = quiz.questions.find((qq) => qq.id === qid)
    return q?.choices.find((c) => c.id === cid)?.text ?? '—'
  }

  return (
    <section data-testid="page-review">
      <h1>Review</h1>
      {quiz.questions.map((q) => {
        const chosen = answers[q.id]
        const correct = chosen === q.answerId
        return (
          <div
            key={q.id}
            data-testid={`review-${q.id}`}
            data-correct={correct ? 'true' : 'false'}
          >
            <p data-testid={`review-${q.id}-prompt`}>{q.prompt}</p>
            <span data-testid={`review-${q.id}-chosen`}>{choiceText(q.id, chosen)}</span>
            <span data-testid={`review-${q.id}-correct`}>
              {choiceText(q.id, q.answerId)}
            </span>
          </div>
        )
      })}
    </section>
  )
}
