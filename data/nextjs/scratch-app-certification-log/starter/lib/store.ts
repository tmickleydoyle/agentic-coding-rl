import { Certification, StudyEntry, ExamAttempt } from "./types";

export function __reset(): void {}
export function getCertifications(): Certification[] { return []; }
export function addCertification(_data: { name: string; provider: string; status: Certification["status"] }): Certification {
  return { id: "", name: "", provider: "", status: "planned", earnedDate: "", expiryDate: "", credentialId: "" };
}
export function deleteCertification(_id: string): void {}
export function getStudyEntries(): StudyEntry[] { return []; }
export function addStudyEntry(_data: { certId: string; topic: string; hoursSpent: number; date: string }): StudyEntry {
  return { id: "", certId: "", topic: "", hoursSpent: 0, date: "" };
}
export function getExams(): ExamAttempt[] { return []; }
export function addExam(_data: { certId: string; date: string; score: number; notes: string }): ExamAttempt {
  return { id: "", certId: "", date: "", score: 0, passed: false, notes: "" };
}
