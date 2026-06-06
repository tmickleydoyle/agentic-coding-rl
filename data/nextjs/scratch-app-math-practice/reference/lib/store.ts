import type { Problem, DrillSession, Score, Operation, Difficulty } from "./types";

function makeAnswer(op: Operation, a: number, b: number): number {
  if (op === "addition") return a + b;
  if (op === "subtraction") return a - b;
  if (op === "multiplication") return a * b;
  if (op === "division") return b === 0 ? 0 : Math.round(a / b);
  return 0;
}

let problems: Problem[] = [
  { id: "pr1", operation: "addition", operand1: 5, operand2: 3, answer: 8, difficulty: "easy" },
  { id: "pr2", operation: "multiplication", operand1: 7, operand2: 8, answer: 56, difficulty: "medium" },
  { id: "pr3", operation: "subtraction", operand1: 15, operand2: 7, answer: 8, difficulty: "easy" },
  { id: "pr4", operation: "division", operand1: 48, operand2: 6, answer: 8, difficulty: "medium" },
  { id: "pr5", operation: "multiplication", operand1: 12, operand2: 13, answer: 156, difficulty: "hard" },
];

let drills: DrillSession[] = [
  { id: "d1", operation: "addition", difficulty: "easy", totalProblems: 10, correctAnswers: 9, timeTakenSeconds: 45, date: "2024-03-01" },
  { id: "d2", operation: "multiplication", difficulty: "medium", totalProblems: 10, correctAnswers: 7, timeTakenSeconds: 90, date: "2024-03-05" },
];

let scores: Score[] = [
  { id: "sc1", userId: "user1", operation: "addition", correct: 9, total: 10, date: "2024-03-01" },
  { id: "sc2", userId: "user1", operation: "multiplication", correct: 7, total: 10, date: "2024-03-05" },
];

let nextId = 100;

export function getProblems(): Problem[] { return [...problems]; }
export function getDrills(): DrillSession[] { return [...drills]; }
export function getScores(): Score[] { return [...scores]; }

export function getProblemsByOperation(op: Operation): Problem[] {
  return problems.filter(p => p.operation === op);
}

export function generateProblem(op: Operation, difficulty: Difficulty): Problem {
  const ranges: Record<Difficulty, number> = { easy: 10, medium: 50, hard: 100 };
  const max = ranges[difficulty];
  const a = Math.floor(Math.random() * max) + 1;
  const b = Math.floor(Math.random() * max) + 1;
  const safe_b = op === "division" && b === 0 ? 1 : b;
  const answer = makeAnswer(op, a, safe_b);
  const p: Problem = { id: `pr${nextId++}`, operation: op, operand1: a, operand2: safe_b, answer, difficulty };
  problems.push(p);
  return p;
}

export function addDrill(data: Omit<DrillSession, "id">): DrillSession {
  const d: DrillSession = { ...data, id: `d${nextId++}` };
  drills.push(d);
  return d;
}

export function addScore(data: Omit<Score, "id">): Score {
  const s: Score = { ...data, id: `sc${nextId++}` };
  scores.push(s);
  return s;
}

export function getBestScoreByOperation(op: Operation): number {
  const relevant = scores.filter(s => s.operation === op);
  if (relevant.length === 0) return 0;
  return Math.max(...relevant.map(s => Math.round((s.correct / s.total) * 100)));
}

export function __reset(): void {
  problems = [
    { id: "pr1", operation: "addition", operand1: 5, operand2: 3, answer: 8, difficulty: "easy" },
    { id: "pr2", operation: "multiplication", operand1: 7, operand2: 8, answer: 56, difficulty: "medium" },
    { id: "pr3", operation: "subtraction", operand1: 15, operand2: 7, answer: 8, difficulty: "easy" },
    { id: "pr4", operation: "division", operand1: 48, operand2: 6, answer: 8, difficulty: "medium" },
    { id: "pr5", operation: "multiplication", operand1: 12, operand2: 13, answer: 156, difficulty: "hard" },
  ];
  drills = [
    { id: "d1", operation: "addition", difficulty: "easy", totalProblems: 10, correctAnswers: 9, timeTakenSeconds: 45, date: "2024-03-01" },
    { id: "d2", operation: "multiplication", difficulty: "medium", totalProblems: 10, correctAnswers: 7, timeTakenSeconds: 90, date: "2024-03-05" },
  ];
  scores = [
    { id: "sc1", userId: "user1", operation: "addition", correct: 9, total: 10, date: "2024-03-01" },
    { id: "sc2", userId: "user1", operation: "multiplication", correct: 7, total: 10, date: "2024-03-05" },
  ];
  nextId = 100;
}
