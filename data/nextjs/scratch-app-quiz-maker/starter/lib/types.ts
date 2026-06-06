export interface Quiz { id: string; title: string; description: string; }
export interface Question { id: string; quizId: string; text: string; options: [string, string, string, string]; correctIndex: number; }
export interface QuizAttempt { quizId: string; answers: number[]; score: number; total: number; }
export type Route = 'home' | 'quizzes' | 'create' | 'results';
