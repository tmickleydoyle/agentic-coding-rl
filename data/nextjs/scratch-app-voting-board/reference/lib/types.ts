export interface Proposal {
  id: string;
  title: string;
  description: string;
  author: string;
  category: 'Feature' | 'Bug Fix' | 'Improvement' | 'Other';
  upvotes: number;
  downvotes: number;
  status: 'open' | 'closed';
  createdAt: string;
}

export type Route = 'home' | 'proposals' | 'submit' | 'leaderboard';

export interface AppState {
  route: Route;
}
