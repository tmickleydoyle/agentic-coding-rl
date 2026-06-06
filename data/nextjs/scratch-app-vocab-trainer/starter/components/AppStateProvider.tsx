'use client'
import React, { createContext, useContext } from 'react';
import { Word, QuizResult, Route } from '../lib/types';

interface AppState {
  route: Route;
  words: Word[];
  quizResults: QuizResult[];
  navigate: (r: Route) => void;
  addWord: (term: string, definition: string, category: string) => boolean;
  deleteWord: (id: string) => void;
  addQuizResult: (score: number, total: number) => void;
}

const AppContext = createContext<AppState>({
  route: 'home', words: [], quizResults: [],
  navigate: () => {}, addWord: () => false, deleteWord: () => {}, addQuizResult: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{
      route: 'home', words: [], quizResults: [],
      navigate: () => {}, addWord: () => false, deleteWord: () => {}, addQuizResult: () => {},
    }}>
      {children}
    </AppContext.Provider>
  );
}
