import { Player, Game } from "./types";

const seedPlayers: Player[] = [
  { id: 1, name: "Jordan Lee", number: 10, position: "Forward", totalPoints: 24 },
  { id: 2, name: "Sam Park", number: 7, position: "Midfielder", totalPoints: 18 },
  { id: 3, name: "Riley Chen", number: 3, position: "Defender", totalPoints: 6 },
];

const seedGames: Game[] = [
  { id: 1, title: "Season Opener", date: "2024-09-01", opponent: "Rivals FC", ourScore: 3, theirScore: 1 },
  { id: 2, title: "Home Derby", date: "2024-09-08", opponent: "City United", ourScore: 2, theirScore: 2 },
];

let players: Player[] = seedPlayers.map((p) => ({ ...p }));
let games: Game[] = seedGames.map((g) => ({ ...g }));
let nextPlayerId = 4;
let nextGameId = 3;

export function __reset() {
  players = seedPlayers.map((p) => ({ ...p }));
  games = seedGames.map((g) => ({ ...g }));
  nextPlayerId = 4;
  nextGameId = 3;
}

export function getPlayers(): Player[] { return players; }
export function addPlayer(name: string, number: number, position: string): Player | null {
  if (number <= 0) return null;
  const p: Player = { id: nextPlayerId++, name, number, position, totalPoints: 0 };
  players.push(p);
  return p;
}
export function removePlayer(id: number): boolean {
  const idx = players.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  players.splice(idx, 1);
  return true;
}
export function updatePoints(id: number, totalPoints: number): Player | null {
  const p = players.find((p) => p.id === id);
  if (!p) return null;
  p.totalPoints = totalPoints;
  return p;
}
export function getGames(): Game[] { return games; }
export function addGame(title: string, date: string, opponent: string, ourScore: number, theirScore: number): Game | null {
  if (ourScore < 0 || theirScore < 0) return null;
  const g: Game = { id: nextGameId++, title, date, opponent, ourScore, theirScore };
  games.push(g);
  return g;
}
export function getLeaderboard(): Player[] {
  return players.slice().sort((a, b) => b.totalPoints - a.totalPoints);
}
