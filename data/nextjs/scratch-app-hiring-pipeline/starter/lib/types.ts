export type Department = "Engineering" | "Design" | "Marketing" | "Sales" | "Operations";
export type JobStatus = "Open" | "Closed";
export type CandidateStage = "Applied" | "Phone Screen" | "Technical" | "Onsite" | "Offer" | "Hired" | "Rejected";
export type InterviewType = "Phone" | "Technical" | "Onsite" | "Final";
export type InterviewResult = "Pending" | "Pass" | "Fail";

export interface Job {
  id: string;
  title: string;
  department: Department;
  status: JobStatus;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  jobId: string;
  stage: CandidateStage;
}

export interface Interview {
  id: string;
  candidateId: string;
  type: InterviewType;
  scheduledDate: string;
  notes: string;
  result: InterviewResult;
}
