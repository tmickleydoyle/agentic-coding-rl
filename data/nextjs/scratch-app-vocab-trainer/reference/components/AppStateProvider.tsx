'use client'
import React, { createContext, useContext, useState } from 'react';
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

const SEED_WORDS: Word[] = [
  { id: 'w1', term: 'Ephemeral', definition: 'Lasting for a very short time', category: 'adjective' },
  { id: 'w2', term: 'Ubiquitous', definition: 'Present everywhere', category: 'adjective' },
  { id: 'w3', term: 'Loquacious', definition: 'Tending to talk a great deal', category: 'adjective' },
  { id: 'w4', term: 'Pensive', definition: 'Engaged in deep thought', category: 'adjective' },
  { id: 'w5', term: 'Serene', definition: 'Calm and peaceful', category: 'adjective' },
];

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [words, setWords] = useState<Word[]>(SEED_WORDS);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [nextWid, setNextWid] = useState(6);
  const [nextRid, setNextRid] = useState(1);

  const navigate = (r: Route) => setRoute(r);

  const addWord = (term: string, definition: string, category: string): boolean => {
    if (!term.trim() || !definition.trim()) return false;
    if (words.find(w => w.term.toLowerCase() === term.toLowerCase())) return false;
    setWords(prev => [...prev, { id: `w${nextWid}`, term: term.trim(), definition: definition.trim(), category }]);
    setNextWid(n => n + 1);
    return true;
  };

  const deleteWord = (id: string) => setWords(prev => prev.filter(w => w.id !== id));

  const addQuizResult = (score: number, total: number) => {
    const result: QuizResult = { id: `r${nextRid}`, date: new Date().toISOString().split('T')[0], score, total };
    setQuizResults(prev => [...prev, result]);
    setNextRid(n => n + 1);
  };

  return (
    <AppContext.Provider value={{ route, words, quizResults, navigate, addWord, deleteWord, addQuizResult }}>
      {children}
    </AppContext.Provider>
  );
}
