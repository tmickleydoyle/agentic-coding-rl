export type BuildStatus = 'passing' | 'failing' | 'running'

export type Pipeline = {
  id: string
  name: string
  repo: string
}

export type Build = {
  id: string
  pipelineId: string
  number: number
  status: BuildStatus
  durationSec: number
}

export type StatusFilter = 'all' | BuildStatus

export type Route = 'pipelines' | 'pipeline-detail' | 'builds' | 'stats'
export type Theme = 'light' | 'dark'
