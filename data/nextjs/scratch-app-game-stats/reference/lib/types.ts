export interface Player {
  id: number;
  name: string;
  number: number;
  position: string;
  totalPoints: number;
}

export interface Game {
  id: number;
  title: string;
  date: string;
  opponent: string;
  ourScore: number;
  theirScore: number;
}

export type Route = "games" | "players" | "leaderboard";
