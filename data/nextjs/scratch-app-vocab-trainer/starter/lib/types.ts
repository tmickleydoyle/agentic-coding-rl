export interface Word {
  id: string;
  term: string;
  definition: string;
  category: string;
}

export interface QuizResult {
  id: string;
  date: string;
  score: number;
  total: number;
}

export type Route = 'home' | 'library' | 'quiz' | 'results';
