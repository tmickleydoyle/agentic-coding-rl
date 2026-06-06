'use client';
import React, { createContext, useContext } from 'react';
import type { Quiz, Question, QuizAttempt, Route } from '../lib/types';
interface AppState { route: Route; quizzes: Quiz[]; questions: Question[]; lastAttempt: QuizAttempt | null; navigate: (r: Route) => void; addQuiz: (d: Omit<Quiz, 'id'>) => void; deleteQuiz: (id: string) => void; addQuestion: (d: Omit<Question, 'id'>) => void; saveAttempt: (a: QuizAttempt) => void; }
const AppContext = createContext<AppState>({ route: 'home', quizzes: [], questions: [], lastAttempt: null, navigate: () => {}, addQuiz: () => {}, deleteQuiz: () => {}, addQuestion: () => {}, saveAttempt: () => {} });
export function useApp() { return useContext(AppContext); }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <AppContext.Provider value={{ route: 'home', quizzes: [], questions: [], lastAttempt: null, navigate: () => {}, addQuiz: () => {}, deleteQuiz: () => {}, addQuestion: () => {}, saveAttempt: () => {} }}>{children}</AppContext.Provider>;
}
