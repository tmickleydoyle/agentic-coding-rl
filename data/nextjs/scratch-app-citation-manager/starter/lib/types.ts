export type CitationType = "article" | "book" | "website" | "other";

export interface Citation {
  id: string;
  title: string;
  authors: string;
  year: string;
  type: CitationType;
  url: string;
  collection: string;
  notes: string;
  createdAt: string;
}

export type Route = "citations" | "collections" | "export" | "search";
