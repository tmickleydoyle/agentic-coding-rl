export type Operation = "addition" | "subtraction" | "multiplication" | "division";
export type Difficulty = "easy" | "medium" | "hard";

export interface Problem {
  id: string;
  operation: Operation;
  operand1: number;
  operand2: number;
  answer: number;
  difficulty: Difficulty;
}

export interface DrillSession {
  id: string;
  operation: Operation;
  difficulty: Difficulty;
  totalProblems: number;
  correctAnswers: number;
  timeTakenSeconds: number;
  date: string;
}

export interface Score {
  id: string;
  userId: string;
  operation: Operation;
  correct: number;
  total: number;
  date: string;
}

export type Route = "home" | "problems" | "drills" | "scores";
