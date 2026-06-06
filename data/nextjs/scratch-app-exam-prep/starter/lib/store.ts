import type { Exam, Question, PracticeResult, ExamStatus } from "./types";

export function getExams(): Exam[] { return []; }
export function getQuestions(): Question[] { return []; }
export function getResults(): PracticeResult[] { return []; }
export function getExamQuestions(_examId: string): Question[] { return []; }
export function addExam(_data: Omit<Exam, "id">): Exam { throw new Error("Not implemented"); }
export function addQuestion(_data: Omit<Question, "id">): Question { throw new Error("Not implemented"); }
export function updateExamStatus(_id: string, _status: ExamStatus): Exam | null { return null; }
export function addResult(_data: Omit<PracticeResult, "id">): PracticeResult { throw new Error("Not implemented"); }
export function getAverageScore(): number { return 0; }
export function __reset(): void {}
