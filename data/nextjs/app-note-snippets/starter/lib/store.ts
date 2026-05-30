import type { Snippet } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `snippets` and an id counter; seed them; provide __reset().

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listSnippets(_filter?: {
  language?: string | null
  favorite?: string | null
  q?: string | null
}): Snippet[] {
  // TODO: return snippets, applying optional language + favorite + q filters
  return []
}

export function createSnippet(_input: { title: string; language: string; code?: string }): Snippet {
  // TODO: append a new snippet with a fresh id and return it
  return { id: '', title: '', language: '', code: '', favorite: false, copyCount: 0 }
}

export function findSnippet(_id: string): Snippet | undefined {
  // TODO: look up a snippet by id
  return undefined
}

export function updateSnippet(
  _id: string,
  _patch: { title?: string; language?: string; code?: string; favorite?: boolean; copy?: boolean },
): Snippet | undefined {
  // TODO: apply the patch (copy:true increments copyCount); return the snippet or undefined
  return undefined
}

export function deleteSnippet(_id: string): boolean {
  // TODO: remove the snippet; return whether it existed
  return false
}
