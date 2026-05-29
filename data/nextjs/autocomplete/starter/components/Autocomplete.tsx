'use client'
import { useAutocomplete } from '../hooks/useAutocomplete'
import SuggestionList from './SuggestionList'

// TODO: render <input data-testid="query"> bound to the hook's query. When isOpen,
// render SuggestionList with the current suggestions (onPick = choose); otherwise render
// no list (the suggestions element must be ABSENT from the DOM).
export default function Autocomplete({ options }: { options: string[] }) {
  const { query, setQuery } = useAutocomplete(options)
  return (
    <div>
      <input data-testid="query" value={query} onChange={(e) => setQuery(e.target.value)} />
    </div>
  )
}
