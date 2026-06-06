import { Job, Candidate, Interview } from "./types";

const SEED_JOBS: Job[] = [
  { id: "1", title: "Senior Engineer", department: "Engineering", status: "Open" },
  { id: "2", title: "Product Designer", department: "Design", status: "Open" },
  { id: "3", title: "Growth Marketer", department: "Marketing", status: "Closed" },
];

const SEED_CANDIDATES: Candidate[] = [
  { id: "1", name: "Alice Smith", email: "alice@mail.com", jobId: "1", stage: "Technical" },
  { id: "2", name: "Bob Jones", email: "bob@mail.com", jobId: "1", stage: "Phone Screen" },
  { id: "3", name: "Carol Lee", email: "carol@mail.com", jobId: "2", stage: "Applied" },
  { id: "4", name: "Dan Park", email: "dan@mail.com", jobId: "1", stage: "Hired" },
];

const SEED_INTERVIEWS: Interview[] = [
  { id: "1", candidateId: "1", type: "Technical", scheduledDate: "2024-02-10", notes: "Strong performance", result: "Pass" },
];

let jobs: Job[] = SEED_JOBS.map((j) => ({ ...j }));
let candidates: Candidate[] = SEED_CANDIDATES.map((c) => ({ ...c }));
let interviews: Interview[] = SEED_INTERVIEWS.map((i) => ({ ...i }));
let nextJobId = 4;
let nextCandidateId = 5;
let nextInterviewId = 2;

export function getJobs(): Job[] { return jobs.map((j) => ({ ...j })); }
export function addJob(data: Omit<Job, "id">): Job {
  const j: Job = { ...data, id: String(nextJobId++) };
  jobs.push(j);
  return { ...j };
}
export function updateJob(id: string, data: Partial<Omit<Job, "id">>): Job | null {
  const idx = jobs.findIndex((j) => j.id === id);
  if (idx === -1) return null;
  jobs[idx] = { ...jobs[idx], ...data };
  return { ...jobs[idx] };
}

export function getCandidates(): Candidate[] { return candidates.map((c) => ({ ...c })); }
export function addCandidate(data: Omit<Candidate, "id">): Candidate {
  const c: Candidate = { ...data, id: String(nextCandidateId++) };
  candidates.push(c);
  return { ...c };
}
export function updateCandidate(id: string, data: Partial<Omit<Candidate, "id">>): Candidate | null {
  const idx = candidates.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  candidates[idx] = { ...candidates[idx], ...data };
  return { ...candidates[idx] };
}
export function deleteCandidate(id: string): boolean {
  const idx = candidates.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  candidates.splice(idx, 1);
  return true;
}

export function getInterviews(): Interview[] { return interviews.map((i) => ({ ...i })); }
export function addInterview(data: Omit<Interview, "id">): Interview {
  const i: Interview = { ...data, id: String(nextInterviewId++) };
  interviews.push(i);
  return { ...i };
}

export function __reset(): void {
  jobs = SEED_JOBS.map((j) => ({ ...j }));
  candidates = SEED_CANDIDATES.map((c) => ({ ...c }));
  interviews = SEED_INTERVIEWS.map((i) => ({ ...i }));
  nextJobId = 4;
  nextCandidateId = 5;
  nextInterviewId = 2;
}
