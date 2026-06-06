'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { words, quizResults, navigate } = useApp();
  return (
    <main data-testid="home-page">
      <h1>Vocab Trainer</h1>
      <p data-testid="word-count">{words.length} words in library</p>
      <p data-testid="quiz-count">{quizResults.length} quiz(zes) completed</p>
      <button data-testid="start-quiz-btn" onClick={() => navigate('quiz')}>Start Quiz</button>
    </main>
  );
}
