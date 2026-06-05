'use client'
import { useApp } from '../../components/AppStateProvider'
import QuizCard from '../../components/QuizCard'

export default function QuizzesPage() {
  const { quizzes, startQuiz } = useApp()
  return (
    <section data-testid="page-quizzes">
      <h1>Quizzes</h1>
      <ul data-testid="quiz-list">
        {quizzes.map((q) => (
          <QuizCard key={q.id} quiz={q} onStart={startQuiz} />
        ))}
      </ul>
    </section>
  )
}
