'use client';
import React from 'react';
export function QuizzesPage() {
  return <div><h1>Quizzes</h1>
    <input data-testid="quiz-title" /><input data-testid="quiz-description" />
    <button data-testid="add-quiz-btn">Add Quiz</button><ul></ul>
  </div>;
}
