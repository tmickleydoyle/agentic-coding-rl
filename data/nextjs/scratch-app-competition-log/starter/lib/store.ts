import { Competition, CompResult } from "./types";

export function __reset(): void {}
export function getCompetitions(): Competition[] { return []; }
export function addCompetition(_name: string, _sport: string, _date: string, _location: string): Competition | null { return null; }
export function deleteCompetition(_id: string): void {}
export function addResult(_competitionId: string, _athleteName: string, _place: number, _score: string, _notes: string): CompResult | null { return null; }
