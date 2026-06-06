import { DraftTeam, DraftPlayer, Pick } from "./types";
export function __reset(): void {}
export function getTeams(): DraftTeam[] { return []; }
export function addTeam(_name: string, _owner: string): DraftTeam { return { id: 0, name: "", owner: "" }; }
export function removeTeam(_id: number): boolean { return false; }
export function getPlayers(): DraftPlayer[] { return []; }
export function getAvailablePlayers(): DraftPlayer[] { return []; }
export function getPicks(): Pick[] { return []; }
export function makePick(_teamId: number, _playerId: number): Pick | null { return null; }
