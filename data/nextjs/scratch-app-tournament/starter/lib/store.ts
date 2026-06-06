import { Player, TMatch } from "./types";
export function __reset(): void {}
export function getPlayers(): Player[] { return []; }
export function addPlayer(_name: string, _seed: number, _country: string): Player { return { id: 0, name: "", seed: 0, country: "" }; }
export function removePlayer(_id: number): boolean { return false; }
export function getMatches(): TMatch[] { return []; }
export function recordResult(_matchId: number, _winnerId: number): TMatch | null { return null; }
