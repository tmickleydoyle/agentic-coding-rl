'use client'
import { useAutocomplete } from '../hooks/useAutocomplete'
import SuggestionList from './SuggestionList'

export default function Autocomplete({ options }: { options: string[] }) {
  const { query, setQuery, suggestions, choose, isOpen } = useAutocomplete(options)
  return (
    <div>
      <input
        data-testid="query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {isOpen && <SuggestionList items={suggestions} onPick={choose} />}
    </div>
  )
}
