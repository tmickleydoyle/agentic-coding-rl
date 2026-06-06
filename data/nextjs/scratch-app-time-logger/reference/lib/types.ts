export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface TimeEntry {
  id: string;
  projectId: string;
  description: string;
  hours: number;
  date: string;
}

export type Route = 'home' | 'logs' | 'projects' | 'report';
