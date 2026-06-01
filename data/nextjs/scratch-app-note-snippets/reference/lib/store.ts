import type { Snippet } from './types'

let snippets: Snippet[] = []
let nextId = 1

function seed(): void {
  snippets = [
    { id: 's1', title: 'Debounce', language: 'js', code: 'const debounce = ...', favorite: false, copyCount: 0 },
    { id: 's2', title: 'Quick sort', language: 'python', code: 'def quicksort(a): ...', favorite: true, copyCount: 2 },
    { id: 's3', title: 'Flex center', language: 'css', code: '.c { display: flex; }', favorite: false, copyCount: 0 },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listSnippets(filter?: {
  language?: string | null
  favorite?: string | null
  q?: string | null
}): Snippet[] {
  let out = snippets.slice()
  const language = filter?.language
  if (language) out = out.filter((s) => s.language === language)
  const favorite = filter?.favorite
  if (favorite === 'true') out = out.filter((s) => s.favorite)
  const q = filter?.q
  if (q && q.trim().length > 0) {
    const needle = q.toLowerCase()
    out = out.filter((s) => s.title.toLowerCase().includes(needle))
  }
  return out
}

export function createSnippet(input: { title: string; language: string; code?: string }): Snippet {
  const snippet: Snippet = {
    id: `s${nextId++}`,
    title: input.title,
    language: input.language,
    code: input.code ?? '',
    favorite: false,
    copyCount: 0,
  }
  snippets.push(snippet)
  return snippet
}

export function findSnippet(id: string): Snippet | undefined {
  return snippets.find((s) => s.id === id)
}

export function updateSnippet(
  id: string,
  patch: { title?: string; language?: string; code?: string; favorite?: boolean; copy?: boolean },
): Snippet | undefined {
  const snippet = snippets.find((s) => s.id === id)
  if (!snippet) return undefined
  if (typeof patch.title === 'string') snippet.title = patch.title
  if (typeof patch.language === 'string') snippet.language = patch.language
  if (typeof patch.code === 'string') snippet.code = patch.code
  if (typeof patch.favorite === 'boolean') snippet.favorite = patch.favorite
  if (patch.copy === true) snippet.copyCount += 1
  return snippet
}

export function deleteSnippet(id: string): boolean {
  const idx = snippets.findIndex((s) => s.id === id)
  if (idx === -1) return false
  snippets.splice(idx, 1)
  return true
}
