export type Stage = 'applied' | 'screen' | 'interview' | 'offer' | 'hired'

export type Job = {
  id: string
  title: string
  department: string
}

export type Candidate = {
  id: string
  name: string
  jobId: string
  stage: Stage
}

export type Route = 'jobs' | 'candidates' | 'pipeline' | 'job-detail'
export type Theme = 'light' | 'dark'

export const STAGES: Stage[] = ['applied', 'screen', 'interview', 'offer', 'hired']
