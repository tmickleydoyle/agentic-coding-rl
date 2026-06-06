export type ArgumentType = "claim" | "support" | "rebuttal" | "evidence";

export interface Argument {
  id: string;
  text: string;
  type: ArgumentType;
  parentId: string | null;
  topic: string;
  createdAt: string;
}

export type Route = "view" | "manage" | "filter";
