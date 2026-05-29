import { useState } from 'react'

// TODO: implement. Return { query, setQuery, suggestions, choose, isOpen }.
// suggestions = case-insensitive substring matches of the trimmed query against options
// (original order), or [] when the query is empty/whitespace. isOpen = suggestions.length > 0.
// choose(value) sets the query to value and closes the list until the query changes again.
export function useAutocomplete(options: string[]) {
  const [query, setQuery] = useState('')
  return {
    query,
    setQuery: (_value: string) => {},
    suggestions: [] as string[],
    choose: (_value: string) => {},
    isOpen: false,
  }
}
