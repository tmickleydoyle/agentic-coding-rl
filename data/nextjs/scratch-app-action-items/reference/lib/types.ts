export type Priority = "low" | "medium" | "high";

export interface ActionItem {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
  notes: string;
  createdAt: string;
}

export type Route = "items" | "completed" | "filter";
