export interface ResearchNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  sourceUrl: string;
  createdAt: string;
  updatedAt: string;
}

export type Route = "research" | "sources" | "tags" | "search";
