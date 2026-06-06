'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { quizzes, questions, navigate } = useApp();
  return (
    <div style={{ padding: 24 }}>
      <h1>Quiz Maker</h1>
      <p>Quizzes: <span data-testid="quiz-count">{quizzes.length}</span></p>
      <p>Questions: <span data-testid="question-count">{questions.length}</span></p>
      <button onClick={() => navigate('quizzes')}>Start Quiz</button>
    </div>
  );
}
