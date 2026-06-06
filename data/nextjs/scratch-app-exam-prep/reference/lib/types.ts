export type Difficulty = "easy" | "medium" | "hard";
export type ExamStatus = "upcoming" | "in-progress" | "completed";

export interface Exam {
  id: string;
  title: string;
  subject: string;
  date: string;
  totalQuestions: number;
  difficulty: Difficulty;
  status: ExamStatus;
}

export interface Question {
  id: string;
  examId: string;
  text: string;
  options: string[];
  correctIndex: number;
  difficulty: Difficulty;
}

export interface PracticeResult {
  id: string;
  examId: string;
  examTitle: string;
  score: number;
  total: number;
  date: string;
  timeMinutes: number;
}

export type Route = "home" | "exams" | "practice" | "results";
