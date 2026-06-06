'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { QuizAttempt } from '../../lib/types';

export function QuizzesPage() {
  const { quizzes, questions, addQuiz, deleteQuiz, navigate, saveAttempt } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [takingQuizId, setTakingQuizId] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  function handleAdd() {
    if (!title.trim()) { setError('Title required'); return; }
    setError('');
    addQuiz({ title: title.trim(), description: description.trim() });
    setTitle(''); setDescription('');
  }

  function startQuiz(quizId: string) {
    setTakingQuizId(quizId);
    setCurrentQ(0);
    setAnswers([]);
    setSelectedAnswer(null);
  }

  const quizQuestions = takingQuizId ? questions.filter(q => q.quizId === takingQuizId) : [];

  function handleNext() {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers, selectedAnswer];
    if (currentQ + 1 >= quizQuestions.length) {
      // Submit
      const score = newAnswers.filter((a, i) => a === quizQuestions[i].correctIndex).length;
      const attempt: QuizAttempt = { quizId: takingQuizId!, answers: newAnswers, score, total: quizQuestions.length };
      saveAttempt(attempt);
      setTakingQuizId(null);
      navigate('results');
    } else {
      setAnswers(newAnswers);
      setCurrentQ(prev => prev + 1);
      setSelectedAnswer(null);
    }
  }

  if (takingQuizId) {
    const q = quizQuestions[currentQ];
    const isLast = currentQ + 1 >= quizQuestions.length;
    return (
      <div style={{ padding: 24 }}>
        <h1>Question {currentQ + 1}/{quizQuestions.length}</h1>
        <p>{q.text}</p>
        {q.options.map((opt, i) => (
          <div key={i}>
            <label>
              <input type="radio" data-testid={`answer-option-${i}`} name="answer" checked={selectedAnswer === i} onChange={() => setSelectedAnswer(i)} />
              {opt}
            </label>
          </div>
        ))}
        {isLast
          ? <button data-testid="submit-quiz-btn" onClick={handleNext} disabled={selectedAnswer === null}>Submit</button>
          : <button data-testid="next-question-btn" onClick={handleNext} disabled={selectedAnswer === null}>Next</button>
        }
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Quizzes</h1>
      {error && <div data-testid="quiz-error" style={{ color: 'red' }}>{error}</div>}
      <div>
        <input data-testid="quiz-title" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input data-testid="quiz-description" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button data-testid="add-quiz-btn" onClick={handleAdd}>Add Quiz</button>
      </div>
      <ul>
        {quizzes.map(q => (
          <li key={q.id} data-testid={`quiz-row-${q.id}`}>
            {q.title}
            <button data-testid={`delete-quiz-${q.id}`} onClick={() => deleteQuiz(q.id)}>Delete</button>
            <button data-testid={`start-quiz-${q.id}`} onClick={() => startQuiz(q.id)}
              disabled={questions.filter(qu => qu.quizId === q.id).length === 0}>
              Take Quiz
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
