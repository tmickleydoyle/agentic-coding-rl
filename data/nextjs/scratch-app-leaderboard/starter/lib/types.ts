export interface Score {
  id: string;
  player: string;
  game: 'Chess' | 'Trivia' | 'Puzzle' | 'Racing';
  score: number;
  submittedAt: string;
}

export type Route = 'home' | 'rankings' | 'submit' | 'history';

export interface AppState {
  route: Route;
  selectedPlayer: string | null;
}
