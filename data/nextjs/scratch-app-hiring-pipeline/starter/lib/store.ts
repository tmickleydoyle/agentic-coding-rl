import { Job, Candidate, Interview } from "./types";

export function getJobs(): Job[] { return []; }
export function addJob(_data: Omit<Job, "id">): Job { return { id: "", title: "", department: "Engineering", status: "Open" }; }
export function updateJob(_id: string, _data: Partial<Omit<Job, "id">>): Job | null { return null; }
export function getCandidates(): Candidate[] { return []; }
export function addCandidate(_data: Omit<Candidate, "id">): Candidate { return { id: "", name: "", email: "", jobId: "", stage: "Applied" }; }
export function updateCandidate(_id: string, _data: Partial<Omit<Candidate, "id">>): Candidate | null { return null; }
export function deleteCandidate(_id: string): boolean { return false; }
export function getInterviews(): Interview[] { return []; }
export function addInterview(_data: Omit<Interview, "id">): Interview { return { id: "", candidateId: "", type: "Phone", scheduledDate: "", notes: "", result: "Pending" }; }
export function __reset(): void {}
