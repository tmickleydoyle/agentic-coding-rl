import { FantasyPlayer, LeagueTeam } from "./types";
export function __reset(): void {}
export function getRoster(): FantasyPlayer[] { return []; }
export function getWaivers(): FantasyPlayer[] { return []; }
export function addToRoster(_playerId: number): FantasyPlayer | null { return null; }
export function dropFromRoster(_playerId: number): boolean { return false; }
export function getStandings(): LeagueTeam[] { return []; }
