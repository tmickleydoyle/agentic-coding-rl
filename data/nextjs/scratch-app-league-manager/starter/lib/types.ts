export interface Team {
  id: number;
  name: string;
  city: string;
  coach: string;
}

export interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  date: string;
  homeScore: number;
  awayScore: number;
}

export interface Standing {
  teamId: number;
  teamName: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
}

export type Route = "standings" | "teams" | "schedule";
