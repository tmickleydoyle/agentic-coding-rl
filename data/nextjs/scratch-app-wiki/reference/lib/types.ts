export interface Revision {
  id: string;
  body: string;
  editedBy: string;
  editedAt: string;
}

export interface Article {
  id: string;
  title: string;
  body: string;
  author: string;
  tags: string[];
  revisions: Revision[];
  createdAt: string;
  updatedAt: string;
}

export type Route = 'home' | 'articles' | 'new-article' | 'history';

export interface AppState {
  route: Route;
  selectedArticleId: string | null;
}
