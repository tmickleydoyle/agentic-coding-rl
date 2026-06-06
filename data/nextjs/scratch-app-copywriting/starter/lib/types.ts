export type ProjectStatus = "active" | "completed" | "archived";
export type CopyStatus = "draft" | "review" | "approved" | "revision";

export interface CopyProject {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  deadline: string;
  createdAt: number;
}

export interface Brief {
  id: string;
  projectId: string;
  audience: string;
  tone: string;
  goal: string;
  keyMessages: string;
  createdAt: number;
}

export interface Copy {
  id: string;
  briefId: string;
  headline: string;
  body: string;
  cta: string;
  status: CopyStatus;
  rating: number;
  createdAt: number;
}

export type Route = "projects" | "briefs" | "copies" | "review";
