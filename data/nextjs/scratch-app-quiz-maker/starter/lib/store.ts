import type { Quiz, Question, QuizAttempt } from './types';
export function __reset() {}
export function getQuizzes(): Quiz[] { return []; }
export function getQuestions(): Question[] { return []; }
export function getLastAttempt(): QuizAttempt | null { return null; }
export function addQuiz(_d: Omit<Quiz, 'id'>): Quiz { return { id: '', title: '', description: '' }; }
export function deleteQuiz(_id: string): boolean { return false; }
export function addQuestion(_d: Omit<Question, 'id'>): Question { return { id: '', quizId: '', text: '', options: ['', '', '', ''], correctIndex: 0 }; }
export function saveAttempt(_a: QuizAttempt) {}
