import { useState } from 'react'

export function useAutocomplete(options: string[]) {
  const [query, setQueryState] = useState('')
  const [open, setOpen] = useState(false)

  const setQuery = (value: string) => {
    setQueryState(value)
    setOpen(true)
  }

  const choose = (value: string) => {
    setQueryState(value)
    setOpen(false)
  }

  const trimmed = query.trim().toLowerCase()
  const matches =
    trimmed.length === 0
      ? []
      : options.filter((o) => o.toLowerCase().includes(trimmed))
  const suggestions = open ? matches : []
  const isOpen = suggestions.length > 0

  return { query, setQuery, suggestions, choose, isOpen }
}
