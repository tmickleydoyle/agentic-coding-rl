export type GameStatus = "wishlist" | "owned" | "playing" | "completed" | "dropped";

export interface Game {
  id: string;
  title: string;
  developer: string;
  genre: string;
  platform: string;
  estimatedHours: number;
  hoursPlayed: number;
  status: GameStatus;
  addedAt: string;
}

export type Route = "/" | "/collection" | "/wishlist" | "/stats";
