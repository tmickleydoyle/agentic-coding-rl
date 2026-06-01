'use client'
import { useApp } from '../../components/AppStateProvider'
import Choice from '../../components/Choice'
import { currentQuestion } from '../../lib/quiz'

export default function PlayPage() {
  const { quiz, choose } = useApp()
  const q = currentQuestion(quiz)
  return (
    <section data-testid="page-play">
      <h1>Quiz</h1>
      <span data-testid="score">{quiz.score}</span>
      {q ? (
        <div>
          <span data-testid="progress">
            {quiz.index + 1} / {quiz.questionIds.length}
          </span>
          <p data-testid="prompt">{q.prompt}</p>
          <div data-testid="choices">
            {q.choices.map((c, i) => (
              <Choice key={i} index={i} label={c} onChoose={choose} />
            ))}
          </div>
        </div>
      ) : (
        <p data-testid="play-done">Quiz complete.</p>
      )}
    </section>
  )
}
