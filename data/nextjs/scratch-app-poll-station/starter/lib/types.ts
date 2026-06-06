export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  creator: string;
  status: 'open' | 'closed';
  options: PollOption[];
  createdAt: string;
}

export type Route = 'home' | 'polls' | 'create' | 'results';

export interface AppState {
  route: Route;
  selectedPollId: string | null;
}
