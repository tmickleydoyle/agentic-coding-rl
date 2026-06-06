export interface Skill {
  id: number;
  name: string;
  category: string;
  requiredHours: number;
}

export interface Certificate {
  id: number;
  skillId: number;
  recipientName: string;
  issuedDate: string;
  hoursCompleted: number;
}

export type Route = 'home' | 'certificates' | 'skills' | 'issued';
