export interface Player {
  id: number;
  name: string;
  seed: number;
  country: string;
}

export interface TMatch {
  id: number;
  round: number;
  player1Id: number;
  player2Id: number;
  winnerId: number | null;
}

export type Route = "bracket" | "players" | "results";
