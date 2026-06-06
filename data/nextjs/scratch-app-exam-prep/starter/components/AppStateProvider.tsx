import React, { createContext, useContext, useState } from "react";
import type { Route, Exam, Question, PracticeResult } from "../lib/types";

interface AppContextValue {
  route: Route;
  setRoute: (r: Route) => void;
  exams: Exam[];
  setExams: (e: Exam[]) => void;
  questions: Question[];
  setQuestions: (q: Question[]) => void;
  results: PracticeResult[];
  setResults: (r: PracticeResult[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "home",
  setRoute: () => {},
  exams: [],
  setExams: () => {},
  questions: [],
  setQuestions: () => {},
  results: [],
  setResults: () => {},
});

export function useApp(): AppContextValue { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("home");
  const [exams, setExams] = useState<Exam[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<PracticeResult[]>([]);
  return (
    <AppContext.Provider value={{ route, setRoute, exams, setExams, questions, setQuestions, results, setResults }}>
      {children}
    </AppContext.Provider>
  );
}
