import { Competition, CompResult } from "./types";

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

let competitions: Competition[] = SEED.map((c) => ({ ...c, results: c.results.map((r) => ({ ...r })) }));
let cCounter = 3;
let rCounter = 4;

export function __reset() {
  competitions = SEED.map((c) => ({ ...c, results: c.results.map((r) => ({ ...r })) }));
  cCounter = 3;
  rCounter = 4;
}

export function getCompetitions(): Competition[] { return competitions; }

export function addCompetition(name: string, sport: string, date: string, location: string): Competition | null {
  if (!name.trim()) return null;
  const c: Competition = { id: `c${cCounter++}`, name: name.trim(), sport, date, location, results: [] };
  competitions.push(c);
  return c;
}

export function deleteCompetition(id: string): void {
  competitions = competitions.filter((c) => c.id !== id);
}

export function addResult(competitionId: string, athleteName: string, place: number, score: string, notes: string): CompResult | null {
  if (!athleteName.trim() || place < 1) return null;
  const c = competitions.find((x) => x.id === competitionId);
  if (!c) return null;
  const r: CompResult = { id: `r${rCounter++}`, athleteName: athleteName.trim(), place, score, notes };
  c.results.push(r);
  return r;
}
