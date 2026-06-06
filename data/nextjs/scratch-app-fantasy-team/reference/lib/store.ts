import { FantasyPlayer, LeagueTeam } from "./types";

const seedPlayers: FantasyPlayer[] = [
  { id: 1, name: "Ethan Moore", position: "QB", nflTeam: "Eagles", fantasyPoints: 312, onRoster: true },
  { id: 2, name: "Lila Grant", position: "RB", nflTeam: "Chiefs", fantasyPoints: 278, onRoster: true },
  { id: 3, name: "Noah Flynn", position: "WR", nflTeam: "Cowboys", fantasyPoints: 245, onRoster: true },
  { id: 4, name: "Sofia Banks", position: "TE", nflTeam: "Ravens", fantasyPoints: 180, onRoster: false },
  { id: 5, name: "Caleb Stone", position: "K", nflTeam: "Packers", fantasyPoints: 95, onRoster: false },
];

const seedStandings: LeagueTeam[] = [
  { id: 1, teamName: "My Team", wins: 5, losses: 2, totalPoints: 835 },
  { id: 2, teamName: "Rivals", wins: 4, losses: 3, totalPoints: 780 },
  { id: 3, teamName: "Underdogs", wins: 3, losses: 4, totalPoints: 710 },
];

let players: FantasyPlayer[] = seedPlayers.map((p) => ({ ...p }));
let standings: LeagueTeam[] = seedStandings.map((s) => ({ ...s }));

export function __reset() {
  players = seedPlayers.map((p) => ({ ...p }));
  standings = seedStandings.map((s) => ({ ...s }));
}

export function getRoster(): FantasyPlayer[] { return players.filter((p) => p.onRoster); }
export function getWaivers(): FantasyPlayer[] { return players.filter((p) => !p.onRoster); }

export function addToRoster(playerId: number): FantasyPlayer | null {
  const p = players.find((pl) => pl.id === playerId);
  if (!p || p.onRoster) return null;
  const rosterSize = players.filter((pl) => pl.onRoster).length;
  if (rosterSize >= 15) return null;
  p.onRoster = true;
  return p;
}

export function dropFromRoster(playerId: number): boolean {
  const p = players.find((pl) => pl.id === playerId);
  if (!p || !p.onRoster) return false;
  p.onRoster = false;
  return true;
}

export function getStandings(): LeagueTeam[] {
  return standings.slice().sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.totalPoints - a.totalPoints;
  });
}
