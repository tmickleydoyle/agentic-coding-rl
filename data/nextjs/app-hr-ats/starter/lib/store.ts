import type { Candidate, Job, Stage } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level jobs/candidates and id counters; seed them; provide __reset()
// to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listJobs(): Job[] {
  // TODO: return all jobs
  return []
}

export function jobsWithCounts(): Array<Job & { candidateCount: number }> {
  // TODO: return jobs each with a candidateCount of their candidates
  return []
}

export function createJob(_input: { title: string; department?: string }): Job {
  // TODO: append a new job with a fresh id and return it
  return { id: '', title: '', department: '' }
}

export function listCandidates(_filter?: { jobId?: string | null; stage?: string | null }): Candidate[] {
  // TODO: return candidates, applying optional jobId + stage filters
  return []
}

export function findCandidate(_id: string): Candidate | undefined {
  // TODO: look up a candidate by id
  return undefined
}

export function createCandidate(_input: { name: string; jobId?: string; stage?: Stage }): Candidate {
  // TODO: append a new candidate (default stage 'applied') with a fresh id and return it
  return { id: '', name: '', jobId: '', stage: 'applied' }
}

export function updateCandidate(
  _id: string,
  _patch: { stage?: Stage; jobId?: string; name?: string },
): Candidate | undefined {
  // TODO: apply the patch and return the updated candidate, or undefined if absent
  return undefined
}

export function deleteCandidate(_id: string): boolean {
  // TODO: remove the candidate; return whether it existed
  return false
}
