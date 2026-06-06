import { Player, Game } from "./types";
export function __reset(): void {}
export function getPlayers(): Player[] { return []; }
export function addPlayer(_name: string, _number: number, _position: string): Player | null { return null; }
export function removePlayer(_id: number): boolean { return false; }
export function updatePoints(_id: number, _totalPoints: number): Player | null { return null; }
export function getGames(): Game[] { return []; }
export function addGame(_title: string, _date: string, _opponent: string, _ourScore: number, _theirScore: number): Game | null { return null; }
export function getLeaderboard(): Player[] { return []; }
