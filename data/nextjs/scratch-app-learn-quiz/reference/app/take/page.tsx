'use client'
import { useApp } from '../../components/AppStateProvider'
import { useActiveQuiz } from '../../hooks/useQuiz'
import QuestionBlock from '../../components/QuestionBlock'

export default function TakePage() {
  const { answers, selectAnswer, submitQuiz } = useApp()
  const { quiz } = useActiveQuiz()

  if (!quiz) {
    return (
      <section data-testid="page-take">
        <p data-testid="no-active">No quiz selected.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-take">
      <h1 data-testid="take-title">{quiz.title}</h1>
      {quiz.questions.map((q) => (
        <QuestionBlock
          key={q.id}
          question={q}
          selectedId={answers[q.id]}
          onSelect={selectAnswer}
        />
      ))}
      <button data-testid="submit-quiz" onClick={submitQuiz}>
        Submit
      </button>
    </section>
  )
}
