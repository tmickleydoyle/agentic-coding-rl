import type { Quiz, Question, QuizAttempt } from './types';

const seedQuizzes: Quiz[] = [
  { id: 'q1', title: 'General Knowledge', description: 'Test your general knowledge' },
  { id: 'q2', title: 'Science Basics', description: 'Basic science questions' },
];

const seedQuestions: Question[] = [
  { id: 'qu1', quizId: 'q1', text: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin', 'Rome'], correctIndex: 1 },
  { id: 'qu2', quizId: 'q1', text: 'How many continents are there?', options: ['5', '6', '7', '8'], correctIndex: 2 },
  { id: 'qu3', quizId: 'q2', text: 'What is H2O?', options: ['Gold', 'Water', 'Salt', 'Iron'], correctIndex: 1 },
];

let quizzes: Quiz[] = seedQuizzes.map(q => ({ ...q }));
let questions: Question[] = seedQuestions.map(q => ({ ...q, options: [...q.options] as [string, string, string, string] }));
let lastAttempt: QuizAttempt | null = null;
let nextQuizId = 3;
let nextQuestionId = 4;

export function __reset() {
  quizzes = seedQuizzes.map(q => ({ ...q }));
  questions = seedQuestions.map(q => ({ ...q, options: [...q.options] as [string, string, string, string] }));
  lastAttempt = null;
  nextQuizId = 3;
  nextQuestionId = 4;
}

export function getQuizzes(): Quiz[] { return quizzes.slice(); }
export function getQuestions(): Question[] { return questions.slice(); }
export function getLastAttempt(): QuizAttempt | null { return lastAttempt ? { ...lastAttempt, answers: [...lastAttempt.answers] } : null; }

export function addQuiz(data: Omit<Quiz, 'id'>): Quiz {
  const q: Quiz = { id: `q${nextQuizId++}`, ...data };
  quizzes.push(q);
  return q;
}

export function deleteQuiz(id: string): boolean {
  const idx = quizzes.findIndex(q => q.id === id);
  if (idx === -1) return false;
  quizzes.splice(idx, 1);
  questions = questions.filter(q => q.quizId !== id);
  return true;
}

export function addQuestion(data: Omit<Question, 'id'>): Question {
  const q: Question = { id: `qu${nextQuestionId++}`, ...data };
  questions.push(q);
  return q;
}

export function saveAttempt(attempt: QuizAttempt) {
  lastAttempt = { ...attempt, answers: [...attempt.answers] };
}
