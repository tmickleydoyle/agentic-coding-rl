export interface MindMapNode {
  id: string;
  label: string;
  parentId: string | null;
  color: string;
  createdAt: string;
}

export type Route = "view" | "manage" | "filter";
