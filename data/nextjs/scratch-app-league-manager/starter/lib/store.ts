import { Team, Match, Standing } from "./types";

export function __reset(): void {}
export function getTeams(): Team[] { return []; }
export function addTeam(_name: string, _city: string, _coach: string): Team { return { id: 0, name: "", city: "", coach: "" }; }
export function removeTeam(_id: number): boolean { return false; }
export function getMatches(): Match[] { return []; }
export function addMatch(_homeTeamId: number, _awayTeamId: number, _date: string, _homeScore: number, _awayScore: number): Match | null { return null; }
export function getStandings(): Standing[] { return []; }
