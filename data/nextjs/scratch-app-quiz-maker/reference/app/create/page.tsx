'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function CreatePage() {
  const { quizzes, questions, addQuestion } = useApp();
  const [quizId, setQuizId] = useState(quizzes[0]?.id ?? '');
  const [text, setText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correct, setCorrect] = useState('0');
  const [error, setError] = useState('');

  function handleAdd() {
    if (!text.trim() || !optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) {
      setError('All fields required'); return;
    }
    setError('');
    addQuestion({ quizId, text: text.trim(), options: [optA.trim(), optB.trim(), optC.trim(), optD.trim()], correctIndex: parseInt(correct) });
    setText(''); setOptA(''); setOptB(''); setOptC(''); setOptD('');
  }

  const filtered = questions.filter(q => q.quizId === quizId);

  return (
    <div style={{ padding: 24 }}>
      <h1>Create Questions</h1>
      <select data-testid="create-quiz-select" value={quizId} onChange={e => setQuizId(e.target.value)}>
        {quizzes.map(q => <option key={q.id} value={q.id}>{q.title}</option>)}
      </select>
      {error && <div data-testid="question-error" style={{ color: 'red' }}>{error}</div>}
      <div>
        <input data-testid="question-text" placeholder="Question" value={text} onChange={e => setText(e.target.value)} />
        <input data-testid="option-a" placeholder="Option A" value={optA} onChange={e => setOptA(e.target.value)} />
        <input data-testid="option-b" placeholder="Option B" value={optB} onChange={e => setOptB(e.target.value)} />
        <input data-testid="option-c" placeholder="Option C" value={optC} onChange={e => setOptC(e.target.value)} />
        <input data-testid="option-d" placeholder="Option D" value={optD} onChange={e => setOptD(e.target.value)} />
        <select data-testid="correct-answer" value={correct} onChange={e => setCorrect(e.target.value)}>
          <option value="0">A</option>
          <option value="1">B</option>
          <option value="2">C</option>
          <option value="3">D</option>
        </select>
        <button data-testid="add-question-btn" onClick={handleAdd}>Add Question</button>
      </div>
      <ul>
        {filtered.map(q => <li key={q.id} data-testid={`question-row-${q.id}`}>{q.text}</li>)}
      </ul>
    </div>
  );
}
