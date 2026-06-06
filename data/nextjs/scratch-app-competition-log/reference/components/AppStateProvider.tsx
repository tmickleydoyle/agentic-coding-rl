import React, { createContext, useContext, useState } from "react";
import { Competition, CompResult, Route } from "../lib/types";

interface AppCtx {
  route: Route;
  setRoute: (r: Route) => void;
  competitions: Competition[];
  activeCompetitionId: string | null;
  setActiveCompetitionId: (id: string | null) => void;
  addCompetition: (name: string, sport: string, date: string, location: string) => void;
  deleteCompetition: (id: string) => void;
  addResult: (competitionId: string, athleteName: string, place: number, score: string, notes: string) => void;
}

const Ctx = createContext<AppCtx>({
  route: "competitions",
  setRoute: () => {},
  competitions: [],
  activeCompetitionId: null,
  setActiveCompetitionId: () => {},
  addCompetition: () => {},
  deleteCompetition: () => {},
  addResult: () => {},
});

export function useApp() { return useContext(Ctx); }

const SEED: Competition[] = [
  {
    id: "c1",
    name: "Regional Championship",
    sport: "Swimming",
    date: "2024-05-20",
    location: "City Pool",
    results: [
      { id: "r1", athleteName: "Alice", place: 1, score: "58.2s", notes: "" },
      { id: "r2", athleteName: "Bob", place: 2, score: "59.1s", notes: "" },
    ],
  },
  {
    id: "c2",
    name: "State Open",
    sport: "Swimming",
    date: "2024-07-14",
    location: "State Aquatic Center",
    results: [{ id: "r3", athleteName: "Alice", place: 1, score: "57.8s", notes: "New PR" }],
  },
];

let uid_c = 3;
let uid_r = 4;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("competitions");
  const [competitions, setCompetitions] = useState<Competition[]>(SEED.map((c) => ({ ...c, results: c.results.map((r) => ({ ...r })) })));
  const [activeCompetitionId, setActiveCompetitionId] = useState<string | null>(null);

  function addCompetition(name: string, sport: string, date: string, location: string) {
    if (!name.trim()) return;
    const c: Competition = { id: `c${uid_c++}`, name: name.trim(), sport, date, location, results: [] };
    setCompetitions((prev) => [...prev, c]);
  }

  function deleteCompetition(id: string) {
    setCompetitions((prev) => prev.filter((c) => c.id !== id));
    setActiveCompetitionId((prev) => prev === id ? null : prev);
  }

  function addResult(competitionId: string, athleteName: string, place: number, score: string, notes: string) {
    if (!athleteName.trim() || place < 1) return;
    const r: CompResult = { id: `r${uid_r++}`, athleteName: athleteName.trim(), place, score, notes };
    setCompetitions((prev) => prev.map((c) => c.id === competitionId ? { ...c, results: [...c.results, r] } : c));
  }

  return (
    <Ctx.Provider value={{ route, setRoute, competitions, activeCompetitionId, setActiveCompetitionId, addCompetition, deleteCompetition, addResult }}>
      {children}
    </Ctx.Provider>
  );
}
