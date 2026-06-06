export interface RefMatch {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  venue: string;
}

export type FlagType = "foul" | "yellow" | "red" | "offside";

export interface Flag {
  id: number;
  matchId: number;
  minute: number;
  type: FlagType;
  note: string;
}

export type Route = "matches" | "flags" | "reports";
