import { Team, Match, Standing } from "./types";

const seedTeams: Team[] = [
  { id: 1, name: "Red Lions", city: "Austin", coach: "Mike Ross" },
  { id: 2, name: "Blue Eagles", city: "Dallas", coach: "Sarah Lee" },
  { id: 3, name: "Green Hawks", city: "Houston", coach: "Tom Brown" },
];

const seedMatches: Match[] = [
  { id: 1, homeTeamId: 1, awayTeamId: 2, date: "2024-03-01", homeScore: 2, awayScore: 1 },
  { id: 2, homeTeamId: 3, awayTeamId: 1, date: "2024-03-05", homeScore: 0, awayScore: 0 },
];

let teams: Team[] = seedTeams.map((t) => ({ ...t }));
let matches: Match[] = seedMatches.map((m) => ({ ...m }));
let nextTeamId = 4;
let nextMatchId = 3;

export function __reset() {
  teams = seedTeams.map((t) => ({ ...t }));
  matches = seedMatches.map((m) => ({ ...m }));
  nextTeamId = 4;
  nextMatchId = 3;
}

export function getTeams(): Team[] { return teams; }

export function addTeam(name: string, city: string, coach: string): Team {
  const t: Team = { id: nextTeamId++, name, city, coach };
  teams.push(t);
  return t;
}

export function removeTeam(id: number): boolean {
  const idx = teams.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  teams.splice(idx, 1);
  matches = matches.filter((m) => m.homeTeamId !== id && m.awayTeamId !== id);
  return true;
}

export function getMatches(): Match[] { return matches; }

export function addMatch(homeTeamId: number, awayTeamId: number, date: string, homeScore: number, awayScore: number): Match | null {
  if (homeTeamId === awayTeamId) return null;
  if (homeScore < 0 || awayScore < 0) return null;
  const m: Match = { id: nextMatchId++, homeTeamId, awayTeamId, date, homeScore, awayScore };
  matches.push(m);
  return m;
}

export function getStandings(): Standing[] {
  const map: Record<number, Standing> = {};
  teams.forEach((t) => {
    map[t.id] = { teamId: t.id, teamName: t.name, wins: 0, losses: 0, draws: 0, points: 0 };
  });
  matches.forEach((m) => {
    const home = map[m.homeTeamId];
    const away = map[m.awayTeamId];
    if (!home || !away) return;
    if (m.homeScore > m.awayScore) {
      home.wins++; away.losses++;
    } else if (m.homeScore < m.awayScore) {
      away.wins++; home.losses++;
    } else {
      home.draws++; away.draws++;
    }
    home.points = home.wins * 3 + home.draws;
    away.points = away.wins * 3 + away.draws;
  });
  return Object.values(map).sort((a, b) => b.points - a.points);
}
