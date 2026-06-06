export interface Comment {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface Link {
  id: string;
  title: string;
  url: string;
  submitter: string;
  category: 'News' | 'Tech' | 'Fun' | 'Other';
  upvotes: number;
  comments: Comment[];
  createdAt: string;
}

export type Route = 'home' | 'links' | 'submit' | 'profile';

export interface AppState {
  route: Route;
  selectedUser: string | null;
}
