export interface Course {
  title: string;
  description: string;
  published: boolean;
}

export interface Module {
  id: number;
  title: string;
  order: number;
  lessonCount: number;
}

export interface Lesson {
  id: number;
  moduleId: number;
  title: string;
  type: string;
  duration: number;
}

export type Route = 'home' | 'modules' | 'lessons' | 'preview';
