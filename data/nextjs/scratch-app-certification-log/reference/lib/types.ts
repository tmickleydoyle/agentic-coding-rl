export interface Certification {
  id: string;
  name: string;
  provider: string;
  status: "planned" | "studying" | "earned" | "expired";
  earnedDate: string;
  expiryDate: string;
  credentialId: string;
}

export interface StudyEntry {
  id: string;
  certId: string;
  topic: string;
  hoursSpent: number;
  date: string;
}

export interface ExamAttempt {
  id: string;
  certId: string;
  date: string;
  score: number;
  passed: boolean;
  notes: string;
}

export type Route = "dashboard" | "certifications" | "study" | "exams";
