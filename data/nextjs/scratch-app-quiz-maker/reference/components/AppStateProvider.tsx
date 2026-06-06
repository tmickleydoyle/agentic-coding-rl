'use client';
import React, { createContext, useContext, useState } from 'react';
import type { Quiz, Question, QuizAttempt, Route } from '../lib/types';

interface AppState {
  route: Route;
  quizzes: Quiz[];
  questions: Question[];
  lastAttempt: QuizAttempt | null;
  navigate: (r: Route) => void;
  addQuiz: (data: Omit<Quiz, 'id'>) => void;
  deleteQuiz: (id: string) => void;
  addQuestion: (data: Omit<Question, 'id'>) => void;
  saveAttempt: (attempt: QuizAttempt) => void;
}

const AppContext = createContext<AppState>({
  route: 'home', quizzes: [], questions: [], lastAttempt: null,
  navigate: () => {}, addQuiz: () => {}, deleteQuiz: () => {}, addQuestion: () => {}, saveAttempt: () => {},
});

export function useApp() { return useContext(AppContext); }

const seedQuizzes: Quiz[] = [
  { id: 'q1', title: 'General Knowledge', description: 'Test your general knowledge' },
  { id: 'q2', title: 'Science Basics', description: 'Basic science questions' },
];
const seedQuestions: Question[] = [
  { id: 'qu1', quizId: 'q1', text: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin', 'Rome'], correctIndex: 1 },
  { id: 'qu2', quizId: 'q1', text: 'How many continents are there?', options: ['5', '6', '7', '8'], correctIndex: 2 },
  { id: 'qu3', quizId: 'q2', text: 'What is H2O?', options: ['Gold', 'Water', 'Salt', 'Iron'], correctIndex: 1 },
];

let qid = 3; let quid = 4;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [quizzes, setQuizzes] = useState<Quiz[]>(seedQuizzes.map(q => ({ ...q })));
  const [questions, setQuestions] = useState<Question[]>(seedQuestions.map(q => ({ ...q, options: [...q.options] as [string, string, string, string] })));
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);

  function navigate(r: Route) { setRoute(r); }
  function addQuiz(data: Omit<Quiz, 'id'>) { setQuizzes(prev => [...prev, { id: `q${qid++}`, ...data }]); }
  function deleteQuiz(id: string) {
    setQuizzes(prev => prev.filter(q => q.id !== id));
    setQuestions(prev => prev.filter(q => q.quizId !== id));
  }
  function addQuestion(data: Omit<Question, 'id'>) { setQuestions(prev => [...prev, { id: `qu${quid++}`, ...data }]); }
  function saveAttempt(attempt: QuizAttempt) { setLastAttempt({ ...attempt, answers: [...attempt.answers] }); }

  return (
    <AppContext.Provider value={{ route, quizzes, questions, lastAttempt, navigate, addQuiz, deleteQuiz, addQuestion, saveAttempt }}>
      {children}
    </AppContext.Provider>
  );
}
