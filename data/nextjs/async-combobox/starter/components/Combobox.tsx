'use client'
import type { Fetcher } from './types'
import { useCombobox } from '../hooks/useCombobox'
import OptionItem from './OptionItem'

// TODO: <input data-testid="combo-input"> bound to query; ArrowDown->moveDown, ArrowUp->moveUp
// (preventDefault), Enter->choose. When open: <span data-testid="loading"> while loading;
// <span data-testid="error">{error}</span> on error; <ul data-testid="listbox"> of <OptionItem>
// (active at highlight) when there are options and not loading and no error;
// <span data-testid="empty">No results</span> when not loading, no error, query non-blank, options empty.
// Render nothing extra when not open.
export default function Combobox({
  fetchOptions,
  delay = 200,
}: {
  fetchOptions: Fetcher
  delay?: number
}) {
  const { query, setQuery } = useCombobox(fetchOptions, delay)
  return (
    <div>
      <input data-testid="combo-input" value={query} onChange={() => {}} />
    </div>
  )
}
