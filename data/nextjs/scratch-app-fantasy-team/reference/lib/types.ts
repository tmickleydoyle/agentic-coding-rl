export interface FantasyPlayer {
  id: number;
  name: string;
  position: string;
  nflTeam: string;
  fantasyPoints: number;
  onRoster: boolean;
}

export interface LeagueTeam {
  id: number;
  teamName: string;
  wins: number;
  losses: number;
  totalPoints: number;
}

export type Route = "roster" | "waivers" | "standings";
