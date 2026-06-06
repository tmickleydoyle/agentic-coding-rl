export interface Reply {
  id: string;
  author: string;
  body: string;
  upvotes: number;
  createdAt: string;
}

export interface Thread {
  id: string;
  title: string;
  body: string;
  author: string;
  category: 'General' | 'Tech' | 'Off-Topic';
  upvotes: number;
  replies: Reply[];
  createdAt: string;
}

export type Route = 'home' | 'threads' | 'new-thread' | 'profile';

export interface AppState {
  route: Route;
  selectedThreadId: string | null;
  selectedUser: string | null;
}
