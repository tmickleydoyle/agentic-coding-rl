export interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  prerequisites: number[];
}

export interface Path {
  id: number;
  name: string;
  skillIds: number[];
}

export type SkillStatus = 'completed' | 'in_progress' | 'available' | 'locked';

export interface LearnerProgress {
  skillId: number;
  status: SkillStatus;
}

export type Route = 'home' | 'skills' | 'paths' | 'progress';
