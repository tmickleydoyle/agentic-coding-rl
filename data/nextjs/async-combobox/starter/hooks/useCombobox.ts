import { useState } from 'react'
import type { Fetcher, Option } from '../components/types'

// TODO: return { query, setQuery, options, loading, error, open, highlight, moveUp, moveDown,
// choose, selectAt }. setQuery: update query, open=true, highlight=0, debounce a fetch by `delay`
// (cancel the prior one). Blank query => no fetch, clear options/loading/error. Guard out-of-order:
// only apply the latest request's result. resolve => set options, clear loading/error; reject =>
// error=message, options=[], clear loading. moveUp/moveDown wrap mod options.length (no-op if empty).
// choose(): if open and options non-empty, select options[highlight]. selectAt(id) selects by id.
// Selecting sets query to the label, open=false, and does NOT schedule a fetch.
export function useCombobox(fetchOptions: Fetcher, delay: number) {
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  return {
    query,
    setQuery: (_value: string) => {},
    options,
    loading,
    error,
    open,
    highlight,
    moveUp: () => {},
    moveDown: () => {},
    choose: () => {},
    selectAt: (_id: string) => {},
  }
}
