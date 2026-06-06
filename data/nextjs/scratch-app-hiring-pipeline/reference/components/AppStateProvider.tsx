import React, { createContext, useContext, useState, useCallback } from "react";
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
  const [route, setRoute] = useState("/");
  const [jobs, setJobs] = useState<Job[]>([
    { id: "1", title: "Senior Engineer", department: "Engineering", status: "Open" },
    { id: "2", title: "Product Designer", department: "Design", status: "Open" },
    { id: "3", title: "Growth Marketer", department: "Marketing", status: "Closed" },
  ]);
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: "1", name: "Alice Smith", email: "alice@mail.com", jobId: "1", stage: "Technical" },
    { id: "2", name: "Bob Jones", email: "bob@mail.com", jobId: "1", stage: "Phone Screen" },
    { id: "3", name: "Carol Lee", email: "carol@mail.com", jobId: "2", stage: "Applied" },
    { id: "4", name: "Dan Park", email: "dan@mail.com", jobId: "1", stage: "Hired" },
  ]);
  const [interviews, setInterviews] = useState<Interview[]>([
    { id: "1", candidateId: "1", type: "Technical", scheduledDate: "2024-02-10", notes: "Strong performance", result: "Pass" },
  ]);
  const navigate = useCallback((r: string) => setRoute(r), []);

  return (
    <AppContext.Provider value={{ route, navigate, jobs, candidates, interviews, setJobs, setCandidates, setInterviews }}>
      {children}
    </AppContext.Provider>
  );
}
