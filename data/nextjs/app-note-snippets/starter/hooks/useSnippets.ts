'use client'
import { useApp } from '../components/AppStateProvider'
import type { Snippet } from '../lib/types'

export function collectLanguages(_snippets: Snippet[]): string[] {
  // TODO: return sorted unique languages across the snippets
  return []
}

export function filterSnippets(
  _snippets: Snippet[],
  _languageFilter: string | null,
  _searchQuery: string,
): Snippet[] {
  // TODO: apply language + case-insensitive title-search filters
  return []
}

export function useSnippets() {
  const { snippets } = useApp()
  void snippets
  // TODO: return visibleSnippets, languages, favorites, and selected.
  return {
    visibleSnippets: [] as Snippet[],
    languages: [] as string[],
    favorites: [] as Snippet[],
    selected: null as Snippet | null,
  }
}
