'use client';
import React from 'react';
export function CreatePage() {
  return <div><h1>Create Questions</h1>
    <select data-testid="create-quiz-select"></select>
    <input data-testid="question-text" /><input data-testid="option-a" /><input data-testid="option-b" />
    <input data-testid="option-c" /><input data-testid="option-d" />
    <select data-testid="correct-answer"></select>
    <button data-testid="add-question-btn">Add Question</button><ul></ul>
  </div>;
}
