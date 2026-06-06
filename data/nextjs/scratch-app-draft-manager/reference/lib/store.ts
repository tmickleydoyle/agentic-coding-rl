import { DraftTeam, DraftPlayer, Pick } from "./types";

const seedTeams: DraftTeam[] = [
  { id: 1, name: "Thunder", owner: "Alice" },
  { id: 2, name: "Storm", owner: "Bob" },
  { id: 3, name: "Blaze", owner: "Carol" },
];

const seedPlayers: DraftPlayer[] = [
  { id: 1, name: "Marcus Webb", position: "QB", rating: 95 },
  { id: 2, name: "Derek Stone", position: "RB", rating: 88 },
  { id: 3, name: "Nina Cruz", position: "WR", rating: 91 },
  { id: 4, name: "Tyler Ross", position: "LB", rating: 84 },
];

let teams: DraftTeam[] = seedTeams.map((t) => ({ ...t }));
let players: DraftPlayer[] = seedPlayers.map((p) => ({ ...p }));
let picks: Pick[] = [];
let nextTeamId = 4;
let nextPickId = 1;
let nextPickNumber = 1;

export function __reset() {
  teams = seedTeams.map((t) => ({ ...t }));
  players = seedPlayers.map((p) => ({ ...p }));
  picks = [];
  nextTeamId = 4;
  nextPickId = 1;
  nextPickNumber = 1;
}

export function getTeams(): DraftTeam[] { return teams; }
export function addTeam(name: string, owner: string): DraftTeam {
  const t: DraftTeam = { id: nextTeamId++, name, owner };
  teams.push(t);
  return t;
}
export function removeTeam(id: number): boolean {
  const idx = teams.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  teams.splice(idx, 1);
  return true;
}

export function getPlayers(): DraftPlayer[] { return players; }
export function getAvailablePlayers(): DraftPlayer[] {
  const draftedIds = new Set(picks.map((p) => p.playerId));
  return players.filter((p) => !draftedIds.has(p.id));
}

export function getPicks(): Pick[] { return picks; }
export function makePick(teamId: number, playerId: number): Pick | null {
  const alreadyDrafted = picks.some((p) => p.playerId === playerId);
  if (alreadyDrafted) return null;
  const teamExists = teams.some((t) => t.id === teamId);
  const playerExists = players.some((p) => p.id === playerId);
  if (!teamExists || !playerExists) return null;
  const pickNumber = nextPickNumber++;
  const round = Math.ceil(pickNumber / teams.length);
  const pick: Pick = { id: nextPickId++, pickNumber, round, teamId, playerId };
  picks.push(pick);
  return pick;
}
