import type { Exam, Question, PracticeResult, ExamStatus } from "./types";

let exams: Exam[] = [
  { id: "e1", title: "Algebra Final", subject: "Math", date: "2024-04-15", totalQuestions: 30, difficulty: "medium", status: "upcoming" },
  { id: "e2", title: "Biology Midterm", subject: "Science", date: "2024-03-20", totalQuestions: 25, difficulty: "hard", status: "upcoming" },
  { id: "e3", title: "Grammar Quiz", subject: "English", date: "2024-03-10", totalQuestions: 20, difficulty: "easy", status: "completed" },
];

let questions: Question[] = [
  { id: "q1", examId: "e1", text: "What is x if 2x + 4 = 10?", options: ["2", "3", "4", "5"], correctIndex: 1, difficulty: "easy" },
  { id: "q2", examId: "e1", text: "Solve: x² - 9 = 0", options: ["x=3", "x=±3", "x=9", "x=±9"], correctIndex: 1, difficulty: "medium" },
  { id: "q3", examId: "e2", text: "What organelle produces ATP?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi"], correctIndex: 2, difficulty: "medium" },
];

let results: PracticeResult[] = [
  { id: "r1", examId: "e3", examTitle: "Grammar Quiz", score: 17, total: 20, date: "2024-03-10", timeMinutes: 22 },
];

let nextId = 100;

export function getExams(): Exam[] { return [...exams]; }
export function getQuestions(): Question[] { return [...questions]; }
export function getResults(): PracticeResult[] { return [...results]; }
export function getExamQuestions(examId: string): Question[] { return questions.filter(q => q.examId === examId); }

export function addExam(data: Omit<Exam, "id">): Exam {
  const e: Exam = { ...data, id: `e${nextId++}` };
  exams.push(e);
  return e;
}

export function addQuestion(data: Omit<Question, "id">): Question {
  const q: Question = { ...data, id: `q${nextId++}` };
  questions.push(q);
  return q;
}

export function updateExamStatus(id: string, status: ExamStatus): Exam | null {
  const e = exams.find(x => x.id === id);
  if (!e) return null;
  e.status = status;
  return { ...e };
}

export function addResult(data: Omit<PracticeResult, "id">): PracticeResult {
  const r: PracticeResult = { ...data, id: `r${nextId++}` };
  results.push(r);
  return r;
}

export function getAverageScore(): number {
  if (results.length === 0) return 0;
  const pcts = results.map(r => (r.score / r.total) * 100);
  return Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
}

export function __reset(): void {
  exams = [
    { id: "e1", title: "Algebra Final", subject: "Math", date: "2024-04-15", totalQuestions: 30, difficulty: "medium", status: "upcoming" },
    { id: "e2", title: "Biology Midterm", subject: "Science", date: "2024-03-20", totalQuestions: 25, difficulty: "hard", status: "upcoming" },
    { id: "e3", title: "Grammar Quiz", subject: "English", date: "2024-03-10", totalQuestions: 20, difficulty: "easy", status: "completed" },
  ];
  questions = [
    { id: "q1", examId: "e1", text: "What is x if 2x + 4 = 10?", options: ["2", "3", "4", "5"], correctIndex: 1, difficulty: "easy" },
    { id: "q2", examId: "e1", text: "Solve: x² - 9 = 0", options: ["x=3", "x=±3", "x=9", "x=±9"], correctIndex: 1, difficulty: "medium" },
    { id: "q3", examId: "e2", text: "What organelle produces ATP?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi"], correctIndex: 2, difficulty: "medium" },
  ];
  results = [
    { id: "r1", examId: "e3", examTitle: "Grammar Quiz", score: 17, total: 20, date: "2024-03-10", timeMinutes: 22 },
  ];
  nextId = 100;
}
