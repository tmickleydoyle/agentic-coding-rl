import { RefMatch, Flag, FlagType } from "./types";

const seedMatches: RefMatch[] = [
  { id: 1, homeTeam: "FC United", awayTeam: "City FC", date: "2024-04-10", venue: "Main Arena" },
  { id: 2, homeTeam: "Hawks FC", awayTeam: "Rovers", date: "2024-04-12", venue: "East Stadium" },
];

const seedFlags: Flag[] = [
  { id: 1, matchId: 1, minute: 23, type: "yellow", note: "Dangerous tackle" },
  { id: 2, matchId: 1, minute: 67, type: "red", note: "Second yellow" },
  { id: 3, matchId: 2, minute: 5, type: "foul", note: "Hand ball" },
];

let matches: RefMatch[] = seedMatches.map((m) => ({ ...m }));
let flags: Flag[] = seedFlags.map((f) => ({ ...f }));
let nextMatchId = 3;
let nextFlagId = 4;

export function __reset() {
  matches = seedMatches.map((m) => ({ ...m }));
  flags = seedFlags.map((f) => ({ ...f }));
  nextMatchId = 3;
  nextFlagId = 4;
}

export function getMatches(): RefMatch[] { return matches; }
export function addMatch(homeTeam: string, awayTeam: string, date: string, venue: string): RefMatch {
  const m: RefMatch = { id: nextMatchId++, homeTeam, awayTeam, date, venue };
  matches.push(m);
  return m;
}

export function getFlags(): Flag[] { return flags; }
export function addFlag(matchId: number, minute: number, type: FlagType, note: string): Flag | null {
  if (minute < 1 || minute > 90) return null;
  const validTypes: FlagType[] = ["foul", "yellow", "red", "offside"];
  if (!validTypes.includes(type)) return null;
  const f: Flag = { id: nextFlagId++, matchId, minute, type, note };
  flags.push(f);
  return f;
}

export interface MatchReport {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  flagCount: number;
  redCards: number;
}

export function getReports(): MatchReport[] {
  return matches.map((m) => {
    const mFlags = flags.filter((f) => f.matchId === m.id);
    return {
      matchId: m.id,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      flagCount: mFlags.length,
      redCards: mFlags.filter((f) => f.type === "red").length,
    };
  });
}
