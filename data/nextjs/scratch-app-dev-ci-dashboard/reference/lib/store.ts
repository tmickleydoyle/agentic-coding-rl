import type { Build, BuildStatus, Pipeline } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let pipelines: Pipeline[] = []
let builds: Build[] = []
let nextBuildId = 1
let nextPipelineId = 1

function seed(): void {
  pipelines = [
    { id: 'pl1', name: 'Web App', repo: 'acme/web' },
    { id: 'pl2', name: 'API', repo: 'acme/api' },
    { id: 'pl3', name: 'Worker', repo: 'acme/worker' },
  ]
  builds = [
    { id: 'b1', pipelineId: 'pl1', number: 101, status: 'passing', durationSec: 120 },
    { id: 'b2', pipelineId: 'pl1', number: 102, status: 'failing', durationSec: 95 },
    { id: 'b3', pipelineId: 'pl2', number: 50, status: 'passing', durationSec: 60 },
    { id: 'b4', pipelineId: 'pl2', number: 51, status: 'running', durationSec: 0 },
    { id: 'b5', pipelineId: 'pl3', number: 12, status: 'passing', durationSec: 200 },
  ]
  nextBuildId = 6
  nextPipelineId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listBuilds(filter?: { status?: string | null; pipelineId?: string | null }): Build[] {
  let out = builds.slice()
  const status = filter?.status
  if (status === 'passing' || status === 'failing' || status === 'running') {
    out = out.filter((b) => b.status === status)
  }
  const pipelineId = filter?.pipelineId
  if (pipelineId) out = out.filter((b) => b.pipelineId === pipelineId)
  return out
}

export function createBuild(input: { pipelineId: string; durationSec?: number }): Build {
  const numbers = builds.filter((b) => b.pipelineId === input.pipelineId).map((b) => b.number)
  const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1
  const build: Build = {
    id: `b${nextBuildId++}`,
    pipelineId: input.pipelineId,
    number: nextNumber,
    status: 'running',
    durationSec: input.durationSec ?? 0,
  }
  builds.push(build)
  return build
}

export function findBuild(id: string): Build | undefined {
  return builds.find((b) => b.id === id)
}

export function updateBuild(
  id: string,
  patch: { status?: BuildStatus; durationSec?: number },
): Build | undefined {
  const build = builds.find((b) => b.id === id)
  if (!build) return undefined
  if (patch.status) build.status = patch.status
  if (typeof patch.durationSec === 'number') build.durationSec = patch.durationSec
  return build
}

export function deleteBuild(id: string): boolean {
  const idx = builds.findIndex((b) => b.id === id)
  if (idx === -1) return false
  builds.splice(idx, 1)
  return true
}

export function listPipelines(): Pipeline[] {
  return pipelines.slice()
}

export function createPipeline(input: { name: string; repo?: string }): Pipeline {
  const pipeline: Pipeline = {
    id: `pl${nextPipelineId++}`,
    name: input.name,
    repo: input.repo ?? '',
  }
  pipelines.push(pipeline)
  return pipeline
}
