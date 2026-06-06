import { Certification, StudyEntry, ExamAttempt } from "./types";

const seedCerts: Certification[] = [
  { id: "cert1", name: "AWS Solutions Architect", provider: "Amazon", status: "earned", earnedDate: "2023-06-15", expiryDate: "2026-06-15", credentialId: "AWS-12345" },
  { id: "cert2", name: "Kubernetes CKA", provider: "CNCF", status: "studying", earnedDate: "", expiryDate: "", credentialId: "" },
  { id: "cert3", name: "Google Cloud Professional", provider: "Google", status: "planned", earnedDate: "", expiryDate: "", credentialId: "" },
];

const seedStudy: StudyEntry[] = [
  { id: "st1", certId: "cert2", topic: "Cluster Architecture", hoursSpent: 3, date: "2024-03-10" },
  { id: "st2", certId: "cert2", topic: "Networking", hoursSpent: 2, date: "2024-03-12" },
];

const seedExams: ExamAttempt[] = [
  { id: "ex1", certId: "cert1", date: "2023-06-15", score: 85, passed: true, notes: "First attempt" },
  { id: "ex2", certId: "cert2", date: "2024-01-20", score: 60, passed: false, notes: "Need more practice" },
];

let certs: Certification[] = seedCerts.map((c) => ({ ...c }));
let study: StudyEntry[] = seedStudy.map((s) => ({ ...s }));
let exams: ExamAttempt[] = seedExams.map((e) => ({ ...e }));
let cC = 4, sC = 3, eC = 3;

export function __reset() {
  certs = seedCerts.map((c) => ({ ...c }));
  study = seedStudy.map((s) => ({ ...s }));
  exams = seedExams.map((e) => ({ ...e }));
  cC = 4; sC = 3; eC = 3;
}

export function getCertifications(): Certification[] { return certs; }
export function addCertification(data: { name: string; provider: string; status: Certification["status"] }): Certification {
  const c: Certification = { id: `cert${cC++}`, ...data, earnedDate: "", expiryDate: "", credentialId: "" };
  certs.push(c);
  return c;
}
export function deleteCertification(id: string): void {
  certs = certs.filter((c) => c.id !== id);
  study = study.filter((s) => s.certId !== id);
  exams = exams.filter((e) => e.certId !== id);
}

export function getStudyEntries(): StudyEntry[] { return study; }
export function addStudyEntry(data: { certId: string; topic: string; hoursSpent: number; date: string }): StudyEntry {
  const s: StudyEntry = { id: `st${sC++}`, ...data };
  study.push(s);
  return s;
}

export function getExams(): ExamAttempt[] { return exams; }
export function addExam(data: { certId: string; date: string; score: number; notes: string }): ExamAttempt {
  const e: ExamAttempt = { id: `ex${eC++}`, ...data, passed: data.score >= 70 };
  exams.push(e);
  return e;
}
