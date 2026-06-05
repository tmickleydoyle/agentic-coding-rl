import type { Candidate, Job, Stage } from './types'

// In-memory server store for the API routes. SEPARATE from the client AppStateProvider.
// Tests call __reset() in beforeEach so each test starts from the same seed.

let jobs: Job[] = []
let candidates: Candidate[] = []
let nextJobId = 1
let nextCandidateId = 1

function seed(): void {
  jobs = [
    { id: 'j1', title: 'Frontend Engineer', department: 'Engineering' },
    { id: 'j2', title: 'Product Designer', department: 'Design' },
    { id: 'j3', title: 'Recruiter', department: 'People' },
  ]
  candidates = [
    { id: 'c1', name: 'Ada Lovelace', jobId: 'j1', stage: 'interview' },
    { id: 'c2', name: 'Grace Hopper', jobId: 'j1', stage: 'applied' },
    { id: 'c3', name: 'Linus Torvalds', jobId: 'j2', stage: 'offer' },
    { id: 'c4', name: 'Margaret Hamilton', jobId: 'j1', stage: 'hired' },
  ]
  nextJobId = 4
  nextCandidateId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listJobs(): Job[] {
  return jobs.slice()
}

export function jobsWithCounts(): Array<Job & { candidateCount: number }> {
  return jobs.map((j) => ({
    ...j,
    candidateCount: candidates.filter((c) => c.jobId === j.id).length,
  }))
}

export function createJob(input: { title: string; department?: string }): Job {
  const job: Job = {
    id: `j${nextJobId++}`,
    title: input.title,
    department: input.department ?? 'General',
  }
  jobs.push(job)
  return job
}

export function listCandidates(filter?: { jobId?: string | null; stage?: string | null }): Candidate[] {
  let out = candidates.slice()
  const jobId = filter?.jobId
  if (jobId) out = out.filter((c) => c.jobId === jobId)
  const stage = filter?.stage
  if (stage) out = out.filter((c) => c.stage === stage)
  return out
}

export function findCandidate(id: string): Candidate | undefined {
  return candidates.find((c) => c.id === id)
}

export function createCandidate(input: { name: string; jobId?: string; stage?: Stage }): Candidate {
  const candidate: Candidate = {
    id: `c${nextCandidateId++}`,
    name: input.name,
    jobId: input.jobId ?? 'j1',
    stage: input.stage ?? 'applied',
  }
  candidates.push(candidate)
  return candidate
}

export function updateCandidate(
  id: string,
  patch: { stage?: Stage; jobId?: string; name?: string },
): Candidate | undefined {
  const candidate = candidates.find((c) => c.id === id)
  if (!candidate) return undefined
  if (patch.stage !== undefined) candidate.stage = patch.stage
  if (typeof patch.jobId === 'string') candidate.jobId = patch.jobId
  if (typeof patch.name === 'string') candidate.name = patch.name
  return candidate
}

export function deleteCandidate(id: string): boolean {
  const idx = candidates.findIndex((c) => c.id === id)
  if (idx === -1) return false
  candidates.splice(idx, 1)
  return true
}
