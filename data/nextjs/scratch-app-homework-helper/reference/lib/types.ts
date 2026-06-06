export type Priority = "low" | "medium" | "high";
export type AssignmentStatus = "todo" | "in-progress" | "done";

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: Priority;
  status: AssignmentStatus;
  description: string;
  estimatedMinutes: number;
}

export interface SubjectStats {
  subject: string;
  total: number;
  done: number;
}

export interface StudyNote {
  id: string;
  subject: string;
  title: string;
  content: string;
  createdAt: string;
}

export type Route = "home" | "assignments" | "subjects" | "progress";
