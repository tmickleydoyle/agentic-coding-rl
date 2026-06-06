import { Player, TMatch } from "./types";

const seedPlayers: Player[] = [
  { id: 1, name: "Alex Kim", seed: 1, country: "USA" },
  { id: 2, name: "Bruno Perez", seed: 2, country: "BRA" },
  { id: 3, name: "Clara Zhang", seed: 3, country: "CHN" },
  { id: 4, name: "Diana Fox", seed: 4, country: "GBR" },
];

const seedMatches: TMatch[] = [
  { id: 1, round: 1, player1Id: 1, player2Id: 2, winnerId: null },
  { id: 2, round: 1, player1Id: 3, player2Id: 4, winnerId: null },
];

let players: Player[] = seedPlayers.map((p) => ({ ...p }));
let matches: TMatch[] = seedMatches.map((m) => ({ ...m }));
let nextPlayerId = 5;
let nextMatchId = 3;

export function __reset() {
  players = seedPlayers.map((p) => ({ ...p }));
  matches = seedMatches.map((m) => ({ ...m }));
  nextPlayerId = 5;
  nextMatchId = 3;
}

export function getPlayers(): Player[] { return players; }

export function addPlayer(name: string, seed: number, country: string): Player {
  const p: Player = { id: nextPlayerId++, name, seed, country };
  players.push(p);
  return p;
}

export function removePlayer(id: number): boolean {
  const idx = players.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  players.splice(idx, 1);
  matches.forEach((m) => { if (m.winnerId === id) m.winnerId = null; });
  return true;
}

export function getMatches(): TMatch[] { return matches; }

export function recordResult(matchId: number, winnerId: number): TMatch | null {
  const m = matches.find((m) => m.id === matchId);
  if (!m) return null;
  if (winnerId !== m.player1Id && winnerId !== m.player2Id) return null;
  m.winnerId = winnerId;
  return m;
}
