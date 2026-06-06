'use client'
import React from 'react';
import { AppStateProvider } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';

export default function App() {
  return (
    <AppStateProvider>
      <div data-testid="app" data-theme="light">
        <NavBar />
        <main data-testid="home-page">
          <h1>Vocab Trainer</h1>
          <p data-testid="word-count">0 words in library</p>
          <p data-testid="quiz-count">0 quiz(zes) completed</p>
          <button data-testid="start-quiz-btn">Start Quiz</button>
        </main>
      </div>
    </AppStateProvider>
  );
}
