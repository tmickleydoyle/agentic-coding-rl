export interface Score {
  id: string;
  name: string;
  wpm: number;
  accuracy: number;
  date: string;
}

export interface Settings {
  name: string;
  duration: number;
}

export type Route = 'home' | 'practice' | 'leaderboard' | 'settings';
