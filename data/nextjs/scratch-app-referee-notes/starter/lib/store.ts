import { RefMatch, Flag, FlagType } from "./types";
export interface MatchReport { matchId: number; homeTeam: string; awayTeam: string; flagCount: number; redCards: number; }
export function __reset(): void {}
export function getMatches(): RefMatch[] { return []; }
export function addMatch(_h: string, _a: string, _d: string, _v: string): RefMatch { return { id: 0, homeTeam: "", awayTeam: "", date: "", venue: "" }; }
export function getFlags(): Flag[] { return []; }
export function addFlag(_matchId: number, _minute: number, _type: FlagType, _note: string): Flag | null { return null; }
export function getReports(): MatchReport[] { return []; }
