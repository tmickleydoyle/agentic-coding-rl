export interface WikiPage {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  tags: string[];
  createdAt: string;
}

export interface WikiCategory {
  id: string;
  name: string;
}
