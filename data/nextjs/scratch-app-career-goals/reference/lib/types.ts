export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  category: "education" | "experience" | "skill" | "network";
}

export interface Application {
  id: string;
  company: string;
  role: string;
  appliedDate: string;
  status: "applied" | "interview" | "offer" | "rejected" | "withdrawn";
  notes: string;
}

export interface CareerSkill {
  id: string;
  name: string;
  proficiency: "beginner" | "intermediate" | "advanced";
  required: boolean;
}

export type Route = "dashboard" | "milestones" | "applications" | "skills";
