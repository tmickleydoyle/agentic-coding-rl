export interface DraftTeam {
  id: number;
  name: string;
  owner: string;
}

export interface DraftPlayer {
  id: number;
  name: string;
  position: string;
  rating: number;
}

export interface Pick {
  id: number;
  pickNumber: number;
  round: number;
  teamId: number;
  playerId: number;
}

export type Route = "board" | "picks" | "teams";
