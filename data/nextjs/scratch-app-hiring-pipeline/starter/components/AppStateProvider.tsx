import React, { createContext, useContext } from "react";
import { Job, Candidate, Interview } from "../lib/types";

interface AppContextValue {
  route: string;
  navigate: (r: string) => void;
  jobs: Job[];
  candidates: Candidate[];
  interviews: Interview[];
  setJobs: (v: Job[]) => void;
  setCandidates: (v: Candidate[]) => void;
  setInterviews: (v: Interview[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "/",
  navigate: () => {},
  jobs: [],
  candidates: [],
  interviews: [],
  setJobs: () => {},
  setCandidates: () => {},
  setInterviews: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: "/", navigate: () => {}, jobs: [], candidates: [], interviews: [], setJobs: () => {}, setCandidates: () => {}, setInterviews: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
