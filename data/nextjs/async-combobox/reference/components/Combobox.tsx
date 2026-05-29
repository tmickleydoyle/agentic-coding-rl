'use client'
import type { KeyboardEvent } from 'react'
import type { Fetcher } from './types'
import { useCombobox } from '../hooks/useCombobox'
import OptionItem from './OptionItem'

export default function Combobox({
  fetchOptions,
  delay = 200,
}: {
  fetchOptions: Fetcher
  delay?: number
}) {
  const {
    query,
    setQuery,
    options,
    loading,
    error,
    open,
    highlight,
    moveUp,
    moveDown,
    choose,
    selectAt,
  } = useCombobox(fetchOptions, delay)

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      moveDown()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      moveUp()
    } else if (e.key === 'Enter') {
      choose()
    }
  }

  const showEmpty =
    !loading && error === null && query.trim() !== '' && options.length === 0

  return (
    <div>
      <input
        data-testid="combo-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
      />
      {open && (
        <>
          {loading && <span data-testid="loading">Loading…</span>}
          {error !== null && <span data-testid="error">{error}</span>}
          {!loading && error === null && options.length > 0 && (
            <ul data-testid="listbox">
              {options.map((o, i) => (
                <OptionItem
                  key={o.id}
                  option={o}
                  active={i === highlight}
                  onSelect={selectAt}
                />
              ))}
            </ul>
          )}
          {showEmpty && <span data-testid="empty">No results</span>}
        </>
      )}
    </div>
  )
}
