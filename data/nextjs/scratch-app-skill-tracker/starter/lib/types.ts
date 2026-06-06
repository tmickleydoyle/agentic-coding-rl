export interface Skill {
  id: string;
  name: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  hoursTotal: number;
}

export interface ProgressEntry {
  id: string;
  skillId: string;
  date: string;
  hoursLogged: number;
  notes: string;
}

export interface Resource {
  id: string;
  skillId: string;
  title: string;
  url: string;
  type: "article" | "video" | "course" | "book";
  completed: boolean;
}

export type Route = "dashboard" | "skills" | "progress" | "resources";
