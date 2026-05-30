import type { Build, BuildStatus, Pipeline } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `pipelines`, `builds`, and id counters; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listBuilds(_filter?: { status?: string | null; pipelineId?: string | null }): Build[] {
  // TODO: return builds, applying optional status + pipelineId filters
  return []
}

export function createBuild(_input: { pipelineId: string; durationSec?: number }): Build {
  // TODO: append a new running build with a fresh id and next build number
  return { id: '', pipelineId: '', number: 0, status: 'running', durationSec: 0 }
}

export function findBuild(_id: string): Build | undefined {
  // TODO: look up a build by id
  return undefined
}

export function updateBuild(
  _id: string,
  _patch: { status?: BuildStatus; durationSec?: number },
): Build | undefined {
  // TODO: apply the patch and return the updated build, or undefined if absent
  return undefined
}

export function deleteBuild(_id: string): boolean {
  // TODO: remove the build; return whether it existed
  return false
}

export function listPipelines(): Pipeline[] {
  // TODO: return all pipelines
  return []
}

export function createPipeline(_input: { name: string; repo?: string }): Pipeline {
  // TODO: append a new pipeline with a fresh id and return it
  return { id: '', name: '', repo: '' }
}
